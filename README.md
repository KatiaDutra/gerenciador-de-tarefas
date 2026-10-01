<p align="center">
  <img src="FocoCerto.png" alt="FocoCerto" width="160">
</p>

# FocoCerto

Gerenciador de tarefas com login e uma aba de estatísticas sobre as próprias tarefas.

🔗 **Acesse:** https://katiadutra.github.io/gerenciador-de-tarefas/

## Sobre o projeto

Comecei este projeto como exercício do curso de Desenvolvimento Front-end do Programa Bolsa Futuro Digital. A primeira versão era simples: cadastrar, concluir e excluir tarefas, com os dados salvos no localStorage do navegador.

Depois de terminar o exercício, decidi continuar evoluindo o projeto para praticar coisas novas. Adicionei login, passei a salvar os dados no Firebase e, como meu interesse é a área de dados, criei uma aba de estatísticas que analisa as tarefas de cada usuário e mostra os resultados em gráficos.

## O que o app faz

- Cadastro e login com e-mail e senha, com opção de recuperar a senha
- Cada usuário vê apenas as próprias tarefas, que ficam salvas na nuvem
- Cadastrar, editar, concluir e excluir tarefas
- Filtrar por situação e por categoria, e ordenar por prioridade ou prazo
- Destaque para tarefas atrasadas
- Aba de estatísticas com:
  - taxa de conclusão, tarefas concluídas na última semana, tempo médio para concluir e percentual concluído no prazo
  - gráfico de tarefas criadas x concluídas por semana
  - gráficos por situação, por prioridade e por categoria
- Layout que funciona no computador e no celular

## Tecnologias

- HTML, CSS e JavaScript
- Firebase Authentication (login)
- Cloud Firestore (banco de dados)
- Chart.js (gráficos)
- GitHub Pages (publicação)

## Desafios e aprendizados

**Sair do localStorage.** No começo, todas as tarefas ficavam salvas no navegador. Isso funcionava, mas se eu limpasse o histórico perdia tudo, e no celular as tarefas não apareciam. Ao migrar para o Firestore, aprendi a organizar os dados por usuário e a escrever regras de segurança para que cada pessoa só acesse o que é dela.

**Configurar o Firebase.** Na primeira tentativa de criar uma conta, só aparecia uma mensagem de erro genérica. Descobri que o serviço de autenticação ainda não estava ativado no projeto. Depois disso, passei a mostrar o código do erro na tela para facilitar a investigação.

**Cache do navegador.** Mais de uma vez eu atualizei os arquivos e a página continuava igual. Aprendi a usar o Ctrl + F5, o Console do navegador para encontrar erros e a testar em aba anônima.

**Registrar as datas certas.** Para calcular o tempo médio de conclusão, precisei começar a guardar a data em que cada tarefa é concluída. Também percebi que o cálculo de "hoje" usava o horário UTC, o que fazia tarefas aparecerem como atrasadas antes da hora depois das 21h, e corrigi para usar o horário local.

**Responsividade.** No celular, a barra lateral ficava enorme e empurrava as tarefas para baixo. Reorganizei o layout para que as ações menos usadas fiquem no rodapé.

## Como rodar no seu computador

1. Clone o repositório
2. Abra a pasta no VS Code
3. Clique com o botão direito no `index.html` e escolha **Open with Live Server**

Os arquivos JavaScript usam módulos, então não funcionam abrindo o `index.html` direto pela pasta. É preciso usar um servidor local, como o Live Server.

## Próximos passos

- Adicionar filtros de período na aba de estatísticas
- Permitir editar e excluir categorias

## Autora

Katia Dutra
