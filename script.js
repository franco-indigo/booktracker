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

// Hide main app & modal at the beginning
window.addEventListener("DOMContentLoaded", () => {
  booktrackerApp.classList.add("hidden");
  bookModal.classList.add("hidden");
});

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
    star.style.color = index < selectedRating ? "gold" : "gray";
  });
}

generateStars();

function resetForm() {
  bookTitleInput.value = "";
  bookReviewInput.value = "";
  selectedRating = 0;
  updateStars();
  checkSubmitReady();
}

// Input listeners
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

// Reset form
resetBtn.addEventListener("click", resetForm);

// Submit book
submitBtn.addEventListener("click", () => {
  if (
    !bookTitleInput.value.trim() ||
    !bookReviewInput.value.trim() ||
    selectedRating === 0
  ) return;

  const title = bookTitleInput.value.trim();
  const review = bookReviewInput.value.trim();
  const newReview = { title, rating: selectedRating, review };
  saveBook(newReview);
  displayBook(newReview);
  bookModal.classList.add("hidden");
});

// Save to localStorage
function saveBook(book) {
  const key = `bookworm-${currentUser}-books`;
  const saved = JSON.parse(localStorage.getItem(key)) || [];
  saved.push(book);
  localStorage.setItem(key, JSON.stringify(saved));
}

// Load from localStorage
function loadBooks() {
  const key = `bookworm-${currentUser}-books`;
  const saved = JSON.parse(localStorage.getItem(key)) || [];
  bookList.innerHTML = "";
  saved.forEach(displayBook);
}

// Display book
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

