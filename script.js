// Array para armazenar as transações
let transactions = [];
let isSortedByDate = false;

// Seleciona elementos do DOM
const toggleButton = document.getElementById("toggle-theme");
const body = document.body;
const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const saldoTotal = document.getElementById("saldo-total");
const filterType = document.getElementById("filter-type");
const filterCategory = document.getElementById("filter-category");
const sortBtn = document.getElementById("sort-btn");

// Carrega dados salvos ao iniciar
document.addEventListener("DOMContentLoaded", () => {
  loadTransactions();
  updateSaldo();
  displayTransactions();

  // Adiciona event listeners para filtros
  filterType.addEventListener("change", displayTransactions);
  filterCategory.addEventListener("change", displayTransactions);

  // Adiciona event listener para ordenação
  sortBtn.addEventListener("click", toggleSort);
});

// Toggle modo claro/escuro
toggleButton.addEventListener("click", () => {
  body.classList.toggle("dark");
  toggleButton.textContent = body.classList.contains("dark") ? "☀️" : "🌙";
  // Salva preferência do usuário
  localStorage.setItem("darkMode", body.classList.contains("dark"));
});

// Verifica preferência salva ao carregar
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "true") {
    body.classList.add("dark");
    toggleButton.textContent = "☀️";
  }
});

// Adiciona nova transação
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const type = document.getElementById("type").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (type && description && category && amount > 0) {
    // Cria objeto da transação
    const transaction = {
      id: Date.now(),
      type: type,
      description: description,
      category: category,
      amount: amount,
      date: new Date().toISOString(), // ISO format para ordenação
    };

    // Adiciona ao array
    transactions.push(transaction);

    // Salva no localStorage
    saveTransactions();

    // Atualiza interface
    displayTransactions();
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
  }
}

// Função para exibir transações com filtros
function displayTransactions() {
  const typeFilter = filterType.value;
  const categoryFilter = filterCategory.value;

  // Filtra transações
  let filteredTransactions = transactions.filter((transaction) => {
    const typeMatch = typeFilter === "todas" || transaction.type === typeFilter;
    const categoryMatch =
      categoryFilter === "todas" || transaction.category === categoryFilter;
    return typeMatch && categoryMatch;
  });

  // Ordena se necessário
  if (isSortedByDate) {
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Limpa lista
  transactionList.innerHTML = "";

  // Adiciona transações filtradas
  filteredTransactions.forEach((transaction) => {
    addTransactionToDOM(transaction);
  });
}

// Função para adicionar transação ao DOM
function addTransactionToDOM(transaction) {
  const li = document.createElement("li");
  li.className = transaction.type;

  // Formata data para exibição
  const displayDate = new Date(transaction.date).toLocaleDateString("pt-BR");

  // Mapeia categorias para nomes amigáveis
  const categoryNames = {
    salario: "Salário",
    alimentacao: "Alimentação",
    transporte: "Transporte",
    lazer: "Lazer",
    outros: "Outros",
  };

  li.innerHTML = `
    <div class="transaction-info">
      <strong>${transaction.description}</strong>
      <div class="transaction-meta">
        <div>${displayDate}</div>
        <span class="category-tag">${
          categoryNames[transaction.category] || transaction.category
        }</span>
      </div>
    </div>
    <div class="transaction-amount">
      <span class="valor">${
        transaction.type === "receita" ? "+" : "-"
      }R$ ${transaction.amount.toFixed(2).replace(".", ",")}</span>
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
  displayTransactions();
  updateSaldo();
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
    saldoTotal.style.color = "#28a745";
  } else if (total < 0) {
    saldoTotal.style.color = "#dc3545";
  } else {
    saldoTotal.style.color = "#ffffff";
  }
}

// Função para alternar ordenação
function toggleSort() {
  isSortedByDate = !isSortedByDate;
  sortBtn.textContent = isSortedByDate
    ? "📅 Ordenado por data"
    : "📅 Ordenar por data";
  displayTransactions();
}

// Função para obter nome da categoria
function getCategoryName(categoryKey) {
  const categories = {
    salario: "Salário",
    alimentacao: "Alimentação",
    transporte: "Transporte",
    lazer: "Lazer",
    outros: "Outros",
  };
  return categories[categoryKey] || categoryKey;
}
