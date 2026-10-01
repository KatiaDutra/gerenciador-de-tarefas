<p align="center">
  <img src="FocoCerto.png" alt="FocoCerto" width="180">
</p>

<h1 align="center">FocoCerto</h1>

<p align="center">
  Gerenciador de tarefas para planejar, organizar e acompanhar as atividades do dia a dia.<br>
  <a href="https://katiadutra.github.io/gerenciador-de-tarefas/"><strong>Acessar o app »</strong></a>
</p>

---

## Sobre o projeto

O FocoCerto é uma aplicação web desenvolvida como exercício do curso de Desenvolvimento Front-end (Programa Bolsa Futuro Digital). Começou como um gerenciador de tarefas com dados salvos no navegador e evoluiu para um app com contas de usuário: cada pessoa cria seu cadastro, e as tarefas ficam guardadas na nuvem, acessíveis de qualquer computador ou celular.

## Funcionalidades

**Contas de usuário**
- Cadastro e login com e-mail e senha
- Recuperação de senha por e-mail
- Tarefas e categorias separadas por usuário, sincronizadas entre dispositivos

**Tarefas**
- Cadastro de tarefas com descrição, categoria, prioridade e prazo, com validação dos campos
- Edição de tarefas
- Marcar e desmarcar como concluída
- Exclusão individual, com confirmação, e exclusão de todas as concluídas de uma vez
- Destaque visual para tarefas atrasadas

**Organização**
- Filtro por situação (todas, pendentes ou concluídas)
- Filtro por categoria, com opção de ver todas
- Ordenação por data de criação, prioridade ou prazo
- Cadastro de novas categorias

**Painel**
- Indicadores de total, pendentes, concluídas, atrasadas e percentual concluído
- Layout responsivo, adaptado para computador, tablet e celular

## Tecnologias

- HTML5
- CSS3 (Flexbox, Grid e media queries)
- JavaScript puro, com módulos ES
- [Firebase Authentication](https://firebase.google.com/docs/auth) para login e cadastro
- [Cloud Firestore](https://firebase.google.com/docs/firestore) como banco de dados
- GitHub Pages para hospedagem

## Estrutura do projeto

```
gerenciador-de-tarefas/
├── index.html
├── FocoCerto.png
├── css/
│   ├── style.css      # estilos do app e responsividade
│   └── login.css      # estilos da tela de login
└── js/
    ├── firebase.js    # configuração e conexão com o Firebase
    ├── auth.js        # login, cadastro, recuperação de senha e saída
    └── script.js      # tarefas, categorias, filtros e indicadores
```

## Segurança dos dados

Cada usuário tem um documento próprio no Firestore, identificado pelo código único da sua conta. As regras de segurança do banco permitem que apenas o dono da conta, autenticado, leia ou altere os próprios dados:

```
match /usuarios/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

## Como executar localmente

1. Clone o repositório:
   ```
   git clone https://github.com/KatiaDutra/gerenciador-de-tarefas.git
   ```
2. Abra a pasta no VS Code e inicie o projeto com a extensão **Live Server** (botão direito no `index.html` → *Open with Live Server*).

Os scripts usam módulos JavaScript, que não funcionam ao abrir o `index.html` direto pelo explorador de arquivos. Por isso é necessário um servidor local, como o Live Server.

Para usar um projeto Firebase próprio, substitua os dados de `firebaseConfig` em `js/firebase.js`, ative o login por e-mail/senha no Authentication, crie um banco no Firestore e publique as regras de segurança acima.

## Autora

Desenvolvido por **Katia Dutra**.
