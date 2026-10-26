# Gestor RAIDENS

Gestor de projetos e documentações da equipe RAIDENS: projetos, tópicos de documentação (Markdown), arquivos anexados, evolução (linha do tempo) e checklist do que falta.

**No ar em https://sesiraidens.github.io/raidens_manager/** — não precisa baixar nem instalar nada.

Site estático (HTML/CSS/JS) no GitHub Pages, com os dados salvos neste próprio repositório pela API do GitHub. Sem servidor e sem banco de dados.

## Como usar

- **Ver:** basta abrir o link. Qualquer pessoa vê os projetos, a documentação e os anexos.
- **Editar:** clique em **Liberar edição** e cole uma vez um token do GitHub. Ele fica guardado no seu navegador e não é pedido de novo nesse aparelho.

### Gerando o token (uma vez por pessoa)

1. Abra [Fine-grained tokens](https://github.com/settings/personal-access-tokens/new) → **Generate new token**.
2. *Resource owner*: **sesiraidens**.
3. *Repository access* → **Only select repositories** → **raidens_manager**.
4. *Permissions → Repository permissions → Contents*: **Read and write**.
5. Gere, copie e cole no gestor.

> O token **não** fica no código do site. Se ele fosse publicado aqui, o GitHub o revogaria automaticamente e o gestor pararia de salvar.

## Onde ficam os dados

No branch `dados` deste repositório:

- `data/db.json`: projetos, tópicos, checklist e evolução;
- `arquivos/<id-do-projeto>/`: os anexos (até 25 MB cada).

Cada alteração vira um commit, então existe histórico completo e dá para desfazer qualquer coisa pelo Git. Se duas pessoas salvarem ao mesmo tempo, o gestor junta as alterações em vez de uma apagar a outra.

## Rodando localmente (opcional)

Dá para rodar na sua máquina, sem passar pelo Pages:

- **Windows:** dois cliques em `iniciar.bat`.
- **macOS / Linux:** `./iniciar.sh` (precisa de `python3`).

Na primeira vez os scripts pedem o token e criam `js/config.local.js`, que está no `.gitignore`. Nunca faça commit desse arquivo.

## Publicação

O site é publicado pelo branch `gh-pages`. Ao mudar o código, envie para `main` e para `gh-pages`
(ou troque a fonte do Pages para `main` em *Settings → Pages*).
