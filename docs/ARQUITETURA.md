# Arquitetura do Player Vitrine Indoor IA

O layout do Vitrine Indoor IA é projetado para telas 1536x864 píxeis (proporção 16:9), escalonado dinamicamente para qualquer tela. Utiliza posicionamento absoluto, zonas fixas e animações de fade entre ciclos.

## 📐 Zonas do Layout (1536x864)

1. **Tela Global (`#screen`)**: `1536px x 864px`
   - Ponto de origem de escala; `transform-origin: 0 0` para calcular a escala dinâmica.
2. **Relógio (`#clock`)**: `(1317, 1) - 219x158`
   - Borda superior esquerda arredondada, gradiente azul (#006bef → #09309a).
   - Exibe data abreviada e horário atualizado.
3. **Feed Central de Notícias (`#news`)**: `(20, 163) - 1008x472`
   - Imagem de fundo cover, título, subtítulo, tag.
   - Transição entre itens via `fade` (~0.45s).
4. **Publicidade Lateral (`#ad`)**: `(1044, 164) - 477x587`
   - Fundo laranja (#ffac00) com imagem e overlay de gradiente.
   - Ciclo de rotação independente do feed de notícias (~18 segundos de permanência).
5. **Widgets Inferiores (`#widgets`)**: `(19, 646) - 1010x115`
   - Barra inferior com 3-4 widgets (Temperatura/Clima, Locais próximos, Agenda, Notícias externas).

## ⚙️ Funcionalidades e Regras

- **Escalonamento Automático**: O script JS ajusta `transform: scale()` para preencher a tela inteira mantendo a proporção.
- **Intro Institucional**: Se `intro_vitrine.mp4` estiver no mesmo diretório, um vídeo de abertura de 8 segundos é exibido antes de iniciar a programação (fade-out suave).
- **Painel Técnico (Tecla T)**:
  - Mostra botões de controle de mídia, status de execução e painel de exportação de logs (JSON).
  - Permite "forçar" exibição de publicidade lateral ou feed central para testes.
- **Mecanismo de Logs (Auditoria)**:
  - O player coleta eventos estruturados (`player_iniciado`, `conteudo_iniciado`, `anuncio_lateral_iniciado`, `conteudo_concluido`, `anuncio_lateral_concluido`, etc.).
  - Exporta esses logs para `vitrine_indoor_m11_registros_<data>.json`.
  - O `auditor/index.html` processa esses JSONs e gera relatórios de desvio de tempo e aderência à rotação lateral.

## 🗺️ Caminho da Estrutura do Repositório

```
/
├── index.html            # Player de Vitrine (Protagonista)
├── intro_vitrine.mp4     # Mídia de abertura
├── Auditor_...html       # Link/atual do auditor (espelhado)
├── start.bat             # Iniciador rápido no Windows
├── README.md             # Documentação geral e instruções de uso
├── package.json          # Scripts de automação (npm run dev / start)
│
├── assets/               # Imagens homologadas, molduras, previews
│   └── moldura_aprovada.png
│
├── auditor/              # Ferramenta de análise e homologação
│   └── index.html        # (Auditor V4.3 - Cópia funcional)
│
├── data/samples/         # Amostras de dados JSON para testes rápidos
│   ├── exemplo_auditoria_v43.json
│   └── exemplo_registros_m11.json
│
├── docs/                 # Documentação histórica e manifestos
│   ├── HOMOLOGACAO_V4_4_2026-10-29.json
│   ├── MANIFESTO_SHA256.json
│   ├── LEIA-ME-V4.4.txt
│   ├── LEIA-ME-RELEASE-ESTAVEL.txt
│   └── ARQUITETURA.md
│
└── scripts/              # Servidores de desenvolvimento
    ├── server.js         # Node.js puro (Range request suportado)
    └── serve.py          # Python 3 simples
```

## 📝 Próximos Passos & Evolução
1. Testar o suporte a Range Request via `scripts/server.js` para reproduzir vídeos grandes sem travamentos.
2. Criar um processo automatizado de validação de layout (headless chrome screenshot).
3. Integrar o repositório ao fluxo de CI/CD (se o projeto crescer para backend VPS).
