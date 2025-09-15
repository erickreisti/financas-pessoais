// Array para armazenar as transações
let transactions = [];

// Seleciona elementos do DOM
const toggleButton = document.getElementById("toggle-theme");
const body = document.body;
const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const saldoTotal = document.getElementById("saldo-total");

// Carrega dados salvos ao iniciar
document.addEventListener("DOMContentLoaded", () => {
  loadTransactions();
  updateSaldo();
});

// Toggle modo claro/escuro
toggleButton.addEventListener("click", () => {
  body.classList.toggle("dark");
  toggleButton.textContent = body.classList.contains("dark") ? "☀️" : "🌙";
});

// Adiciona nova transação
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const type = document.getElementById("type").value;
  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (type && description && amount > 0) {
    // Cria objeto da transação
    const transaction = {
      id: Date.now(), // ID único baseado no timestamp
      type: type,
      description: description,
      amount: amount,
      date: new Date().toLocaleDateString("pt-BR"),
    };

    // Adiciona ao array
    transactions.push(transaction);

    // Salva no localStorage
    saveTransactions();

    // Atualiza interface
    addTransactionToDOM(transaction);
    updateSaldo();

    // Limpa formulário
    form.reset();
  }
});

// Função para salvar transações no localStorage
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Função para carregar transações do localStorage
function loadTransactions() {
  const stored = localStorage.getItem("transactions");
  if (stored) {
    transactions = JSON.parse(stored);
    transactions.forEach((transaction) => {
      addTransactionToDOM(transaction);
    });
  }
}

// Função para adicionar transação ao DOM
function addTransactionToDOM(transaction) {
  const li = document.createElement("li");
  li.className = transaction.type; // 'receita' ou 'despesa'
  li.innerHTML = `
    <div>
      <div><strong>${transaction.description}</strong></div>
      <div><small>${transaction.date}</small></div>
    </div>
    <div>
      <span class="valor">${
        transaction.type === "receita" ? "+" : "-"
      }R$ ${transaction.amount.toFixed(2)}</span>
      <button class="delete-btn" onclick="deleteTransaction(${
        transaction.id
      })">🗑️</button>
    </div>
  `;
  transactionList.appendChild(li);
}

// Função para deletar transação
function deleteTransaction(id) {
  // Remove do array
  transactions = transactions.filter((transaction) => transaction.id !== id);

  // Salva no localStorage
  saveTransactions();

  // Atualiza interface
  updateDOM();
  updateSaldo();
}

// Função para atualizar o DOM (recria toda a lista)
function updateDOM() {
  transactionList.innerHTML = "";
  transactions.forEach((transaction) => {
    addTransactionToDOM(transaction);
  });
}

// Função para calcular e atualizar saldo
function updateSaldo() {
  let total = 0;
  transactions.forEach((transaction) => {
    if (transaction.type === "receita") {
      total += transaction.amount;
    } else {
      total -= transaction.amount;
    }
  });

  // Formata para moeda brasileira
  saldoTotal.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;

  // Adiciona cor dependendo do saldo
  if (total > 0) {
    saldoTotal.style.color = "#28a745"; // verde
  } else if (total < 0) {
    saldoTotal.style.color = "#dc3545"; // vermelho
  } else {
    saldoTotal.style.color = "#007bff"; // azul
  }
}
