const addBookBtn = document.getElementById("add-book-btn");
const bookModal = document.getElementById("book-modal");
const submitBtn = document.getElementById("submit-btn");
const resetBtn = document.getElementById("reset-btn");
const bookTitle = document.getElementById("book-title");
const bookReview = document.getElementById("book-review");
const starRating = document.getElementById("star-rating");
const bookList = document.getElementById("book-list");
const usernamePrompt = document.getElementById("username-prompt");
const startBtn = document.getElementById("start-btn");
const usernameInput = document.getElementById("username-input");
const bookApp = document.getElementById("booktracker-app");

startBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (name) {
    usernamePrompt.classList.add("hidden");
    bookApp.classList.remove("hidden");
  } else {
    alert("Please enter your name.");
  }
});

let selectedRating = 0;

// Show modal
addBookBtn.addEventListener("click", () => {
  bookModal.classList.remove("hidden");
  validateForm();
});

// Star click logic
starRating.innerHTML = "★★★★★";
const stars = [...starRating.textContent].map((_, i) => {
  const span = document.createElement("span");
  span.innerHTML = "★";
  span.addEventListener("click", () => {
    selectedRating = i + 1;
    updateStars();
    validateForm();
  });
  return span;
});
starRating.innerHTML = "";
stars.forEach(star => starRating.appendChild(star));

function updateStars() {
  stars.forEach((star, i) => {
    star.classList.toggle("selected", i < selectedRating);
  });
}

// Reset button
resetBtn.addEventListener("click", () => {
  bookTitle.value = "";
  bookReview.value = "";
  selectedRating = 0;
  updateStars();
  validateForm();
});

// Add button
submitBtn.addEventListener("click", () => {
  if (bookTitle.value && bookReview.value && selectedRating > 0) {
    const entry = document.createElement("div");
    entry.classList.add("review-entry");
    entry.innerHTML = `
      <strong>${bookTitle.value}</strong><br>
      ${"★".repeat(selectedRating)}<br>
      <em>${bookReview.value}</em>
    `;
    bookList.appendChild(entry);

    // Clear form
    bookTitle.value = "";
    bookReview.value = "";
    selectedRating = 0;
    updateStars();
    validateForm();
    bookModal.classList.add("hidden");
  }
});

// Disable Add button unless form is filled
function validateForm() {
  if (bookTitle.value && bookReview.value && selectedRating > 0) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}

bookTitle.addEventListener("input", validateForm);
bookReview.addEventListener("input", validateForm);
