/* ============================================================
   Raio-X do Posto — Grupo CRP
   Formulário multi-etapas com motor de recomendação client-side.

   Configuração: troque o número abaixo pelo WhatsApp comercial
   do Grupo CRP (formato internacional, só dígitos) para ativar
   o botão final "Falar com um especialista".
   ============================================================ */
const WHATSAPP_NUMBER = "5511999999999"; // TODO: configurar número real

/* ---------------- dados do formulário ---------------- */

// Passo 0 (especial): campos de texto do lead
const LEAD_FIELDS = [
  { id: "nome", label: "Qual é o seu nome?", type: "text", placeholder: "Seu nome completo", required: true },
  { id: "posto", label: "Qual o nome do posto?", type: "text", placeholder: "Nome do posto", required: true },
  { id: "cidade", label: "Em qual cidade e estado o posto está localizado?", type: "text", placeholder: "Ex: Campinas - SP", required: true },
  { id: "whatsapp", label: "Qual o seu WhatsApp?", type: "tel", placeholder: "(11) 91234-5678", required: true },
];

// Perguntas de escolha única / múltipla, em ordem de exibição
const QUESTIONS = [
  {
    id: "papel",
    section: "Seus dados",
    type: "radio",
    q: "Qual o seu papel no posto?",
    options: ["Proprietário", "Sócio", "Gestor", "Diretor", "Outro"],
  },
  {
    id: "q6_veiculos",
    section: "Sobre a operação",
    type: "radio",
    q: "Em média, quantos veículos passam ou abastecem no posto por dia?",
    options: ["Até 300", "De 301 a 700", "De 701 a 1.500", "De 1.501 a 3.000", "Mais de 3.000", "Não sei informar"],
    score: {
      capaxero: [0, 1, 1, 2, 3, 0],
      charge: [0, 1, 1, 2, 3, 0],
      tanque: [0, 1, 2, 3, 3, 0],
    },
  },
  {
    id: "q7_motos",
    section: "Sobre a operação",
    type: "radio",
    q: "Como você considera o fluxo de motos no posto?",
    options: ["Baixo", "Médio", "Alto", "Muito alto"],
    score: {
      capaxero: [0, 2, 4, 6],
      charge: [0, 0, 0, 0],
      tanque: [0, 1, 1, 2],
    },
  },
  {
    id: "q8_24h",
    section: "Sobre a operação",
    type: "radio",
    q: "O posto funciona 24 horas?",
    options: ["Sim", "Não"],
    score: { capaxero: [1, 0], charge: [2, 0], tanque: [2, 0] },
  },
  {
    id: "q9_conveniencia",
    section: "Sobre a operação",
    type: "radio",
    q: "O posto possui loja de conveniência?",
    options: ["Sim", "Não"],
    score: { capaxero: [1, 0], charge: [1, 0], tanque: [2, 0] },
  },
  {
    id: "q10_area",
    section: "Sobre a operação",
    type: "radio",
    q: "Existe área disponível para instalação de novos equipamentos ou serviços?",
    options: ["Sim, bastante espaço", "Sim, espaço limitado", "Talvez", "Não sei", "Não"],
    score: {
      capaxero: [3, 2, 1, 0, 0],
      charge: [3, 2, 1, 0, 0],
      tanque: [3, 2, 1, 0, 0],
    },
  },
  {
    id: "q11_estacionamento",
    section: "Sobre a operação",
    type: "radio",
    q: "O posto possui estacionamento ou área onde um veículo possa permanecer por 20 a 60 minutos?",
    options: ["Sim", "Não", "Depende do horário"],
    score: { capaxero: [0, 0, 0], charge: [3, 0, 1], tanque: [1, 0, 0] },
  },
  {
    id: "q12_carregador",
    section: "Sobre a operação",
    type: "radio",
    q: "Já existe carregador para veículos elétricos no local?",
    options: ["Sim e está em operação", "Sim, mas é pouco utilizado", "Não", "Estamos avaliando instalar"],
    score: { capaxero: [0, 0, 0, 0], charge: [0, 2, 3, 3], tanque: [0, 0, 0, 0] },
  },
  {
    id: "q13_energia",
    section: "Sobre a operação",
    type: "radio",
    q: "Como é o fornecimento de energia do posto?",
    options: ["Temos boa disponibilidade de energia", "Temos limitações de carga", "Não sei informar"],
    score: { capaxero: [0, 0, 0], charge: [3, 0, 1], tanque: [1, 0, 0] },
  },
  {
    id: "q14_fluxos",
    section: "Contexto e oportunidades",
    type: "checkbox",
    q: "O posto atende ou está próximo de algum desses fluxos?",
    hint: "Marque quantos quiser.",
    options: [
      "Condomínios", "Shopping ou comércio", "Supermercado", "Academia",
      "Hospital ou clínica", "Rodovia", "Centro empresarial", "Restaurantes",
      "Motoristas de aplicativo", "Motoboys", "Frotas", "Nenhum desses", "Outros",
    ],
    // pontos por opção marcada
    score: {
      capaxero: [0, 0, 0, 0, 0, 1, 0, 2, 2, 3, 0, 0, 0],
      charge: [2, 1, 0, 1, 2, 0, 2, 0, 0, 0, 1, 0, 0],
      tanque: [0, 1, 1, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0],
    },
  },
  {
    id: "q15_oportunidade",
    section: "Contexto e oportunidades",
    type: "radio",
    q: "Qual destas oportunidades mais chama sua atenção hoje?",
    options: [
      "Gerar receita com o fluxo de motos",
      "Entrar no mercado de recarga elétrica",
      "Criar novas fontes de receita dentro do posto",
      "Modernizar a operação",
      "Quero entender todas as possibilidades",
    ],
    score: {
      capaxero: [4, 0, 1, 1, 1],
      charge: [0, 4, 1, 1, 1],
      tanque: [0, 0, 4, 2, 1],
    },
  },
  {
    id: "q16_intencao",
    section: "Contexto e oportunidades",
    type: "radio",
    q: "Se houver uma oportunidade viável para o seu posto, qual seria sua intenção?",
    options: ["Quero investir", "Tenho interesse em parceria", "Quero entender modelos sem precisar operar", "Ainda estou avaliando"],
  },
  {
    id: "q17_prazo",
    section: "Contexto e oportunidades",
    type: "radio",
    q: "Em quanto tempo você gostaria de colocar uma nova operação para funcionar?",
    options: ["Imediatamente", "Nos próximos 3 meses", "De 3 a 6 meses", "Nos próximos 12 meses", "Apenas pesquisando por enquanto"],
  },
];

