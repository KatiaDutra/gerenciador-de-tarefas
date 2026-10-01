const CORES = {
  azul: "#2563EB",
  verde: "#16A34A",
  amarelo: "#F59E0B",
  vermelho: "#DC2626",
  cinza: "#9CA3AF"
};

const PALETA = ["#2563EB", "#16A34A", "#F59E0B", "#DC2626", "#7C3AED", "#0891B2", "#DB2777", "#65A30D", "#EA580C", "#475569"];

const graficos = {};

// Data no fuso do próprio usuário, no formato AAAA-MM-DD
export function dataLocal(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function dataCriacao(tarefa) {
  return dataLocal(new Date(tarefa.id));
}

function diasEntre(inicioISO, fimISO) {
  const inicio = new Date(inicioISO + "T00:00:00");
  const fim = new Date(fimISO + "T00:00:00");
  return Math.round((fim - inicio) / 86400000);
}

function inicioDaSemana(data) {
  const copia = new Date(data);
  copia.setHours(0, 0, 0, 0);
  const diaDaSemana = (copia.getDay() + 6) % 7; // segunda-feira = 0
  copia.setDate(copia.getDate() - diaDaSemana);
  return copia;
}

function estaAtrasada(tarefa) {
  return tarefa.situacao === "pendente" && tarefa.prazo < dataLocal();
}

function calcularIndicadores(tarefas) {
  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => t.situacao === "concluida");
  const comData = concluidas.filter((t) => t.concluidaEm);

  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 6);
  const limiteSemana = dataLocal(seteDiasAtras);

  const ultimaSemana = comData.filter((t) => t.concluidaEm >= limiteSemana).length;

  const tempoMedio = comData.length
    ? comData.reduce((soma, t) => soma + diasEntre(dataCriacao(t), t.concluidaEm), 0) / comData.length
    : null;

  const noPrazo = comData.length
    ? comData.filter((t) => t.concluidaEm <= t.prazo).length / comData.length
    : null;

  return {
    taxa: total ? Math.round((concluidas.length / total) * 100) + "%" : "0%",
    semana: ultimaSemana,
    tempo: tempoMedio === null ? "—" : formatarDias(tempoMedio),
    prazo: noPrazo === null ? "—" : Math.round(noPrazo * 100) + "%"
  };
}

function formatarDias(dias) {
  if (dias < 1) return "Mesmo dia";
  const arredondado = Math.round(dias * 10) / 10;
  return arredondado.toString().replace(".", ",") + (arredondado === 1 ? " dia" : " dias");
}

function dadosPorSemana(tarefas, quantidade = 8) {
  const semanaAtual = inicioDaSemana(new Date());
  const semanas = [];

  for (let i = quantidade - 1; i >= 0; i--) {
    const inicio = new Date(semanaAtual);
    inicio.setDate(inicio.getDate() - i * 7);
    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + 6);
    semanas.push({ inicio: dataLocal(inicio), fim: dataLocal(fim), criadas: 0, concluidas: 0 });
  }

  tarefas.forEach((tarefa) => {
    const criada = dataCriacao(tarefa);
    const semanaCriada = semanas.find((s) => criada >= s.inicio && criada <= s.fim);
    if (semanaCriada) semanaCriada.criadas++;

    if (tarefa.concluidaEm) {
      const semanaConcluida = semanas.find((s) => tarefa.concluidaEm >= s.inicio && tarefa.concluidaEm <= s.fim);
      if (semanaConcluida) semanaConcluida.concluidas++;
    }
  });

  return semanas;
}

function desenhar(id, configuracao) {
  if (graficos[id]) graficos[id].destroy();
  graficos[id] = new Chart(document.getElementById(id), configuracao);
}

const opcoesBase = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom", labels: { boxWidth: 12, padding: 14 } }
  }
};

