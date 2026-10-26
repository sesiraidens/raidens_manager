# Gestor RAIDENS

Gestor de projetos e documentações da equipe RAIDENS: projetos, tópicos de documentação (Markdown), arquivos anexados, evolução (linha do tempo) e checklist do que falta.

Site 100% estático (HTML/CSS/JS) hospedado no GitHub Pages. **Não precisa de servidor nem banco**: tudo é salvo neste próprio repositório pela API do GitHub.

## Como funciona

- **Leitura pública**: qualquer pessoa que abrir o site vê os projetos.
- **Edição**: clique em **Entrar para editar** e cole um token pessoal do GitHub. O token fica salvo só no navegador de quem entrou.
- **Onde ficam os dados**: no branch `dados`:
  - `data/db.json` guarda projetos, tópicos, checklist e evolução;
  - `arquivos/<id-do-projeto>/` guarda os anexos.
  Cada alteração vira um commit, então existe histórico completo e dá para desfazer qualquer coisa pelo Git.
- Edições simultâneas não se sobrescrevem: o site relê a versão mais recente e reaplica a alteração quando detecta conflito.

## Criando o token de edição

1. Acesse **GitHub → Settings → Developer settings → Fine-grained tokens → Generate new token** (https://github.com/settings/personal-access-tokens/new).
2. *Resource owner*: a organização/conta dona do repositório.
3. *Repository access*: **Only select repositories** → este repositório.
4. *Permissions → Repository permissions → Contents*: **Read and write**.
5. Gere o token e cole no site em **Entrar para editar**.

> Nunca coloque o token no código do site. Em um repositório público ele ficaria exposto e o GitHub o revogaria automaticamente.

## Limites

- Anexos de até 25 MB por arquivo (ajustável em `js/config.js`, limite prático da API do GitHub).
- Visitantes sem token usam a API pública do GitHub (60 leituras/hora por IP). Se acabar, o site lê pelo `raw.githubusercontent.com`, que pode mostrar dados com alguns minutos de atraso.

## Configuração

`js/config.js` detecta o repositório pela URL do Pages (`https://<owner>.github.io/<repo>/`). Para fixar outro repositório, preencha `owner` e `repo`.
