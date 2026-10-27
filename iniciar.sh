#!/usr/bin/env bash
# Servidor local do Gestor RAIDENS (macOS / Linux). Requer python3.
cd "$(dirname "$0")"
if [ ! -f js/config.local.js ]; then
  echo "Primeira vez: cole o token do GitHub (Contents: Read and write no raidens_manager)."
  read -r -p "Token: " TOKEN
  read -r -p "Seu nome (aparece no histórico): " NOME
  printf "window.GESTOR_LOCAL = {\n  token: '%s',\n  nome: '%s'\n};\n" "$TOKEN" "$NOME" > js/config.local.js
fi
URL="http://localhost:8080/"
echo "Gestor RAIDENS rodando em $URL (Ctrl+C para desligar)"
( sleep 1; (command -v open >/dev/null && open "$URL") || (command -v xdg-open >/dev/null && xdg-open "$URL") ) >/dev/null 2>&1 &
python3 -m http.server 8080 --bind 127.0.0.1

