// ==== DOM ELEMENTS ====
const usernameScreen = document.getElementById('username-screen');
const usernameInput = document.getElementById('username');
const usernameSubmitBtn = document.getElementById('username-submit');
const usernameError = document.getElementById('username-error');

const mainScreen = document.getElementById('main-screen');
const welcomeMessage = document.getElementById('welcome-message');
const addBookButton = document.getElementById('add-book-button');
const bookList = document.getElementById('book-list');

const bookFormScreen = document.getElementById('book-form-screen');
const bookTitleInput = document.getElementById('book-title');
const starRatingDiv = document.getElementById('star-rating');
const bookReviewInput = document.getElementById('book-review');
const resetButton = document.getElementById('reset-button');
const addReviewButton = document.getElementById('add-review-button');

// ==== GLOBAL STATE ====
let currentUser = '';
let currentRating = 0;

// ==== SCREEN HANDLING ====
function showScreen(target) {
  [usernameScreen, mainScreen, bookFormScreen].forEach(screen => screen.classList.add('hidden'));
  target.classList.remove('hidden');
}

// ==== ERROR MESSAGES ====
function showError(message) {
  usernameError.textContent = message;
}

function clearError() {
  usernameError.textContent = '';
}

// ==== LOCAL STORAGE ====
function getUserReviews() {
  return JSON.parse(localStorage.getItem(currentUser)) || [];
}

function saveReview(review) {
  const reviews = getUserReviews();
  reviews.push(review);
  localStorage.setItem(currentUser, JSON.stringify(reviews));
}

// ==== RENDERING ====
function loadReviews() {
  bookList.innerHTML = '';
  const reviews = getUserReviews();
  reviews.forEach(addReviewToDOM);
}

function addReviewToDOM(review) {
  const reviewEl = document.createElement('div');
  reviewEl.classList.add('review-entry');

  const stars = '★'.repeat(review.rating);
  reviewEl.innerHTML = `
    <h4>${review.title} ┃ <span class="stars">${stars}</span></h4>
    <p>${review.review}</p>
  `;

  bookList.appendChild(reviewEl);
}

// ==== STAR RATING ====
function updateStars(rating) {
  document.querySelectorAll('#star-rating span').forEach(star => {
    const value = parseInt(star.dataset.value);
    star.classList.toggle('selected', value <= rating);
  });
}

function setupStarListeners() {
  document.querySelectorAll('#star-rating span').forEach(star => {
    star.addEventListener('click', () => {
      currentRating = parseInt(star.dataset.value);
      updateStars(currentRating);
    });
  });
}

// ==== FORM HANDLING ====
function resetForm() {
  bookTitleInput.value = '';
  bookReviewInput.value = '';
  currentRating = 0;
  updateStars(0);
}

// ==== EVENT LISTENERS ====

// Handle username submit
usernameSubmitBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (!username) {
    showError('You need to input a username');
    return;
  }

  clearError();
  currentUser = username.toLowerCase();
  welcomeMessage.textContent = `Welcome, ${username}`;
  loadReviews();
  showScreen(mainScreen);
});

// Show add book form
addBookButton.addEventListener('click', () => {
  resetForm();
  showScreen(bookFormScreen);
});

// Reset form
resetButton.addEventListener('click', resetForm);

// Add review
addReviewButton.addEventListener('click', () => {
  const title = bookTitleInput.value.trim();
  const review = bookReviewInput.value.trim();

  if (!title) {
    alert('Please enter a book title.');
    return;
  }
  if (currentRating === 0) {
    alert('Please select a star rating.');
    return;
  }
  if (!review) {
    alert('Please write a review.');
    return;
  }

  const newReview = { title, rating: currentRating, review };
  saveReview(newReview);
  addReviewToDOM(newReview);
  showScreen(mainScreen);
});

// ==== INIT ====
setupStarListeners();

