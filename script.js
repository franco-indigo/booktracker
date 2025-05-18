// DOM Elements
const startBtn = document.getElementById("start-btn");
const usernameInput = document.getElementById("username-input");
const usernamePrompt = document.getElementById("username-prompt");
const appContainer = document.getElementById("booktracker-app");
const userNameTitle = document.getElementById("user-name");
const usernameError = document.getElementById("username-error");

const addBookBtn = document.getElementById("add-book-btn");
const bookModal = document.getElementById("book-modal");
const bookTitleInput = document.getElementById("book-title");
const bookReviewInput = document.getElementById("book-review");
const starRating = document.getElementById("star-rating");
const resetBtn = document.getElementById("reset-btn");
const submitBtn = document.getElementById("submit-btn");
const bookList = document.getElementById("book-list");

let currentUser = "";
let currentRating = 0;

// Load saved username on page load
window.onload = function () {
  const savedUsername = localStorage.getItem("bookworm-username");
  if (savedUsername) {
    currentUser = savedUsername;
    userNameTitle.textContent = `Welcome, ${currentUser}!`;
    usernamePrompt.classList.add("hidden");
    appContainer.classList.remove("hidden");
    loadBooks();
  }
};

// Start button click
startBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();

  if (username === "") {
    usernameError.classList.remove("hidden");
    return;
  }

  usernameError.classList.add("hidden");
  currentUser = username;

  localStorage.setItem("bookworm-username", currentUser);
  userNameTitle.textContent = `Welcome, ${currentUser}!`;
  usernamePrompt.classList.add("hidden");
  appContainer.classList.remove("hidden");
  loadBooks();
});

// Show modal to add book
addBookBtn.addEventListener("click", () => {
  bookModal.classList.remove("hidden");
  resetForm();
});

// Reset form
resetBtn.addEventListener("click", resetForm);

function resetForm() {
  bookTitleInput.value = "";
  bookReviewInput.value = "";
  currentRating = 0;
  updateStars();
  submitBtn.disabled = true;
}

// Enable submit button only if form is filled
[bookTitleInput, bookReviewInput].forEach(input => {
  input.addEventListener("input", checkFormValidity);
});

function checkFormValidity() {
  if (bookTitleInput.value.trim() && bookReviewInput.value.trim() && currentRating > 0) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}

// Handle star rating
starRating.innerHTML = "★★★★★";
const stars = starRating.querySelectorAll("span, div")[0].childNodes;

starRating.addEventListener("click", (e) => {
  if (e.target.nodeName === "TEXT") return;
  const rect = starRating.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const starWidth = rect.width / 5;
  currentRating = Math.ceil(x / starWidth);
  updateStars();
  checkFormValidity();
});

function updateStars() {
  const stars = starRating.textContent.split("");
  for (let i = 0; i < 5; i++) {
    stars[i] = i < currentRating ? "★" : "☆";
  }
  starRating.textContent = stars.join("");
}

// Submit book review
submitBtn.addEventListener("click", () => {
  const title = bookTitleInput.value.trim();
  const review = bookReviewInput.value.trim();

  const book = {
    title,
    rating: currentRating,
    review,
  };

  let userBooks = JSON.parse(localStorage.getItem(`bookworm-books-${currentUser}`)) || [];
  userBooks.push(book);
  localStorage.setItem(`bookworm-books-${currentUser}`, JSON.stringify(userBooks));

  displayBooks(userBooks);
  bookModal.classList.add("hidden");
  resetForm();
});

// Load saved books for the current user
function loadBooks() {
  const books = JSON.parse(localStorage.getItem(`bookworm-books-${currentUser}`)) || [];
  displayBooks(books);
}

// Display books on the page
function displayBooks(books) {
  bookList.innerHTML = "";
  books.forEach(book => {
    const div = document.createElement("div");
    div.classList.add("book-entry");
    div.innerHTML = `
      <h4>${book.title}</h4>
      <p>Rating: ${"★".repeat(book.rating)}${"☆".repeat(5 - book.rating)}</p>
      <p>${book.review}</p>
    `;
    bookList.appendChild(div);
  });
}

