"use strict";

/* =====================================
   الإعدادات
===================================== */

const CONFIG = {
  communityURL: "https://t.me/+6G4O9-Gd8942N2Jk",

  feedbackURL: "https://forms.gle/a7q2nxTtEFkN9dhW6",

  title: "نادي الكتاب بجامعة طرابلس",

  description: "نحو جامعة تقرأ، تفكّر، تتحاور"
};


/* =====================================
   قائمة الهواتف
===================================== */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function closeMenu() {
  mainNav.classList.remove("open");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "فتح القائمة");

  menuToggle.textContent = "☰";
}

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "إغلاق القائمة" : "فتح القائمة"
  );

  menuToggle.textContent = isOpen ? "×" : "☰";
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

document.addEventListener("click", event => {
  if (
    !mainNav.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    closeMenu();
  }
});


/* =====================================
   الوضع الليلي
===================================== */

const themeToggle = document.getElementById("themeToggle");

function getSavedTheme() {
  try {
    return localStorage.getItem("bookclub-theme");
  } catch {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("bookclub-theme", theme);
  } catch {
    // يستمر الموقع بالعمل دون التخزين المحلي.
  }
}

function updateTheme() {
  const dark = document.body.classList.contains("dark");

  themeToggle.textContent = dark ? "☀" : "☾";

  themeToggle.setAttribute(
    "aria-pressed",
    String(dark)
  );

  themeToggle.setAttribute(
    "aria-label",
    dark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الليلي"
  );

  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute(
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

  const dark = document.body.classList.contains("dark");

  saveTheme(dark ? "dark" : "light");

  updateTheme();
});


/* =====================================
   آراء المشاركين
===================================== */

/*
  أضف الآراء الحقيقية بعد موافقة المشاركين.

  مثال على بنية الرأي:

  {
    name: "اسم المشارك",
    role: "مشارك في النادي",
    quote: "نص الرأي الحقيقي"
  }
*/

const reviews = [];

const reviewText = document.getElementById("reviewText");
const reviewName = document.getElementById("reviewName");
const reviewRole = document.getElementById("reviewRole");

const reviewAuthor = document.getElementById("reviewAuthor");
const reviewControls = document.getElementById("reviewControls");
const reviewDots = document.getElementById("reviewDots");

const previousReview = document.getElementById("previousReview");
const nextReview = document.getElementById("nextReview");

const reviewCard = document.querySelector(".review-card");

let currentReview = 0;

function displayReview(index) {
  if (reviews.length === 0) {
    reviewText.textContent =
      "نترقّب مشاركاتكم وآراءكم حول تجربتكم مع نادي الكتاب. شاركونا تجاربكم لتكون جزءًا من هذا القسم.";

    reviewAuthor.hidden = true;
    reviewControls.hidden = true;

    return;
  }

  currentReview = (index + reviews.length) % reviews.length;

  const review = reviews[currentReview];

  reviewText.textContent = `«${review.quote}»`;
  reviewName.textContent = review.name;
  reviewRole.textContent = review.role;

  reviewAuthor.hidden = false;
  reviewControls.hidden = reviews.length <= 1;

  Array.from(reviewDots.children).forEach((dot, i) => {
    const active = i === currentReview;

    dot.classList.toggle("active", active);
    dot.setAttribute("aria-current", String(active));
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
    displayReview(index);
  });

  reviewDots.appendChild(dot);
});

previousReview.addEventListener("click", () => {
  displayReview(currentReview - 1);
});

nextReview.addEventListener("click", () => {
  displayReview(currentReview + 1);
});

/* دعم التنقل بلوحة المفاتيح */

reviewCard.addEventListener("keydown", event => {
  if (reviews.length <= 1) return;

  if (event.target.closest("button")) return;

  if (event.key === "ArrowLeft") {
    displayReview(currentReview + 1);
  }

  if (event.key === "ArrowRight") {
    displayReview(currentReview - 1);
  }
});

/* دعم السحب على الهواتف */

let touchStartX = 0;

reviewCard.addEventListener(
  "touchstart",
  event => {
    touchStartX = event.changedTouches[0].screenX;
  },
  { passive: true }
);

reviewCard.addEventListener(
  "touchend",
  event => {
    if (reviews.length <= 1) return;

    const touchEndX = event.changedTouches[0].screenX;
    const difference = touchStartX - touchEndX;

    if (Math.abs(difference) < 50) return;

    displayReview(
      difference > 0
        ? currentReview + 1
        : currentReview - 1
    );
  },
  { passive: true }
);

displayReview(0);


/* =====================================
   القوائم القابلة للتوسيع
===================================== */

const accordions = document.querySelectorAll(
  ".about-details details"
);

accordions.forEach(current => {
  current.addEventListener("toggle", () => {
    if (!current.open) return;

    accordions.forEach(other => {
      if (other !== current) {
        other.open = false;
      }
    });
  });
});


/* =====================================
   الإشعارات
===================================== */

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


/* =====================================
   نسخ النص
===================================== */

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
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


/* =====================================
   نسخ رابط المجتمع
===================================== */

document
  .getElementById("copyCommunity")
  .addEventListener("click", async () => {
    try {
      await copyText(CONFIG.communityURL);

      showToast("تم نسخ رابط المجتمع بنجاح");
    } catch {
      showToast("تعذّر نسخ الرابط");
    }
  });


/* =====================================
   مشاركة الموقع
===================================== */

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

        showToast("تم نسخ رابط الصفحة");
      } catch {
        showToast("تعذّر نسخ رابط الصفحة");
      }
    }
  });


/* =====================================
   حركات الظهور
===================================== */

const revealElements = document.querySelectorAll(".reveal");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reducedMotion) {
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


/* =====================================
   سنة حقوق النشر
===================================== */

document.getElementById("year").textContent =
  new Date().getFullYear();
