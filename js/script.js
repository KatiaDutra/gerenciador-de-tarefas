const modal = document.getElementById("modal-tarefa");
const btnNovaTarefa = document.getElementById("btn-nova-tarefa");
const btnFecharModal = document.getElementById("btn-fechar-modal");
const formTarefa = document.getElementById("form-tarefa");

const campoDescricao = document.getElementById("descricao");
const campoCategoria = document.getElementById("categoria");
const campoPrioridade = document.getElementById("prioridade");
const campoPrazo = document.getElementById("prazo");

const listaTarefas = document.getElementById("lista-tarefas");
const estadoVazio = document.getElementById("estado-vazio");
const totalTarefasEl = document.getElementById("total-tarefas");
const pendentesTarefasEl = document.getElementById("pendentes-tarefas");
const concluidasTarefasEl = document.getElementById("concluidas-tarefas");

const botoesFiltroSituacao = document.querySelectorAll(".filtro-situacao");
const listaCategorias = document.getElementById("lista-categorias");
const formCategoria = document.getElementById("form-categoria");
const campoNovaCategoria = document.getElementById("nova-categoria");

const btnSalvarTarefa = document.getElementById("btn-salvar-tarefa");
const btnExcluirConcluidas = document.getElementById("btn-excluir-concluidas");
const selectOrdenacao = document.getElementById("select-ordenacao");

let idEmEdicao = null;
let ordenacaoAtual = "criacao";

let tarefas = [];
let categorias = ["Trabalho", "Estudos", "Pessoal", "Saúde", "Casa"];
let filtroSituacaoAtual = "todas";
let filtroCategoriaAtual = null;

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
  const textoSalvo = localStorage.getItem("tarefas");
  if (textoSalvo) {
    tarefas = JSON.parse(textoSalvo);
  }
}

function salvarCategorias() {
  localStorage.setItem("categorias", JSON.stringify(categorias));
}

function carregarCategorias() {
  const textoSalvo = localStorage.getItem("categorias");
  if (textoSalvo) {
    categorias = JSON.parse(textoSalvo);
  }
}

function pesoPrioridade(prioridade) {
  if (prioridade === "alta") return 0;
  if (prioridade === "media") return 1;
  return 2;
}

function estaAtrasada(tarefa) {
  if (tarefa.situacao !== "pendente") return false;
  const hoje = new Date().toISOString().split("T")[0];
  return tarefa.prazo < hoje;
}

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

function exibirCategorias() {
  listaCategorias.innerHTML = "";
  campoCategoria.innerHTML = '<option value="">Selecione</option>';

  categorias.forEach((categoria) => {
    const item = document.createElement("li");
    item.textContent = categoria;
    item.dataset.categoria = categoria;
    listaCategorias.appendChild(item);

    const opcao = document.createElement("option");
    opcao.value = categoria;
    opcao.textContent = categoria;
    campoCategoria.appendChild(opcao);
  });
}

function exibirTarefas() {
  let tarefasFiltradas = tarefas.filter((tarefa) => {
    const passaSituacao =
      filtroSituacaoAtual === "todas" || tarefa.situacao === filtroSituacaoAtual;
    const passaCategoria =
      !filtroCategoriaAtual || tarefa.categoria === filtroCategoriaAtual;
    return passaSituacao && passaCategoria;
  });

  if (ordenacaoAtual === "prioridade") {
    tarefasFiltradas.sort((a, b) => pesoPrioridade(a.prioridade) - pesoPrioridade(b.prioridade));
  } else if (ordenacaoAtual === "prazo") {
    tarefasFiltradas.sort((a, b) => a.prazo.localeCompare(b.prazo));
  }

  listaTarefas.innerHTML = "";

  tarefasFiltradas.forEach((tarefa) => {
    const card = document.createElement("article");
    card.className = "tarefa";
    if (tarefa.situacao === "concluida") {
      card.classList.add("tarefa--concluida");
    }

    card.innerHTML = `
      <h3 class="tarefa__descricao">${tarefa.descricao}</h3>
      <p class="tarefa__categoria">${tarefa.categoria}</p>
      <p class="tarefa__prioridade">Prioridade: ${tarefa.prioridade}</p>
      <p class="tarefa__prazo">Prazo: ${formatarData(tarefa.prazo)}</p>
      <div class="tarefa__acoes">
        <button class="botao--editar" data-id="${tarefa.id}">Editar</button>
        <button class="botao--excluir" data-id="${tarefa.id}">Excluir</button>
        <button class="botao--concluir" data-id="${tarefa.id}">
          ${tarefa.situacao === "concluida" ? "Desfazer" : "Concluir"}
        </button>
      </div>
    `;

    listaTarefas.appendChild(card);
  });

  estadoVazio.hidden = tarefas.length > 0;
}

function atualizarIndicadores() {
  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => t.situacao === "concluida").length;
  const pendentes = total - concluidas;
  const percentual = total === 0 ? 0 : Math.round((concluidas / total) * 100);
  const atrasadas = tarefas.filter(estaAtrasada).length;

  totalTarefasEl.textContent = total;
  pendentesTarefasEl.textContent = pendentes;
  concluidasTarefasEl.textContent = concluidas;
  document.getElementById("percentual-tarefas").textContent = percentual + "%";
  document.getElementById("atrasadas-tarefas").textContent = atrasadas;
}

function adicionarTarefa() {
  const novaTarefa = {
    id: Date.now(),
    descricao: campoDescricao.value,
    categoria: campoCategoria.value,
    prioridade: campoPrioridade.value,
    prazo: campoPrazo.value,
    situacao: "pendente"
  };

  tarefas.push(novaTarefa);
  salvarTarefas();
}

