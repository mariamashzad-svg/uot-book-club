"use strict";

/* =========================================
   CONFIGURATION
========================================= */

const CONFIG = {
  communityURL: "https://t.me/+6G4O9-Gd8942N2Jk",

  feedbackURL: "https://forms.gle/a7q2nxTtEFkN9dhW6",

  title: "نادي الكتاب بجامعة طرابلس",

  description: "نحو جامعة تقرأ، تفكّر، تتحاور"
};


/* =========================================
   REVIEWS DATA
========================================= */

/*
  Add real participant reviews here.

  Example structure:

  {
    name: "اسم المشارك",
    role: "مشارك في النادي",
    quote: "رأي المشارك بعد موافقته على النشر"
  }

  Leave the array empty until you have
  permission to publish real testimonials.
*/

const reviews = [];


/* =========================================
   REVIEWS CAROUSEL
========================================= */

const reviewText = document.getElementById("reviewText");
const reviewName = document.getElementById("reviewName");
const reviewRole = document.getElementById("reviewRole");

const reviewAuthor = document.getElementById("reviewAuthor");

const reviewsControls =
  document.getElementById("reviewsControls");

const reviewDots = document.getElementById("reviewDots");

const prevReview = document.getElementById("prevReview");
const nextReview = document.getElementById("nextReview");

const reviewsCard = document.querySelector(".reviews-card");

let currentReview = 0;


/* Display a review */

function displayReview(index) {

  if (reviews.length === 0) {

    reviewText.textContent =
      "نترقّب مشاركاتكم وآراءكم حول تجربتكم مع نادي الكتاب. شاركونا تجاربكم لتكون جزءًا من هذا القسم.";

    reviewAuthor.hidden = true;
    reviewsControls.hidden = true;

    return;
  }

  currentReview =
    (index + reviews.length) % reviews.length;

  const review = reviews[currentReview];

  reviewText.textContent = `«${review.quote}»`;

  reviewName.textContent = review.name;
  reviewRole.textContent = review.role;

  reviewAuthor.hidden = false;

  reviewsControls.hidden = reviews.length <= 1;

  Array.from(reviewDots.children).forEach((dot, i) => {

    const active = i === currentReview;

    dot.classList.toggle("active", active);

    dot.setAttribute(
      "aria-current",
      String(active)
    );

  });

}


/* Create carousel dots */

reviews.forEach((review, index) => {

  const dot = document.createElement("button");

  dot.type = "button";

  dot.className = "review-dot";

  dot.setAttribute(
    "aria-label",
    `عرض الرأي ${index + 1}`
  );

  dot.addEventListener("click", () => {
    displayReview(index);
  });

  reviewDots.appendChild(dot);

});


/* Previous and next */

prevReview.addEventListener("click", () => {
  displayReview(currentReview - 1);
});

nextReview.addEventListener("click", () => {
  displayReview(currentReview + 1);
});


/* Keyboard support */

reviewsCard.addEventListener("keydown", event => {

  if (reviews.length <= 1) return;

  if (event.key === "ArrowLeft") {

    displayReview(currentReview + 1);

  } else if (event.key === "ArrowRight") {

    displayReview(currentReview - 1);

  }

});


/* Swipe support for mobile */

let touchStartX = 0;

reviewsCard.addEventListener(
  "touchstart",
  event => {

    touchStartX =
      event.changedTouches[0].screenX;

  },
  { passive: true }
);

reviewsCard.addEventListener(
  "touchend",
  event => {

    if (reviews.length <= 1) return;

    const touchEndX =
      event.changedTouches[0].screenX;

    const difference =
      touchStartX - touchEndX;

    if (Math.abs(difference) < 50) return;

    if (difference > 0) {

      displayReview(currentReview + 1);

    } else {

      displayReview(currentReview - 1);

    }

  },
  { passive: true }
);


/* Initialize carousel */

displayReview(0);


/* =========================================
   DARK MODE
========================================= */

const themeToggle =
  document.getElementById("themeToggle");

const themeIcon =
  document.getElementById("themeIcon");


