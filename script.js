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
const errorMessage = document.getElementById("error-message");

let currentUser = null;
let selectedRating = 0;

// Username validation & start app
startBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (!username) {
    showError("You need to input a username");
    return;
  }
  clearError();
  currentUser = username;
  usernamePrompt.classList.add("hidden");
  booktrackerApp.classList.remove("hidden");
  userNameDisplay.textContent = `Welcome, ${username}`;
  loadBooks();
});

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

// Clear error message
function clearError() {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

// Show modal to add book
addBookBtn.addEventListener("click", () => {
  bookModal.classList.remove("hidden");
  resetForm();
});

// Generate clickable stars
function generateStars() {
  starRating.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
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
      star.classList.add("filled");
    } else {
      star.classList.remove("filled");
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

// Enable submit button only when inputs are valid
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

// Submit new book review
submitBtn.addEventListener("click", () => {
  const title = bookTitleInput.value.trim();
  const review = bookReviewInput.value.trim();
  const newReview = { title, rating: selectedRating, review };
  saveBook(newReview);
  displayBook(newReview);
  bookModal.classList.add("hidden");
});

// Save book to localStorage
function saveBook(book) {
  const key = `bookworm-${currentUser}-books`;
  const saved = JSON.parse(localStorage.getItem(key)) || [];
  saved.push(book);
  localStorage.setItem(key, JSON.stringify(saved));
}

// Load books from localStorage
function loadBooks() {
  bookList.innerHTML = "";
  const key = `bookworm-${currentUser}-books`;
  const savedBooks = JSON.parse(localStorage.getItem(key)) || [];
  savedBooks.forEach(displayBook);
}

// Display a single book entry
function displayBook(book) {
  const bookEntry = document.createElement("div");
  bookEntry.classList.add("book-entry");

  // Title bold
  const titleEl = document.createElement("h3");
  titleEl.textContent = book.title;
  bookEntry.appendChild(titleEl);

  // Stars
  const starsEl = document.createElement("div");
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.style.color = i <= book.rating ? "gold" : "lightgray";
    starsEl.appendChild(star);
  }
  bookEntry.appendChild(starsEl);

  // Review text
  const reviewEl = document.createElement("p");
  reviewEl.textContent = book.review;
  bookEntry.appendChild(reviewEl);

  bookList.appendChild(bookEntry);
}