const SOLUTIONS = {
  capaxero: {
    title: "CapaXero",
    desc: "Higienização e serviços de autoatendimento para motociclistas — transforma o fluxo de motos do posto em nova receita recorrente.",
  },
  charge: {
    title: "CRP Charge",
    desc: "Infraestrutura e operação para recarga de veículos elétricos, de 22 kW a 120 kW, com gestão inteligente.",
  },
  tanque: {
    title: "CRP Tanque",
    desc: "Novas soluções de receita e infraestrutura dentro do próprio posto, unindo tecnologia e inteligência de negócio.",
  },
};

/* ---------------- estado ---------------- */
// steps: 0 = lead fields, 1..N = QUESTIONS, N+1 = results
const totalSteps = 1 + QUESTIONS.length;
let currentStep = 0;
const answers = {}; // { fieldId: value|array }

/* ---------------- elementos ---------------- */
const introEl = document.getElementById("intro");
const stepView = document.getElementById("stepView");
const resultsView = document.getElementById("resultsView");
const startBtn = document.getElementById("startBtn");
const progressWrap = document.getElementById("progressWrap");
const progressFill = document.getElementById("progressFill");
const progressLabel = document.getElementById("progressLabel");
const progressPct = document.getElementById("progressPct");

document.getElementById("year").textContent = new Date().getFullYear();

