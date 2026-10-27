<div align="center">

<img src="https://sesiraidens.github.io/portifolio/assets/logo_color-aNRVU26Y.png" alt="Logo RAIDENS" width="140">

# Gestor RAIDENS

**Projetos, documentação, anexos e checklists da equipe em um só lugar, sem servidor e sem banco de dados**

![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-online-222222?style=flat-square&logo=githubpages&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

### [Abrir o gestor →](https://sesiraidens.github.io/raidens_manager/)

[Sobre](#sobre) · [Como usar](#como-usar) · [Token](#gerando-o-token) · [Dados](#onde-ficam-os-dados) · [Rodar localmente](#rodando-localmente)

</div>

---

## Sobre

O **Gestor RAIDENS** é onde a equipe acompanha cada projeto: tópicos de documentação em Markdown, arquivos anexados, linha do tempo da evolução e checklist do que falta fazer.

É um site estático publicado no GitHub Pages. Os dados ficam salvos **neste próprio repositório**, pela API do GitHub. Isso traz três vantagens:

- **Nada para manter.** Não existe servidor nem banco de dados.
- **Histórico completo.** Cada alteração vira um commit, então dá para ver quem mudou o quê e desfazer qualquer coisa pelo Git.
- **Edição simultânea segura.** Se duas pessoas salvarem ao mesmo tempo, o gestor junta as alterações em vez de uma apagar a outra.

## Como usar

| Quero... | Como |
|---|---|
| **Ver** projetos, documentação e anexos | Abra o link. Não precisa de login. |
| **Editar** | Clique em **Liberar edição** e cole um token do GitHub uma única vez. Ele fica guardado no seu navegador. |

## Gerando o token

Cada pessoa gera o seu, uma vez só:

1. Abra [Fine-grained tokens](https://github.com/settings/personal-access-tokens/new) e clique em **Generate new token**.
2. Em *Resource owner*, escolha **sesiraidens**.
3. Em *Repository access*, marque **Only select repositories** e selecione **raidens_manager**.
4. Em *Permissions → Repository permissions → Contents*, escolha **Read and write**.
5. Gere, copie e cole no gestor.

> [!IMPORTANT]
> O token **nunca** vai para o código do site. Se ele fosse publicado aqui, o GitHub o revogaria automaticamente e o gestor pararia de salvar.

## Onde ficam os dados

Tudo fica no branch `dados` deste repositório:

| Caminho | Conteúdo |
|---|---|
| `data/db.json` | Projetos, tópicos, checklist e evolução |
| `arquivos/<id-do-projeto>/` | Anexos, com até 25 MB cada |

## Rodando localmente

Opcional, para quem quer usar sem passar pelo GitHub Pages:

| Sistema | Comando |
|---|---|
| Windows | Dois cliques em `iniciar.bat` |
| macOS / Linux | `./iniciar.sh` (requer `python3`) |

Na primeira vez, os scripts pedem o token e o seu nome e criam `js/config.local.js`. Esse arquivo está no `.gitignore`.

> [!WARNING]
> Nunca faça commit do `js/config.local.js`.

## Publicação

O site é servido pelo branch `gh-pages`. Ao alterar o código, envie para `main` e para `gh-pages`, ou mude a fonte do Pages para `main` em *Settings → Pages*.

## Estrutura

```text
raidens_manager/
├── index.html
├── css/                 # Estilos
├── js/
│   ├── app.js           # Interface e regras do gestor
│   ├── github.js        # Leitura e gravação pela API do GitHub
│   ├── config.js        # Configuração pública
│   └── vendor/          # marked (Markdown) e DOMPurify (sanitização)
├── iniciar.bat          # Servidor local no Windows
├── servidor.ps1
└── iniciar.sh           # Servidor local no macOS / Linux
```

---

<div align="center">

<img src="https://sesiraidens.github.io/portifolio/assets/logo_color-aNRVU26Y.png" alt="Logo RAIDENS" width="56">

**Equipe RAIDENS** · SESI 192 Alumínio/SP

[![Email](https://img.shields.io/badge/Email-sesiraidens%40gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:sesiraidens@gmail.com)
[![Linktree](https://img.shields.io/badge/Linktree-sesiraidens-39E06B?style=flat-square&logo=linktree&logoColor=white)](https://linktr.ee/sesiraidens)
[![GitHub](https://img.shields.io/badge/GitHub-sesiraidens-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/sesiraidens)

</div>