export function atualizarDashboard(tarefas, categorias) {
  const vazio = document.getElementById("estatisticas-vazio");
  const conteudo = document.getElementById("estatisticas-conteudo");

  if (tarefas.length === 0) {
    vazio.hidden = false;
    conteudo.hidden = true;
    return;
  }
  vazio.hidden = true;
  conteudo.hidden = false;

  // Indicadores
  const indicadores = calcularIndicadores(tarefas);
  document.getElementById("kpi-taxa").textContent = indicadores.taxa;
  document.getElementById("kpi-semana").textContent = indicadores.semana;
  document.getElementById("kpi-tempo").textContent = indicadores.tempo;
  document.getElementById("kpi-prazo").textContent = indicadores.prazo;

  // Situação atual
  const concluidas = tarefas.filter((t) => t.situacao === "concluida").length;
  const atrasadas = tarefas.filter(estaAtrasada).length;
  const noPrazo = tarefas.length - concluidas - atrasadas;

  desenhar("grafico-situacao", {
    type: "doughnut",
    data: {
      labels: ["Concluídas", "Pendentes no prazo", "Atrasadas"],
      datasets: [{
        data: [concluidas, noPrazo, atrasadas],
        backgroundColor: [CORES.verde, CORES.amarelo, CORES.vermelho],
        borderWidth: 0
      }]
    },
    options: { ...opcoesBase, cutout: "60%" }
  });

  // Criadas x concluídas por semana
  const semanas = dadosPorSemana(tarefas);
  desenhar("grafico-semanas", {
    type: "bar",
    data: {
      labels: semanas.map((s) => s.inicio.slice(8, 10) + "/" + s.inicio.slice(5, 7)),
      datasets: [
        { label: "Criadas", data: semanas.map((s) => s.criadas), backgroundColor: CORES.azul, borderRadius: 4 },
        { label: "Concluídas", data: semanas.map((s) => s.concluidas), backgroundColor: CORES.verde, borderRadius: 4 }
      ]
    },
    options: {
      ...opcoesBase,
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });

  // Por categoria: ranking da que tem mais tarefas para a que tem menos
  const totalPorCategoria = (c) => tarefas.filter((t) => t.categoria === c).length;
  const categoriasUsadas = categorias
    .filter((c) => totalPorCategoria(c) > 0)
    .sort((a, b) => totalPorCategoria(b) - totalPorCategoria(a));
  desenhar("grafico-categorias", {
    type: "bar",
    data: {
      labels: categoriasUsadas,
      datasets: [
        {
          label: "Concluídas",
          data: categoriasUsadas.map((c) => tarefas.filter((t) => t.categoria === c && t.situacao === "concluida").length),
          backgroundColor: CORES.verde,
          borderRadius: 4
        },
        {
          label: "Pendentes",
          data: categoriasUsadas.map((c) => tarefas.filter((t) => t.categoria === c && t.situacao === "pendente").length),
          backgroundColor: CORES.amarelo,
          borderRadius: 4
        }
      ]
    },
    options: {
      ...opcoesBase,
      indexAxis: "y",
      scales: {
        x: { stacked: true, beginAtZero: true, ticks: { precision: 0 } },
        y: { stacked: true }
      }
    }
  });

  // Proporção de tarefas por categoria
  const totais = categoriasUsadas.map(totalPorCategoria);
  desenhar("grafico-proporcao", {
    type: "doughnut",
    data: {
      labels: categoriasUsadas.map((c, i) => `${c} (${Math.round((totais[i] / tarefas.length) * 100)}%)`),
      datasets: [{
        data: totais,
        backgroundColor: categoriasUsadas.map((c, i) => PALETA[i % PALETA.length]),
        borderWidth: 0
      }]
    },
    options: {
      ...opcoesBase,
      cutout: "55%",
      plugins: {
        ...opcoesBase.plugins,
        tooltip: {
          callbacks: {
            label: (contexto) => ` ${contexto.raw} tarefa${contexto.raw === 1 ? "" : "s"}`
          }
        }
      }
    }
  });

  // Pendentes por prioridade
  const pendentes = tarefas.filter((t) => t.situacao === "pendente");
  desenhar("grafico-prioridades", {
    type: "bar",
    data: {
      labels: ["Alta", "Média", "Baixa"],
      datasets: [{
        label: "Pendentes",
        data: ["alta", "media", "baixa"].map((p) => pendentes.filter((t) => t.prioridade === p).length),
        backgroundColor: [CORES.vermelho, CORES.amarelo, CORES.azul],
        borderRadius: 4
      }]
    },
    options: {
      ...opcoesBase,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });
}
