import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const telaLogin = document.getElementById("tela-login");
const app = document.querySelector(".app");

const formLogin = document.getElementById("form-login");
const campoEmail = document.getElementById("login-email");
const campoSenha = document.getElementById("login-senha");
const tituloLogin = document.getElementById("login-titulo");
const btnEntrar = document.getElementById("btn-login");
const textoAlternar = document.getElementById("texto-alternar");
const btnAlternar = document.getElementById("btn-alternar");
const btnEsqueci = document.getElementById("btn-esqueci");
const mensagemLogin = document.getElementById("mensagem-login");

const usuarioEmail = document.getElementById("usuario-email");
const btnSair = document.getElementById("btn-sair");

let modoCadastro = false;

function traduzirErro(codigo) {
  const mensagens = {
    "auth/invalid-email": "E-mail inválido.",
    "auth/missing-password": "Digite a senha.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/email-already-in-use": "Já existe uma conta com este e-mail.",
    "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos e tente de novo.",
    "auth/network-request-failed": "Sem conexão com a internet.",
    "auth/operation-not-allowed": "O login por e-mail e senha não está ativado no Firebase.",
    "auth/configuration-not-found": "O Authentication ainda não foi ativado no Firebase."
  };
  console.error("Erro do Firebase:", codigo);
  return mensagens[codigo] || "Algo deu errado (" + codigo + "). Tente novamente.";
}

function mostrarMensagem(texto, tipo = "erro") {
  mensagemLogin.textContent = texto;
  mensagemLogin.className = "login__mensagem login__mensagem--" + tipo;
}

function alternarModo() {
  modoCadastro = !modoCadastro;
  tituloLogin.textContent = modoCadastro ? "Criar conta" : "Entrar";
  btnEntrar.textContent = modoCadastro ? "Criar conta" : "Entrar";
  textoAlternar.textContent = modoCadastro ? "Já tem conta?" : "Ainda não tem conta?";
  btnAlternar.textContent = modoCadastro ? "Entrar" : "Criar conta";
  btnEsqueci.hidden = modoCadastro;
  campoSenha.autocomplete = modoCadastro ? "new-password" : "current-password";
  mostrarMensagem("");
}

formLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mostrarMensagem("");

  const email = campoEmail.value.trim();
  const senha = campoSenha.value;

  btnEntrar.disabled = true;
  try {
    if (modoCadastro) {
      await createUserWithEmailAndPassword(auth, email, senha);
    } else {
      await signInWithEmailAndPassword(auth, email, senha);
    }
    formLogin.reset();
  } catch (erro) {
    mostrarMensagem(traduzirErro(erro.code));
  } finally {
    btnEntrar.disabled = false;
  }
});

btnAlternar.addEventListener("click", alternarModo);

btnEsqueci.addEventListener("click", async () => {
  const email = campoEmail.value.trim();
  if (!email) {
    mostrarMensagem("Digite seu e-mail acima e clique de novo em \"Esqueci minha senha\".");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    mostrarMensagem("Se houver uma conta com este e-mail, enviamos um link para redefinir a senha.", "sucesso");
  } catch (erro) {
    mostrarMensagem(traduzirErro(erro.code));
  }
});

btnSair.addEventListener("click", () => {
  signOut(auth);
});

onAuthStateChanged(auth, (usuario) => {
  if (usuario) {
    usuarioEmail.textContent = usuario.email;
    telaLogin.hidden = true;
    app.hidden = false;
  } else {
    usuarioEmail.textContent = "";
    app.hidden = true;
    telaLogin.hidden = false;
  }
});
