// Seleciona o botão de tema e o corpo da página
const toggleButton = document.getElementById("toggle-theme");
const body = document.body;

// Adiciona um ouvinte de evento para o clique no botão
toggleButton.addEventListener("click", () => {
  // Alterna a classe 'dark' no body (modo claro/escuro)
  body.classList.toggle("dark");

  // Muda o texto do botão dependendo do tema atual
  toggleButton.textContent = body.classList.contains("dark") ? "☀️" : "🌙";
});

// Seleciona o formulário e a lista de despesas
const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");

// Adiciona um ouvinte de evento para o envio do formulário
form.addEventListener("submit", (e) => {
  // Impede que a página recarregue ao enviar o formulário
  e.preventDefault();

  // Pega os valores digitados nos campos
  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;

  // Verifica se ambos os campos estão preenchidos
  if (description && amount) {
    // Cria um novo elemento <li> (item de lista)
    const li = document.createElement("li");

    // Define o texto do item como: "Descrição: R$ Valor"
    li.textContent = `${description}: R$ ${amount}`;

    // Adiciona o novo item à lista de despesas
    expenseList.appendChild(li);

    // Limpa os campos do formulário
    form.reset();
  }
});
