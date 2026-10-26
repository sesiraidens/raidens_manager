# Gestor RAIDENS

Gestor de projetos e documentações da equipe RAIDENS: projetos, tópicos de documentação (Markdown), arquivos anexados, evolução (linha do tempo) e checklist do que falta.

Roda **localmente** (localhost) e salva tudo **no GitHub**, neste repositório. Não precisa de servidor, banco de dados ou login: o token fica num arquivo local que nunca vai para o Git.

## Como usar

1. Baixe o projeto (**Code → Download ZIP**, ou `git clone`).
2. Inicie:
   - **Windows:** dê dois cliques em `iniciar.bat`.
   - **macOS / Linux:** rode `./iniciar.sh` (precisa de `python3`).
3. Na primeira vez, cole o token do GitHub e o seu nome. Eles ficam salvos em `js/config.local.js`.
4. O navegador abre em **http://localhost:8080**. Deixe a janela do servidor aberta enquanto usa.

Todos que rodarem o gestor veem e editam os mesmos dados, porque tudo é salvo no GitHub.

## O token

Use um token com acesso ao repositório `sesiraidens/raidens_manager` e permissão **Contents: Read and write**
(GitHub → Settings → Developer settings → Fine-grained tokens).

O token fica só em `js/config.local.js`, que está no `.gitignore`. **Nunca faça commit desse arquivo**: o GitHub revoga na hora qualquer token publicado num repositório público, e o gestor para de salvar. Para criar o arquivo manualmente, copie `js/config.local.example.js`.

## Onde ficam os dados

No branch `dados` deste repositório:
- `data/db.json`: projetos, tópicos, checklist e evolução;
- `arquivos/<id-do-projeto>/`: os anexos (até 25 MB cada).

Cada alteração vira um commit, então existe histórico completo. Se duas pessoas salvarem ao mesmo tempo, o gestor junta as alterações em vez de uma apagar a outra.
