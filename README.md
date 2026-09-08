# Raio-X do Posto — Grupo CRP

Landing page responsiva com formulário multi-etapas ("Raio-X do Posto"). O visitante responde perguntas sobre a operação do posto e recebe, na hora, o potencial estimado (Baixo / Médio / Alto / Muito Alto) para três soluções do Grupo CRP:

- **CapaXero** — receita a partir do fluxo de motos
- **CRP Charge** — infraestrutura de recarga para veículos elétricos
- **CRP Tank** — novas fontes de receita e infraestrutura para o posto

## Stack

HTML + CSS + JavaScript puros, sem build step nem dependências.

- [`index.html`](index.html) — estrutura da página
- [`style.css`](style.css) — identidade visual (fundo navy, gradientes azuis, tipografia Manrope)
- [`script.js`](script.js) — wizard de perguntas e motor de pontuação/recomendação

## Rodando localmente

Qualquer servidor estático funciona, por exemplo:

```bash
python -m http.server 8765
```

Depois acesse `http://localhost:8765`.

## Configuração

Antes de publicar, edite a constante `WHATSAPP_NUMBER` em [`script.js`](script.js) com o número comercial real do Grupo CRP (formato internacional, só dígitos) — é para lá que o botão final "Quero receber meu Raio-X completo" envia o resumo do diagnóstico do lead.
