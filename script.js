const usernameScreen = document.getElementById('username-screen');
const mainScreen = document.getElementById('main-screen');
const bookFormScreen = document.getElementById('book-form-screen');

const usernameInput = document.getElementById('username');
const usernameSubmit = document.getElementById('username-submit');
const usernameError = document.getElementById('username-error');
const userNameDisplay = document.getElementById('user-name-display');

const addBookButton = document.getElementById('add-book-button');
const addReviewButton = document.getElementById('add-review-button');
const resetButton = document.getElementById('reset-button');
const backButton = document.getElementById('back-button');

const bookTitleInput = document.getElementById('book-title');
const reviewTextInput = document.getElementById('reviewText');
const starSpans = document.querySelectorAll('#star-rating span');
const bookList = document.getElementById('book-list');

let selectedRating = 0;
let currentUser = "";

starSpans.forEach(star => {
  star.addEventListener('click', () => {
    selectedRating = parseInt(star.getAttribute('data-value'));
    updateStars(selectedRating);
  });
});

function updateStars(rating) {
  starSpans.forEach(star => {
    const value = parseInt(star.getAttribute('data-value'));
    star.classList.toggle('selected', value <= rating);
  });
}

usernameSubmit.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username === "") {
    usernameError.textContent = "You need to input a username";
  } else {
    currentUser = username;
    usernameScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
    userNameDisplay.textContent = username;
    loadReviews();
  }
});

addBookButton.addEventListener('click', () => {
  bookFormScreen.classList.remove('hidden');
  mainScreen.classList.add('hidden');
});

backButton.addEventListener('click', () => {
  bookFormScreen.classList.add('hidden');
  mainScreen.classList.remove('hidden');
});

resetButton.addEventListener('click', () => {
  bookTitleInput.value = "";
  reviewTextInput.value = "";
  selectedRating = 0;
  updateStars(0);
});

addReviewButton.addEventListener('click', () => {
  const title = bookTitleInput.value.trim();
  const review = reviewTextInput.value.trim();

  if (!title || !review || selectedRating === 0) {
    alert("The user has incomplete information for a book review.");
    return;
  }

  const reviewData = {
    title: title,
    review: review,
    rating: selectedRating
  };

  let userReviews = JSON.parse(localStorage.getItem(currentUser)) || [];
  userReviews.push(reviewData);
  localStorage.setItem(currentUser, JSON.stringify(userReviews));

  bookTitleInput.value = "";
  reviewTextInput.value = "";
  selectedRating = 0;
  updateStars(0);

  loadReviews();

  bookFormScreen.classList.add('hidden');
  mainScreen.classList.remove('hidden');
});

function loadReviews() {
  bookList.innerHTML = "";
  const userReviews = JSON.parse(localStorage.getItem(currentUser)) || [];

  userReviews.forEach(({ title, review, rating }) => {
    const entry = document.createElement('div');
    entry.classList.add('review-entry');

    const starHTML = '★'.repeat(rating) + '☆'.repeat(5 - rating);

    entry.innerHTML = `
      <h4>${title}</h4>
      <p><strong>Rating:</strong> ${starHTML}</p>
      <p>${review}</p>
    `;

    bookList.appendChild(entry);
  });
}