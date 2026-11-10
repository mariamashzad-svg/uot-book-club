"use strict";

/* =========================================
   WEBSITE CONFIGURATION
========================================= */

const CONFIG = {
  communityURL: "https://t.me/+6G4O9-Gd8942N2Jk",

  feedbackURL: "https://forms.gle/a7q2nxTtEFkN9dhW6",

  websiteTitle: "نادي الكتاب بجامعة طرابلس",

  websiteDescription: "نحو جامعة تقرأ، تفكّر، تتحاور"
};


/* =========================================
   REVIEWS DATA
========================================= */

/*
  هنا يمكنك إضافة آراء المشاركين الحقيقية.

  مثال:

  {
    name: "اسم المشارك",
    role: "مشارك في النادي",
    quote: "نص الرأي الذي وافق المشارك على نشره"
  }

  لن تُعرض أي شهادات افتراضية على الموقع.
*/

const reviews = [];


/* =========================================
   REVIEWS CAROUSEL
========================================= */

const reviewQuote = document.getElementById("reviewQuote");

const reviewName = document.getElementById("reviewName");

const reviewRole = document.getElementById("reviewRole");

const reviewDots = document.getElementById("reviewDots");

const reviewAuthor = document.getElementById("reviewAuthor");

const reviewsControls = document.getElementById("reviewsControls");

const reviewPrev = document.getElementById("reviewPrev");

const reviewNext = document.getElementById("reviewNext");

let currentReview = 0;


function showReview(index) {

  if (reviews.length === 0) {

    reviewQuote.textContent =
      "نترقّب مشاركاتكم وآراءكم عن تجربتكم مع نادي الكتاب. شاركونا تجاربكم لتكون جزءًا من هذا القسم.";

    reviewAuthor.hidden = true;

    reviewsControls.hidden = true;

    return;
  }

  currentReview = (index + reviews.length) % reviews.length;

  const review = reviews[currentReview];

  reviewQuote.textContent = `«${review.quote}»`;

  reviewName.textContent = review.name;

  reviewRole.textContent = review.role;

  reviewAuthor.hidden = false;

  reviewsControls.hidden = reviews.length <= 1;

  Array.from(reviewDots.children).forEach((dot, dotIndex) => {

    const isActive = dotIndex === currentReview;

    dot.classList.toggle("active", isActive);

    dot.setAttribute("aria-current", String(isActive));

  });

}


reviews.forEach((review, index) => {

  const dot = document.createElement("button");

  dot.type = "button";

  dot.className = "review-dot";

  dot.setAttribute(
    "aria-label",
    `عرض الرأي ${index + 1}`
  );

  dot.addEventListener("click", () => {
    showReview(index);
  });

  reviewDots.appendChild(dot);

});


reviewPrev.addEventListener("click", () => {
  showReview(currentReview - 1);
});

reviewNext.addEventListener("click", () => {
  showReview(currentReview + 1);
});

showReview(0);


/* =========================================
   TOAST NOTIFICATIONS
========================================= */

const toast = document.getElementById("toast");

let toastTimer;


function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);

}


/* =========================================
   CLIPBOARD
========================================= */

async function copyText(value) {

  if (navigator.clipboard && window.isSecureContext) {

    await navigator.clipboard.writeText(value);

    return;
  }

  const input = document.createElement("textarea");

  input.value = value;

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

const copyBtn = document.getElementById("copyBtn");


copyBtn.addEventListener("click", async () => {

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

const shareBtn = document.getElementById("shareBtn");


shareBtn.addEventListener("click", async () => {

  const data = {
    title: CONFIG.websiteTitle,
    text: CONFIG.websiteDescription,
    url: window.location.href
  };

  if (navigator.share) {

    try {

      await navigator.share(data);

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
   DARK MODE
========================================= */

const themeBtn = document.getElementById("themeBtn");


try {

  if (localStorage.getItem("bookclub-theme") === "dark") {
    document.body.classList.add("dark");
  }

} catch {

  // Continue with the default light theme.

}


function updateThemeButton() {

  const dark = document.body.classList.contains("dark");

  themeBtn.textContent = dark ? "☀" : "◐";

  themeBtn.setAttribute("aria-pressed", String(dark));

  themeBtn.setAttribute(
    "aria-label",
    dark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"
  );

}


updateThemeButton();


themeBtn.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  const dark = document.body.classList.contains("dark");

  try {

    localStorage.setItem(
      "bookclub-theme",
      dark ? "dark" : "light"
    );

  } catch {

    // Theme switching still works for this session.

  }

  updateThemeButton();

});


/* =========================================
   REVEAL ANIMATIONS
========================================= */

const revealElements = document.querySelectorAll(".reveal");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


if (
  "IntersectionObserver" in window &&
  !prefersReducedMotion
) {

  const observer = new IntersectionObserver(

    (entries, currentObserver) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          currentObserver.unobserve(entry.target);

        }

      });

    },

    {
      threshold: 0.08
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
   ACCORDION
========================================= */

const accordions = document.querySelectorAll(".accordion details");


accordions.forEach(current => {

  current.addEventListener("toggle", () => {

    if (!current.open) {
      return;
    }

    accordions.forEach(other => {

      if (other !== current) {
        other.open = false;
      }

    });

  });

});


/* =========================================
   KEYBOARD REVIEWS NAVIGATION
========================================= */

document
  .querySelector(".reviews-section")
  .addEventListener("keydown", event => {

    if (reviews.length <= 1) {
      return;
    }

    if (event.key === "ArrowLeft") {
      showReview(currentReview + 1);
    }

    if (event.key === "ArrowRight") {
      showReview(currentReview - 1);
    }

  });


/* =========================================
   FEEDBACK LINK
========================================= */

const feedbackButton = document.querySelector(".feedback-button");

feedbackButton.href = CONFIG.feedbackURL;


/* =========================================
   COPYRIGHT YEAR
========================================= */

document.getElementById("year").textContent =
  new Date().getFullYear();
