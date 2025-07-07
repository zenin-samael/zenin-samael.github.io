const translations = {
  en: {
    loginTitle: "Login",
    nicknamePlaceholder: "Enter your nickname",
    loginButton: "Login",
    logout: "Logout",
    appInstructions: "Leave a review and rate your experience."
  },
  uk: {
    loginTitle: "Увійти",
    nicknamePlaceholder: "Введіть ім’я користувача",
    loginButton: "Увійти",
    logout: "Вийти",
    appInstructions: "Залиште відгук і оцініть досвід."
  },
  pl: {
    loginTitle: "Zaloguj się",
    nicknamePlaceholder: "Wpisz swój nick",
    loginButton: "Zaloguj się",
    logout: "Wyloguj się",
    appInstructions: "Zostaw recenzję i oceń swoje doświadczenie."
  },
  it: {
    loginTitle: "Accesso",
    nicknamePlaceholder: "Inserisci il tuo nickname",
    loginButton: "Accedi",
    logout: "Esci",
    appInstructions: "Lascia una recensione e valuta la tua esperienza."
  },
  ro: {
    loginTitle: "Autentificare",
    nicknamePlaceholder: "Introdu porecla",
    loginButton: "Intră",
    logout: "Ieșire",
    appInstructions: "Lasă o recenzie și evaluează experiența ta."
  }
};

let currentUser = null;
let currentLang = localStorage.getItem("lang") || "en";

function handleLogin() {
  const nick = document.getElementById("nickname").value.trim() || "guest";

  currentUser = nick;
  localStorage.setItem("nickname", nick);

  document.getElementById("loginContainer").classList.add("hidden");
  document.getElementById("appContainer").classList.remove("hidden");

  document.getElementById("welcomeUser").textContent = `Welcome, ${nick}!`;

  applyLanguage(currentLang);
  displayReviews();
}

function logoutUser() {
  localStorage.removeItem("nickname");
  currentUser = null;
  document.getElementById("loginContainer").classList.remove("hidden");
  document.getElementById("appContainer").classList.add("hidden");
}

function toggleLanguageMenu() {
  const menu = document.getElementById("languageMenu");
  menu.classList.toggle("hidden");
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  applyLanguage(lang);
}

function applyLanguage(lang) {
  const t = translations[lang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key]) el.placeholder = t[key];
  });
}

function highlightStars(value) {
  document.querySelectorAll(".star").forEach(star => {
    star.style.color = parseInt(star.dataset.value) <= parseInt(value) ? "gold" : "gray";
  });
}

document.querySelectorAll(".star").forEach(star => {
  star.addEventListener("click", () => {
    document.getElementById("ratingValue").value = star.dataset.value;
    highlightStars(star.dataset.value);
  });
});

function saveReview() {
  const title = document.getElementById("title").value;
  const address = document.getElementById("address").value;
  const description = document.getElementById("description").value;
  const rating = document.getElementById("ratingValue").value;

  if (!title || !address || !description || rating === "0") {
    return alert("Please fill out all fields and select a rating.");
  }

  const review = {
    id: Date.now(),
    title,
    address,
    description,
    rating
  };

  const reviews = JSON.parse(localStorage.getItem("reviews") || "{}");
  if (!reviews[currentUser]) reviews[currentUser] = [];
  reviews[currentUser].push(review);
  localStorage.setItem("reviews", JSON.stringify(reviews));

  displayReviews();
}

function displayReviews() {
  const container = document.getElementById("reviews");
  const reviews = JSON.parse(localStorage.getItem("reviews") || "{}")[currentUser] || [];
  container.innerHTML = reviews.map(r => `
    <div class="review">
      <h4>${r.title}</h4>
      <p><strong>Address:</strong> ${r.address}</p>
      <p>${r.description}</p>
      <p><strong>Rating:</strong> ${r.rating}/5</p>
    </div>
  `).join("");
}

window.addEventListener("DOMContentLoaded", () => {
  const storedUser = localStorage.getItem("nickname");
  if (storedUser) {
    currentUser = storedUser;
    document.getElementById("loginContainer").classList.add("hidden");
    document.getElementById("appContainer").classList.remove("hidden");
    document.getElementById("welcomeUser").textContent = `Welcome, ${storedUser}!`;
    displayReviews();
  }

  if (localStorage.getItem("lang")) {
    applyLanguage(localStorage.getItem("lang"));
  }
});