function getSavedTheme() {

  try {

    return localStorage.getItem("bookclub-theme");

  } catch {

    return null;

  }

}


function saveTheme(value) {

  try {

    localStorage.setItem(
      "bookclub-theme",
      value
    );

  } catch {

    // Continue without persistent storage.

  }

}


function updateTheme() {

  const dark =
    document.body.classList.contains("dark");

  themeIcon.textContent =
    dark ? "☀" : "☾";

  themeToggle.setAttribute(
    "aria-pressed",
    String(dark)
  );

  themeToggle.setAttribute(
    "aria-label",
    dark
      ? "تفعيل الوضع الفاتح"
      : "تفعيل الوضع الليلي"
  );

  document.querySelector(
    'meta[name="theme-color"]'
  ).setAttribute(
    "content",
    dark ? "#1b1115" : "#620116"
  );

}


if (getSavedTheme() === "dark") {

  document.body.classList.add("dark");

}

updateTheme();


themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  const dark =
    document.body.classList.contains("dark");

  saveTheme(dark ? "dark" : "light");

  updateTheme();

});


/* =========================================
   ACCORDION
========================================= */

const accordionItems =
  document.querySelectorAll(
    ".about-accordion details"
  );


accordionItems.forEach(item => {

  item.addEventListener("toggle", () => {

    if (!item.open) return;

    accordionItems.forEach(other => {

      if (other !== item) {

        other.open = false;

      }

    });

  });

});


/* =========================================
   TOAST NOTIFICATIONS
========================================= */

const toast = document.getElementById("toast");

let toastTimeout;


function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {

    toast.classList.remove("show");

  }, 3000);

}


/* =========================================
   COPY TO CLIPBOARD
========================================= */

async function copyText(text) {

  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {

    await navigator.clipboard.writeText(text);

    return;
  }

  const input = document.createElement("textarea");

  input.value = text;

  input.style.position = "fixed";
  input.style.opacity = "0";

  document.body.appendChild(input);

  input.select();

  const success = document.execCommand("copy");

  input.remove();

  if (!success) {

    throw new Error("Copy failed");

  }

}


/* =========================================
   COPY COMMUNITY LINK
========================================= */

document
  .getElementById("copyCommunity")
  .addEventListener("click", async () => {

    try {

      await copyText(CONFIG.communityURL);

      showToast("تم نسخ رابط المجتمع بنجاح ✓");

    } catch {

      showToast("تعذّر نسخ الرابط");

    }

  });


/* =========================================
   SHARE WEBSITE
========================================= */

document
  .getElementById("shareWebsite")
  .addEventListener("click", async () => {

    const shareData = {

      title: CONFIG.title,

      text: CONFIG.description,

      url: window.location.href

    };

    if (navigator.share) {

      try {

        await navigator.share(shareData);

      } catch (error) {

        if (error.name !== "AbortError") {

          showToast("تعذّرت مشاركة الصفحة");

        }

      }

    } else {

      try {

        await copyText(window.location.href);

        showToast("تم نسخ رابط الصفحة ✓");

      } catch {

        showToast("تعذّر نسخ رابط الصفحة");

      }

    }

  });


/* =========================================
   SCROLL ANIMATIONS
========================================= */

const revealElements =
  document.querySelectorAll(".reveal");

const reducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


if (
  "IntersectionObserver" in window &&
  !reducedMotion
) {

  const observer = new IntersectionObserver(

    (entries, currentObserver) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          currentObserver.unobserve(
            entry.target
          );

        }

      });

    },

    {
      threshold: 0.08,
      rootMargin: "0px 0px -20px 0px"
    }

  );

  revealElements.forEach(element => {

    observer.observe(element);

  });

} else {

  revealElements.forEach(element => {

    element.classList.add("visible");

  });

}


/* =========================================
   FEEDBACK FORM
========================================= */

document.querySelector(".feedback-button").href =
  CONFIG.feedbackURL;


/* =========================================
   COPYRIGHT YEAR
========================================= */

document.getElementById("year").textContent =
  new Date().getFullYear();