startBtn.addEventListener("click", () => {
  introEl.hidden = true;
  progressWrap.hidden = false;
  stepView.hidden = false;
  renderStep();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------------- render ---------------- */
function renderStep() {
  updateProgress();

  if (currentStep === 0) {
    renderLeadStep();
  } else {
    renderQuestionStep(QUESTIONS[currentStep - 1]);
  }
}

function updateProgress() {
  const pct = Math.round((currentStep / totalSteps) * 100);
  progressFill.style.width = pct + "%";
  progressLabel.textContent = `Passo ${currentStep + 1} de ${totalSteps}`;
  progressPct.textContent = pct + "%";
}

function renderLeadStep() {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <div class="section-tag">Seus dados</div>
    <h2>Antes de começar, conte um pouco sobre você</h2>
    <p class="hint">Usamos esses dados só para personalizar o seu resultado.</p>
  `;
  LEAD_FIELDS.forEach((f) => {
    const field = document.createElement("div");
    field.className = "field";
    field.innerHTML = `
      <label for="${f.id}">${f.label}</label>
      <input type="${f.type}" id="${f.id}" placeholder="${f.placeholder || ""}" value="${answers[f.id] ? escapeAttr(answers[f.id]) : ""}">
    `;
    wrap.appendChild(field);
  });

  const nav = buildNav({
    backDisabled: true,
    onNext: () => {
      let ok = true;
      LEAD_FIELDS.forEach((f) => {
        const input = document.getElementById(f.id);
        const val = input.value.trim();
        if (f.required && !val) {
          input.style.borderColor = "#ff6b6b";
          ok = false;
        } else {
          answers[f.id] = val;
        }
      });
      if (!ok) return;
      goNext();
    },
  });

  stepView.replaceChildren(wrap, nav);
}

function renderQuestionStep(question) {
  const wrap = document.createElement("div");
  const selected = answers[question.id];

  const optionsHtml = question.options
    .map((opt, i) => {
      const isChecked = question.type === "checkbox" ? Array.isArray(selected) && selected.includes(i) : selected === i;
      return `
        <div class="option ${question.type === "radio" ? "radio" : ""} ${isChecked ? "selected" : ""}" data-index="${i}" role="${question.type === "radio" ? "radio" : "checkbox"}" aria-checked="${isChecked}" tabindex="0">
          <span class="box">
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#08111f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <span class="label">${opt}</span>
        </div>
      `;
    })
    .join("");

  wrap.innerHTML = `
    <div class="section-tag">${question.section}</div>
    <h2>${question.q}</h2>
    ${question.hint ? `<p class="hint">${question.hint}</p>` : ""}
    <div class="options" id="optionsList">${optionsHtml}</div>
  `;

  wrap.querySelectorAll(".option").forEach((el) => {
    const select = () => {
      const idx = Number(el.dataset.index);
      if (question.type === "checkbox") {
        const arr = Array.isArray(answers[question.id]) ? [...answers[question.id]] : [];
        const pos = arr.indexOf(idx);
        if (pos >= 0) arr.splice(pos, 1);
        else arr.push(idx);
        answers[question.id] = arr;
      } else {
        answers[question.id] = idx;
      }
      renderQuestionStep(question);
    };
    el.addEventListener("click", select);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        select();
      }
    });
  });

  const answered = question.type === "checkbox" ? Array.isArray(selected) && selected.length > 0 : typeof selected === "number";

  const nav = buildNav({
    backDisabled: false,
    nextDisabled: !answered,
    onNext: () => goNext(),
  });

  stepView.replaceChildren(wrap, nav);
}

function buildNav({ backDisabled, nextDisabled, onNext }) {
  const nav = document.createElement("div");
  nav.className = "nav-row";
  nav.innerHTML = `
    <button class="btn btn-ghost" id="backBtn" ${backDisabled ? "disabled style='visibility:hidden'" : ""}>Voltar</button>
    <button class="btn btn-primary" id="nextBtn" ${nextDisabled ? "disabled" : ""}>${currentStep === totalSteps - 1 ? "Ver meu Raio-X" : "Avançar"}</button>
  `;
  nav.querySelector("#backBtn").addEventListener("click", goBack);
  nav.querySelector("#nextBtn").addEventListener("click", onNext);
  return nav;
}

function goNext() {
  if (currentStep < totalSteps - 1) {
    currentStep++;
    renderStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    showResults();
  }
}

function goBack() {
  if (currentStep === 0) return;
  currentStep--;
  renderStep();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------------- pontuação ---------------- */
// máximo teórico de uma pergunta checkbox = soma de todos os pontos positivos (todas opções marcadas)
function maxForCheckbox(points) {
  return points.reduce((a, b) => a + Math.max(b, 0), 0);
}

function levelFromPct(pct) {
  if (pct >= 75) return { key: "muito-alto", label: "Muito Alto" };
  if (pct >= 50) return { key: "alto", label: "Alto" };
  if (pct >= 25) return { key: "medio", label: "Médio" };
  return { key: "baixo", label: "Baixo" };
}

/* ---------------- resultados ---------------- */
function showResults() {
  stepView.hidden = true;
  progressWrap.hidden = true;
  resultsView.hidden = false;

  const pct = computeScoresPrecise();
  const ranked = Object.entries(pct).sort((a, b) => b[1] - a[1]);
  const topSolution = SOLUTIONS[ranked[0][0]].title;

  const cardsHtml = ranked
    .map(([sol, p]) => {
      const level = levelFromPct(p);
      const info = SOLUTIONS[sol];
      return `
        <div class="result-card">
          <div class="rc-top">
            <div class="rc-title">${info.title}</div>
            <span class="level-badge level-${level.key}">${level.label}</span>
          </div>
          <p class="rc-desc">${info.desc}</p>
          <div class="meter"><div style="width:${p}%"></div></div>
        </div>
      `;
    })
    .join("");

  const waMessage = buildWhatsAppMessage(pct);
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  resultsView.innerHTML = `
    <div class="results-head">
      <span class="badge-ok">✓ Raio-X concluído</span>
      <h2>Seu posto tem maior potencial em <span style="color:var(--blue-light)">${topSolution}</span></h2>
      <p>Olá, <span class="name">${escapeHtml(answers.nome || "")}</span>! O principal ativo do <strong>${escapeHtml(answers.posto || "seu posto")}</strong> você já possui: fluxo. Veja abaixo o potencial estimado para cada solução do Grupo CRP.</p>
    </div>
    <div class="result-cards">${cardsHtml}</div>
    <div class="cta-block">
      <a class="btn btn-primary" style="display:block;text-decoration:none;text-align:center" href="${waHref}" target="_blank" rel="noopener">Quero receber meu Raio-X completo</a>
      <p>Um especialista do Grupo CRP vai analisar sua operação em detalhe e te chamar no WhatsApp.</p>
    </div>
  `;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// versão corrigida do cálculo de máximo (checkbox soma todas as opções positivas)
function computeScoresPrecise() {
  const totals = { capaxero: 0, charge: 0, tanque: 0 };
  const max = { capaxero: 0, charge: 0, tanque: 0 };

  QUESTIONS.forEach((q) => {
    if (!q.score) return;
    const val = answers[q.id];

    Object.keys(totals).forEach((sol) => {
      const points = q.score[sol];
      if (!points) return;
      max[sol] += q.type === "checkbox" ? maxForCheckbox(points) : Math.max(...points);
    });

    if (q.type === "checkbox") {
      const arr = Array.isArray(val) ? val : [];
      Object.keys(totals).forEach((sol) => {
        const points = q.score[sol];
        if (!points) return;
        arr.forEach((idx) => (totals[sol] += points[idx] || 0));
      });
    } else if (typeof val === "number") {
      Object.keys(totals).forEach((sol) => {
        const points = q.score[sol];
        if (!points) return;
        totals[sol] += points[val] || 0;
      });
    }
  });

  const pct = {};
  Object.keys(totals).forEach((sol) => {
    pct[sol] = max[sol] > 0 ? Math.min(100, Math.round((totals[sol] / max[sol]) * 100)) : 0;
  });
  return pct;
}

function buildWhatsAppMessage(pct) {
  const lines = [
    `Olá! Acabei de fazer o Raio-X do Posto (Grupo CRP).`,
    `Nome: ${answers.nome || "-"}`,
    `Posto: ${answers.posto || "-"}`,
    `Cidade/UF: ${answers.cidade || "-"}`,
    ``,
    `Resultado:`,
    `- CapaXero: ${pct.capaxero}% (${levelFromPct(pct.capaxero).label})`,
    `- CRP Charge: ${pct.charge}% (${levelFromPct(pct.charge).label})`,
    `- CRP Tanque: ${pct.tanque}% (${levelFromPct(pct.tanque).label})`,
    ``,
    `Quero receber a análise completa e falar com um especialista.`,
  ];
  return lines.join("\n");
}

/* ---------------- utils ---------------- */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escapeAttr(str) {
  return escapeHtml(str);
}
