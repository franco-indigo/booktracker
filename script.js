// DOM Elements
const usernamePrompt = document.getElementById("username-prompt");
const usernameInput = document.getElementById("username-input");
const startBtn = document.getElementById("start-btn");
const booktrackerApp = document.getElementById("booktracker-app");
const userNameDisplay = document.getElementById("user-name");
const bookList = document.getElementById("book-list");
const addBookBtn = document.getElementById("add-book-btn");
const bookModal = document.getElementById("book-modal");
const bookTitleInput = document.getElementById("book-title");
const starRating = document.getElementById("star-rating");
const bookReviewInput = document.getElementById("book-review");
const resetBtn = document.getElementById("reset-btn");
const submitBtn = document.getElementById("submit-btn");

let currentUser = null;
let selectedRating = 0;

// Username validation
startBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (!username) {
    showError("You need to input a username");
    return;
  }
  currentUser = username;
  usernamePrompt.classList.add("hidden");
  booktrackerApp.classList.remove("hidden");
  userNameDisplay.textContent = `Welcome, ${username}`;
  loadBooks();
});

function showError(message) {
  let error = document.querySelector(".error-message");
  if (!error) {
    error = document.createElement("p");
    error.className = "error-message";
    error.style.color = "red";
    usernamePrompt.appendChild(error);
  }
  error.textContent = message;
}

// Show modal
addBookBtn.addEventListener("click", () => {
  bookModal.classList.remove("hidden");
  resetForm();
});

// Generate clickable stars
function generateStars() {
  starRating.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.innerHTML = "★";
    star.dataset.index = i;
    star.style.cursor = "pointer";
    star.addEventListener("click", () => {
      selectedRating = i;
      updateStars();
      checkSubmitReady();
    });
    starRating.appendChild(star);
  }
}

function updateStars() {
  const stars = starRating.querySelectorAll("span");
  stars.forEach((star, index) => {
    if (index < selectedRating) {
      star.style.color = "gold";
    } else {
      star.style.color = "gray";
    }
  });
}

generateStars();

function resetForm() {
  bookTitleInput.value = "";
  bookReviewInput.value = "";
  selectedRating = 0;
  updateStars();
  submitBtn.disabled = true;
}

[bookTitleInput, bookReviewInput].forEach(input => {
  input.addEventListener("input", checkSubmitReady);
});

function checkSubmitReady() {
  submitBtn.disabled = !(
    bookTitleInput.value.trim() &&
    bookReviewInput.value.trim() &&
    selectedRating > 0
  );
}

resetBtn.addEventListener("click", resetForm);

submitBtn.addEventListener("click", () => {
  const title = bookTitleInput.value.trim();
  const review = bookReviewInput.value.trim();
  const newReview = { title, rating: selectedRating, review };
  saveBook(newReview);
  displayBook(newReview);
  bookModal.classList.add("hidden");
});

function saveBook(book) {
  const key = `bookworm-${currentUser}-books`;
  const saved = JSON.parse(localStorage.getItem(key)) || [];
  saved.push(book);
  localStorage.setItem(key, JSON.stringify(saved));
}

function loadBooks() {
  const key = `bookworm-${currentUser}-books`;
  const saved = JSON.parse(localStorage.getItem(key)) || [];
  bookList.innerHTML = "";
  saved.forEach(displayBook);
}

function displayBook(book) {
  const item = document.createElement("div");
  item.className = "book-entry";
  item.innerHTML = `
    <h4>${book.title}</h4>
    <p>${"★".repeat(book.rating)}${"☆".repeat(5 - book.rating)}</p>
    <p>${book.review}</p>
    <hr/>
  `;
  bookList.appendChild(item);
}

