# Vitrine Indoor IA

Player autônomo de vitrine corporativa (TV corporativa / mídia indoor) desenvolvido para rodar localmente ou em display dedicado (proporção 16:9, base 1536x864) com conteúdo de notícias, previsão do tempo, anúncios institucionais e widgets dinâmicos.

---

## 🚀 Inicialização Rápida

Você tem três opções para rodar o projeto:

### Opção 1: Dois cliques (Windows)
- Dê um duplo clique no arquivo `start.bat`. Ele iniciará o servidor local e abrirá o navegador em `http://localhost:8080`.

### Opção 2: Modo Desenvolvimento Moderno (Vite + TypeScript)
```bash
npm install
npm run dev   # Inicia servidor Vite com hot-reload (HMR)
```

### Opção 3: Servidor Leve Node.js (Range Requests para MP4)
```bash
npm start     # Inicia scripts/server.cjs na porta 8080
```
- **Player principal:** [http://localhost:8080/](http://localhost:8080/)
- **Auditor de logs:** [http://localhost:8080/auditor/](http://localhost:8080/auditor/)

### Opção 4: Compilação de Produção
```bash
npm run build # Compila TypeScript e gera bundle em /dist
```

### Opção 5: Versão Estática Autocontida (Offline)
- A versão autocontida original de 1 arquivo continua preservada em `docs/player_v44_autocontido_original.html`.

---

## ⌨️ Atalhos do Player

- **`F`**: Alternar para modo **Tela Cheia**.
- **`T`**: Exibir / Ocultar **Painel Técnico** (para inspeção de status e exportação do log JSON).

---

## 📁 Estrutura Organizada do Repositório

```
vitrine-indoor-ia/
├── index.html            # Player Principal (V3.6/V4.4)
├── intro_vitrine.mp4     # Vídeo institucional de abertura
├── Auditor_...html       # Auditor de integridade (espelhado na raiz)
├── start.bat             # Atalho para Windows
├── package.json          # Scripts e metadados npm
│
├── auditor/              # Ferramenta de auditoria (Auditor V4.3)
│   └── index.html        # Acessível via /auditor
│
├── assets/               # Peças visuais e molduras
│   └── moldura_aprovada.png
│
├── data/samples/         # Amostras reais de logs para testes do auditor
│   ├── exemplo_auditoria_v43.json
│   └── exemplo_registros_m11.json
│
├── docs/                 # Documentação técnica e manifestos de homologação
│   ├── ARQUITETURA.md    # Especificações de design, zonas e tempos
│   ├── HOMOLOGACAO_V4_4_2026-10-29.json
│   ├── MANIFESTO_SHA256.json
│   ├── LEIA-ME-V4.4.txt
│   └── LEIA-ME-RELEASE-ESTAVEL.txt
│
└── scripts/              # Servidores HTTP locais
    ├── server.js         # Servidor Node.js puro com streaming HTTP Range
    └── serve.py          # Servidor Python 3 padrão
```

---

## 🔍 Auditoria e Homologação

O player emite eventos estruturados a cada troca de notícia ou anúncio publicitário lateral (ciclos de 18s). Os logs gerados no painel técnico (`T`) podem ser carregados no Auditor para verificar:

1. Desvios de tempo acima de 1,5s.
2. Inícios e conclusões de anúncios laterais.
3. Ocorrências de janela oculta (background throttling do navegador).

Amostras de logs pré-gravados estão disponíveis em `data/samples/` para testes imediatos.

---

## 📄 Licença & Autor

- **Autor**: Cristiano ([cschibelsky-star](https://github.com/cschibelsky-star))
- **Organização**: Vitrine IA Pro
