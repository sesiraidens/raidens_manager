# Servidor local do Gestor RAIDENS (Windows, sem instalar nada).
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8080
$local = Join-Path $root 'js\config.local.js'

if (-not (Test-Path $local)) {
  Write-Host ''
  Write-Host 'Primeira vez: cole o token do GitHub (Contents: Read and write no raidens_manager).' -ForegroundColor Yellow
  $token = Read-Host 'Token'
  $nome = Read-Host 'Seu nome (aparece no historico)'
  "window.GESTOR_LOCAL = {`n  token: '$($token.Trim())',`n  nome: '$($nome.Trim())'`n};`n" | Set-Content -Encoding UTF8 $local
}

$types = @{ '.html'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.png'='image/png'; '.svg'='image/svg+xml'; '.json'='application/json'; '.ico'='image/x-icon'; '.md'='text/plain; charset=utf-8' }
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
$url = "http://localhost:$port/"
Write-Host ''
Write-Host "Gestor RAIDENS rodando em $url" -ForegroundColor Green
Write-Host 'Deixe esta janela aberta. Feche-a para desligar.'
Start-Process $url

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
  $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
  if ($path -eq '') { $path = 'index.html' }
  $file = [IO.Path]::GetFullPath((Join-Path $root $path))
  $res = $ctx.Response
  if ($file.StartsWith($root) -and (Test-Path $file -PathType Leaf)) {
    $bytes = [IO.File]::ReadAllBytes($file)
    $ext = [IO.Path]::GetExtension($file).ToLower()
    $res.ContentType = if ($types[$ext]) { $types[$ext] } else { 'application/octet-stream' }
    $res.Headers.Add('Cache-Control', 'no-store')
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $res.StatusCode = 404
  }
  $res.Close()
  } catch { try { $ctx.Response.Abort() } catch {} }
}
