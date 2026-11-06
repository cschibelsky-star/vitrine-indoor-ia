# Vitrine Indoor IA

Player autônomo de vitrine corporativa (TV corporativa / mídia indoor) desenvolvido para rodar localmente em displays 1536x864 (ou escalonado) com conteúdo de notícias, previsão do tempo, anúncios institucionais e widgets integrados.

## Características Principais

- **Player em HTML/CSS/JS autocontido**: assets embutidos em base64, sem dependências externas.
- **Layout de TV corporativa**: relógio, painel de notícias, coluna de publicidade, widgets (clima, locais de interesse, notícias externas).
- **Suporte a transições suaves e modo intro (`intro_vitrine.mp4`)**.
- **Painel técnico oculto**: exporte logs em JSON para auditoria (tecla T).
- **Ferramenta de auditoria** (`Auditor_Vitrine_Indoor_IA_V4_3.html`) para análise local dos registros de execução.
- **Homologação documentada** (HOMOLOGACAO_V4_4_2026-10-29.json) com sessão de 35+ minutos sem intervalos laterais > 20s.

## Como Executar (Local)

1. Extraia os arquivos em uma pasta local.
2. Abra `index.html` no Chrome ou Edge.
3. Pressione `F` para entrar em tela cheia.
4. Pressione `T` para abrir o painel técnico (se necessário) e exportar logs.
5. Importe os logs exportados em `Auditor_Vitrine_Indoor_IA_V4_3.html` para análise.

> Nota: o arquivo `intro_vitrine.mp4` deve permanecer no mesmo diretório de `index.html` para a animação de abertura funcionar.

## Estrutura da Versão Estável (V4.4)

- `index.html` — Player principal (V3.6 · Intro visível, player único).
- `Auditor_Vitrine_Indoor_IA_V4_3.html` — Ferramenta de auditoria local.
- `intro_vitrine.mp4` — Vídeo de abertura.
- `HOMOLOGACAO_V4_4_2026-10-29.json` — Registro de homologação (29/10/2026).
- `MANIFESTO_SHA256.json` — Manifesto de integridade SHA256 da versão.
- `LEIA-ME-V4.4.txt` e `LEIA-ME-RELEASE-ESTAVEL.txt` — Notas da versão e validações.

## Estado Atual

- ✅ Estável local (V4.4) com player preservado bit a bit.
- ✅ Sessão homologada >35 minutos com logs completos.
- ⚠️ Não houve deploy em VPS/servidor nesta fase (conforme nota do autor).
- 🔄 Janela oculta após 20 minutos e confirmação visual em tela cheia são os próximos passos pendentes de homologação.

## Autor

Cristiano (cschibelsky-star) — Vitrine IA Pro

---

*Este repositório visa centralizar, versionar e documentar o projeto Vitrine Indoor IA para evolução contínua e eventual integração com o ecossistema VIA / TV Sumaré.*