function atualizarTarefa(id) {
  const tarefa = tarefas.find((t) => t.id === id);
  if (!tarefa) return;

  tarefa.descricao = campoDescricao.value;
  tarefa.categoria = campoCategoria.value;
  tarefa.prioridade = campoPrioridade.value;
  tarefa.prazo = campoPrazo.value;

  salvarTarefas();
}

function excluirTarefa(id) {
  const confirmou = confirm("Deseja realmente excluir esta tarefa?");
  if (!confirmou) return;

  tarefas = tarefas.filter((tarefa) => tarefa.id !== id);
  salvarTarefas();
  exibirTarefas();
  atualizarIndicadores();
}

function alternarConclusao(id) {
  const tarefa = tarefas.find((tarefa) => tarefa.id === id);
  tarefa.situacao = tarefa.situacao === "concluida" ? "pendente" : "concluida";

  salvarTarefas();
  exibirTarefas();
  atualizarIndicadores();
}

function entrarModoEdicao(id) {
  const tarefa = tarefas.find((t) => t.id === id);
  if (!tarefa) return;

  idEmEdicao = id;

  campoDescricao.value = tarefa.descricao;
  campoCategoria.value = tarefa.categoria;
  campoPrioridade.value = tarefa.prioridade;
  campoPrazo.value = tarefa.prazo;

  btnSalvarTarefa.textContent = "Salvar alterações";
  modal.hidden = false;
}

function validarFormulario() {
  let valido = true;

  document.getElementById("erro-descricao").textContent = "";
  document.getElementById("erro-categoria").textContent = "";
  document.getElementById("erro-prioridade").textContent = "";
  document.getElementById("erro-prazo").textContent = "";

  if (campoDescricao.value.trim() === "") {
    document.getElementById("erro-descricao").textContent = "Informe uma descrição.";
    valido = false;
  }
  if (campoCategoria.value === "") {
    document.getElementById("erro-categoria").textContent = "Selecione uma categoria.";
    valido = false;
  }
  if (campoPrioridade.value === "") {
    document.getElementById("erro-prioridade").textContent = "Selecione a prioridade.";
    valido = false;
  }
  if (campoPrazo.value === "") {
    document.getElementById("erro-prazo").textContent = "Informe a data de conclusão.";
    valido = false;
  }

  return valido;
}

btnNovaTarefa.addEventListener("click", () => {
  modal.hidden = false;
});

btnFecharModal.addEventListener("click", () => {
  modal.hidden = true;
  formTarefa.reset();
  idEmEdicao = null;
  btnSalvarTarefa.textContent = "Adicionar tarefa";
});

formTarefa.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (!validarFormulario()) return;

  if (idEmEdicao) {
    atualizarTarefa(idEmEdicao);
  } else {
    adicionarTarefa();
  }

  exibirTarefas();
  atualizarIndicadores();

  modal.hidden = true;
  formTarefa.reset();
  idEmEdicao = null;
  btnSalvarTarefa.textContent = "Adicionar tarefa";
});

listaTarefas.addEventListener("click", (evento) => {
  const id = Number(evento.target.dataset.id);

  if (evento.target.classList.contains("botao--excluir")) {
    excluirTarefa(id);
  }
  if (evento.target.classList.contains("botao--concluir")) {
    alternarConclusao(id);
  }
  if (evento.target.classList.contains("botao--editar")) {
    entrarModoEdicao(id);
  }
});

btnExcluirConcluidas.addEventListener("click", () => {
  const quantidadeConcluidas = tarefas.filter((t) => t.situacao === "concluida").length;
  if (quantidadeConcluidas === 0) return;

  const confirmou = confirm(`Excluir ${quantidadeConcluidas} tarefa(s) concluída(s)?`);
  if (!confirmou) return;

  tarefas = tarefas.filter((t) => t.situacao !== "concluida");
  salvarTarefas();
  exibirTarefas();
  atualizarIndicadores();
});

botoesFiltroSituacao.forEach((botao) => {
  botao.addEventListener("click", () => {
    filtroSituacaoAtual = botao.dataset.filtro;
    botoesFiltroSituacao.forEach((b) => b.classList.remove("filtro-situacao--ativo"));
    botao.classList.add("filtro-situacao--ativo");
    exibirTarefas();
  });
});

listaCategorias.addEventListener("click", (evento) => {
  const item = evento.target.closest("li");
  if (!item) return;

  const categoriaClicada = item.dataset.categoria;

  if (filtroCategoriaAtual === categoriaClicada) {
    filtroCategoriaAtual = null;
    item.classList.remove("categoria-ativa");
  } else {
    document.querySelectorAll("#lista-categorias li").forEach((li) => {
      li.classList.remove("categoria-ativa");
    });
    filtroCategoriaAtual = categoriaClicada;
    item.classList.add("categoria-ativa");
  }

  exibirTarefas();
});

formCategoria.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const novaCategoria = campoNovaCategoria.value.trim();

  if (novaCategoria === "" || categorias.includes(novaCategoria)) {
    campoNovaCategoria.value = "";
    return;
  }

  categorias.push(novaCategoria);
  salvarCategorias();
  exibirCategorias();

  campoNovaCategoria.value = "";
});

selectOrdenacao.addEventListener("change", () => {
  ordenacaoAtual = selectOrdenacao.value;
  exibirTarefas();
});

carregarTarefas();
carregarCategorias();
exibirCategorias();
exibirTarefas();
atualizarIndicadores();