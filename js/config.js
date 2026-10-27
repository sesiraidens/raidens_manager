// Configuração do Gestor RAIDENS.
// O token de acesso NÃO fica aqui: ele vai em js/config.local.js (ignorado pelo Git).
window.GESTOR_CONFIG = {
  owner: 'sesiraidens',
  repo: 'raidens_manager',
  dataBranch: 'dados',  // branch onde ficam o banco (JSON) e os anexos
  dbPath: 'data/db.json',
  filesDir: 'arquivos',
  maxUploadMB: 25,
  // Logo oficial RAIDENS, baixado de https://sesiraidens.github.io/portifolio/assets/logo_color-aNRVU26Y.png
  logo: 'assets/logo_color.png'
};
