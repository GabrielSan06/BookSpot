// API URL do Google Books
const API_URL = "https://www.googleapis.com/books/v1/volumes?q=";

// Referências aos elementos da interface
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const booksList = document.getElementById("booksList");
const favoritesList = document.getElementById("favoritesList");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service Worker registrado com sucesso."))
    .catch((err) => console.log("Erro ao registrar o Service Worker:", err));
}

// Função para buscar livros da API
const searchBooks = async () => {
  const query = searchInput.value;
  if (!query) return;

  const response = await fetch(API_URL + query);
  const data = await response.json();

  if (data.items) {
    displayBooks(data.items); // Exibe os livros encontrados
  }
};

const displayBooksList = (books, container) => {
  container.innerHTML = ""; // Limpa a lista

  if (books.length === 0) {
    container.innerHTML = "<p>Você ainda não tem favoritos.</p>";
    return;
  }

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");

    const title = document.createElement("h3");
    title.textContent = book.volumeInfo.title;

    const author = document.createElement("p");
    author.textContent = book.volumeInfo.authors
      ? book.volumeInfo.authors.join(", ")
      : "Autor desconhecido";

    const img = document.createElement("img");
    img.src = book.volumeInfo.imageLinks
      ? book.volumeInfo.imageLinks.thumbnail
      : "default-image.jpg";
    img.alt = `Capa do livro ${book.volumeInfo.title}`;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Salvar como favorito";
    saveBtn.addEventListener("click", () => saveFavorite(book));

    bookElement.appendChild(img);
    bookElement.appendChild(title);
    bookElement.appendChild(author);
    bookElement.appendChild(saveBtn);

    container.appendChild(bookElement);
  });
};

// Função para mostrar a mensagem
function showMessage(message, bookItem) {
  let messageDiv = bookItem.querySelector(".message");

  if (!messageDiv) {
    messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    bookItem.appendChild(messageDiv);
  }

  messageDiv.textContent = message;
  messageDiv.style.display = "block";

  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 2000); // Oculta a mensagem após 2 segundos
}


// Função para verificar se o livro está nos favoritos
function checkIfFavorite(book) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.some((fav) => fav.id === book.id);
}

// Função para salvar o livro nos favoritos
function saveFavorite(book) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Verifica se o livro já está nos favoritos
  if (checkIfFavorite(book)) {
    showMessage("Este livro já está nos favoritos!", book.bookItem);
  } else {
    favorites.push(book);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showMessage("Livro adicionado aos favoritos!", book.bookItem);
  }
}

// Remover livro dos favoritos
const removeFavorite = (book) => {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Filtra o livro a ser removido
  favorites = favorites.filter((fav) => fav.id !== book.id);
  localStorage.setItem("favorites", JSON.stringify(favorites)); // Salva a nova lista de favoritos
  console.log("Livro removido dos favoritos:", book);
  displayFavorites(); // Atualiza a lista de favoritos
};

// Exibir livros encontrados na busca
const displayBooks = (books) => {
  booksList.innerHTML = ""; // Limpa a lista de livros atual

  books.forEach((book) => {
    const bookElement = document.createElement("li");
    bookElement.classList.add("book");

    const title = document.createElement("h3");
    title.textContent = book.volumeInfo.title;

    const author = document.createElement("p");
    author.textContent = book.volumeInfo.authors
      ? book.volumeInfo.authors.join(", ")
      : "Autor desconhecido";

    const img = document.createElement("img");
    img.src = book.volumeInfo.imageLinks
      ? book.volumeInfo.imageLinks.thumbnail
      : "default-image.jpg";
    img.alt = `Capa do livro ${book.volumeInfo.title}`;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Adicionar aos Favoritos";
    saveBtn.addEventListener("click", () => {
      saveFavorite({ ...book, bookItem: bookElement }); // Passa o item de livro para a função
    });

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    bookElement.appendChild(img);
    bookElement.appendChild(title);
    bookElement.appendChild(author);
    bookElement.appendChild(saveBtn);
    bookElement.appendChild(messageDiv);

    booksList.appendChild(bookElement);
  });
};

// Exibir livros favoritos
const displayFavorites = () => {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  console.log("Favoritos carregados:", favorites);

  favoritesList.innerHTML = ""; // Limpa a lista de favoritos

  if (favorites.length === 0) {
    favoritesList.innerHTML = "<p>Você ainda não tem favoritos.</p>";
    return;
  }

  favorites.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");

    const title = document.createElement("h3");
    title.textContent = book.volumeInfo.title;

    const author = document.createElement("p");
    author.textContent = book.volumeInfo.authors
      ? book.volumeInfo.authors.join(", ")
      : "Autor desconhecido";

    const img = document.createElement("img");
    img.src = book.volumeInfo.imageLinks
      ? book.volumeInfo.imageLinks.thumbnail
      : "default-image.jpg";
    img.alt = `Capa do livro ${book.volumeInfo.title}`;

    // Adiciona um botão de "Remover dos favoritos" para cada livro na lista de favoritos
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remover dos favoritos";
    removeBtn.addEventListener("click", () => removeFavorite(book)); // Remove o livro dos favoritos

    bookElement.appendChild(img);
    bookElement.appendChild(title);
    bookElement.appendChild(author);
    bookElement.appendChild(removeBtn);

    favoritesList.appendChild(bookElement);
  });
};

// Carregar favoritos ao iniciar
document.addEventListener("DOMContentLoaded", displayFavorites);

// Evento de busca ao clicar no botão
searchBtn.addEventListener("click", searchBooks);