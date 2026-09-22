/* ==========================================================================
   0. SPLASH SCREEN PRELOADER
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const splashScreen = document.getElementById('splash-screen');
  const splashVideo = document.getElementById('splash-video');
  const skipSplashBtn = document.getElementById('skip-splash');

  if (splashScreen && splashVideo) {
    // Unmute video and play if possible, otherwise keep muted
    // We start muted in HTML to auto-play, then try to unmute if user interacts
    
    const removeSplash = () => {
      splashScreen.classList.add('opacity-0');
      setTimeout(() => {
        splashScreen.remove();
        document.body.classList.remove('overflow-hidden');
      }, 700);
    };

    // Remove when video ends
    splashVideo.addEventListener('ended', removeSplash);
    
    // Or when skip button is clicked
    if (skipSplashBtn) {
      skipSplashBtn.addEventListener('click', removeSplash);
    }
    
    // Prevent scrolling while splash is active
    document.body.classList.add('overflow-hidden');
  }
});

/**
 * GRUPO UMA COLOMBIA - Main JavaScript
 * Interacciones, Sliders, Filtros, Modales y Cotizador
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSwiper();
  initCategoryTabs();
  initBikeCatalog();
  initIdealBikeQuiz();
  initQuoteModal();
  initMobileMenu();
  initCookieBanner();
  initCountrySelector();
});

/* ==========================================================================
   1. HERO SWIPER INITIALIZATION
   ========================================================================== */
function initHeroSwiper() {
  if (typeof Swiper !== 'undefined' && document.querySelector('.hero-swiper')) {
    new Swiper('.hero-swiper', {
      loop: true,
      autoplay: {
        delay: 5500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      speed: 800,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.hero-next',
        prevEl: '.hero-prev',
      },
    });
  }
}

/* ==========================================================================
   2. CATEGORY TABS & FILTERING
   ========================================================================== */
function initCategoryTabs() {
  const tabs = document.querySelectorAll('.cat-tab');
  const cards = document.querySelectorAll('.bike-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;

      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

function initBikeCatalog() {
  document.querySelectorAll('[data-filter-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetCat = btn.dataset.filterTrigger;
      const targetTab = document.querySelector(`.cat-tab[data-category="${targetCat}"]`);
      if (targetTab) {
        targetTab.click();
        const catalogSec = document.getElementById('catalogo-motos');
        if (catalogSec) {
          catalogSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* ==========================================================================
   3. "TU MOTO IDEAL" INTERACTIVE QUIZ
   ========================================================================== */
const quizState = {
  budget: null,
  usage: null,
  experience: null,
};

const bikeDatabase = [
  {
    name: 'Boxer CT100 KS',
    brand: 'Boxer',
    price: '$5.899.000',
    cc: '102 cc',
    power: '7.6 HP',
    desc: 'La moto de trabajo mÃ¡s rendidora y econÃ³mica de Colombia.',
    img: 'https://grupouma.com/colombia/wp-content/uploads/sites/2/2024/11/grupo-uma-miniatura-boxer-ks-new.webp',
    budgetTier: 'low',
    usageMatch: 'work',
  },
  {
    name: 'Boxer 150X',
    brand: 'Boxer',
    price: '$7.499.000',
    cc: '144.8 cc',
    power: '12 HP',
    desc: 'Potencia extra, suspensiÃ³n reforzada y estilo doble propÃ³sito.',
    img: 'https://grupouma.com/colombia/wp-content/uploads/sites/2/2024/11/grupouma-boxer-150x-azul-petroleo-menu.webp',
    budgetTier: 'low',
    usageMatch: 'work',
  },
  {
    name: 'Pulsar N125',
    brand: 'Pulsar',
    price: '$7.599.000',
    cc: '124.5 cc',
    power: '11.8 HP',
    desc: 'DiseÃ±o agresivo Naked, agilidad urbana superior y gran economÃ­a.',
    img: 'https://grupouma.com/colombia/wp-content/uploads/sites/2/2025/03/grupo-uma-pulsar-n125-d.webp',
    budgetTier: 'mid-low',
    usageMatch: 'city',
  },
  {
    name: 'Pulsar N160 Pro',
    brand: 'Pulsar',
    price: '$10.999.000',
    cc: '164.8 cc',
    power: '15.8 HP',
    desc: 'Frenos ABS Doble Canal, inyecciÃ³n electrÃ³nica y farola proyector LED.',
    img: 'https://grupouma.com/colombia/wp-content/uploads/sites/2/2025/07/grupouma-banner-pulsar-n160pro-after-480x320.webp',
    budgetTier: 'mid',
    usageMatch: 'city',
  },
  {
    name: 'Pulsar NS200 FI ABS',
    brand: 'Pulsar',
    price: '$15.799.000',
    cc: '199.5 cc',
    power: '24.1 HP',
    desc: 'Pura adrenalina con suspensiÃ³n invertida USD, frenos ABS y DTS-i 4V.',
    img: 'https://grupouma.com/colombia/wp-content/uploads/sites/2/2025/03/grupo-uma-pulsar-ns-200-fi-miniatura-mm.webp',
    budgetTier: 'mid-high',
    usageMatch: 'sport',
  },
  {
    name: 'Pulsar NS400Z',
    brand: 'Pulsar',
    price: '$18.299.000',
    cc: '373.3 cc',
    power: '40 HP',
    desc: 'La reina de la categorÃ­a: 40 HP, modos de conducciÃ³n, control de tracciÃ³n y conectividad.',
    img: 'https://grupouma.com/colombia/wp-content/uploads/sites/2/2024/10/grupouma-pulsar-ns-400z-mini.webp',
    budgetTier: 'high',
    usageMatch: 'sport',
  },
  {
    name: 'Dominar 400 Touring',
    brand: 'Dominar',
    price: '$19.399.000',
    cc: '373.3 cc',
    power: '39.5 HP',
    desc: 'Viajes sin lÃ­mites: CÃºpula touring, defensas de motor, soporte para celular y parrilla.',
    img: 'https://grupouma.com/colombia/wp-content/uploads/sites/2/2024/11/grupo-uma-logo-dominar-400.webp',
    budgetTier: 'high',
    usageMatch: 'touring',
  },
];

function initIdealBikeQuiz() {
  const quizModal = document.getElementById('quiz-modal');
  const openQuizBtns = document.querySelectorAll('.open-quiz-btn');
  const closeQuizBtns = document.querySelectorAll('.close-quiz-btn');
  const step1 = document.getElementById('quiz-step-1');
  const step2 = document.getElementById('quiz-step-2');
  const step3 = document.getElementById('quiz-step-3');
  const resultStep = document.getElementById('quiz-step-result');

  if (!quizModal) return;

  openQuizBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resetQuiz();
      quizModal.classList.remove('hidden');
    });
  });

  closeQuizBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      quizModal.classList.add('hidden');
    });
  });

  // Step 1: Budget
  document.querySelectorAll('.quiz-budget-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      quizState.budget = btn.dataset.budget;
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
    });
  });

  // Step 2: Usage
  document.querySelectorAll('.quiz-usage-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      quizState.usage = btn.dataset.usage;
      step2.classList.add('hidden');
      step3.classList.remove('hidden');
    });
  });

  // Step 3: Level/Type -> Compute result
  document.querySelectorAll('.quiz-level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      quizState.experience = btn.dataset.level;
      step3.classList.add('hidden');
      showQuizResult();
    });
  });

  function resetQuiz() {
    quizState.budget = null;
    quizState.usage = null;
    quizState.experience = null;
    if (step1) step1.classList.remove('hidden');
    if (step2) step2.classList.add('hidden');
    if (step3) step3.classList.add('hidden');
    if (resultStep) resultStep.classList.add('hidden');
  }

  function showQuizResult() {
    let match = bikeDatabase[3]; // default Pulsar N160

    if (quizState.usage === 'work' || quizState.budget === 'low') {
      match = quizState.budget === 'low' ? bikeDatabase[0] : bikeDatabase[1];
    } else if (quizState.usage === 'touring' || quizState.budget === 'high') {
      match = quizState.usage === 'touring' ? bikeDatabase[6] : bikeDatabase[5];
    } else if (quizState.usage === 'sport') {
      match = quizState.budget === 'mid-high' ? bikeDatabase[4] : bikeDatabase[5];
    } else {
      match = quizState.budget === 'mid-low' ? bikeDatabase[2] : bikeDatabase[3];
    }

    const imgEl = document.getElementById('quiz-result-img');
    const titleEl = document.getElementById('quiz-result-title');
    const priceEl = document.getElementById('quiz-result-price');
    const descEl = document.getElementById('quiz-result-desc');
    const specsEl = document.getElementById('quiz-result-specs');
    const quoteBtn = document.getElementById('quiz-result-quote-btn');

    if (imgEl) imgEl.src = match.img;
    if (titleEl) titleEl.textContent = match.name;
    if (priceEl) priceEl.textContent = `Precio oficial: ${match.price}`;
    if (descEl) descEl.textContent = match.desc;
    if (specsEl) specsEl.textContent = `${match.cc} â€¢ ${match.power}`;
    
    if (quoteBtn) {
      quoteBtn.onclick = () => {
        quizModal.classList.add('hidden');
        openQuoteWithModel(match.name);
      };
    }

    resultStep.classList.remove('hidden');
  }
}

/* ==========================================================================
   4. QUOTE MODAL (COTIZADOR)
   ========================================================================== */
function initQuoteModal() {
  const quoteModal = document.getElementById('quote-modal');
  const openQuoteBtns = document.querySelectorAll('.open-quote-btn');
  const closeQuoteBtns = document.querySelectorAll('.close-quote-btn');
  const quoteForm = document.getElementById('quote-form');
  const quoteSuccess = document.getElementById('quote-success');

  if (!quoteModal) return;

  openQuoteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modelName = btn.dataset.model || '';
      openQuoteWithModel(modelName);
    });
  });

  closeQuoteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      quoteModal.classList.add('hidden');
    });
  });

  quoteModal.addEventListener('click', (e) => {
    if (e.target === quoteModal) {
      quoteModal.classList.add('hidden');
    }
  });

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const modelSelect = document.getElementById('quote-model-select');
      const nameInput = document.getElementById('quote-name');
      const phoneInput = document.getElementById('quote-phone');
      const emailInput = document.getElementById('quote-email');
      const cityInput = document.getElementById('quote-city');

      const model = modelSelect ? modelSelect.value : '';
      const name = nameInput ? nameInput.value : '';
      const phone = phoneInput ? phoneInput.value : '';
      const email = emailInput ? emailInput.value : '';
      const city = cityInput ? cityInput.value : '';

      const waText = `Hola *Bajaj Carrera Motos Medellín*, deseo solicitar una cotización:%0A%0A` +
        `🏍️ *Modelo de interés:* ${encodeURIComponent(model)}%0A` +
        `👤 *Nombre completo:* ${encodeURIComponent(name)}%0A` +
        `📱 *Teléfono móvil:* ${encodeURIComponent(phone)}%0A` +
        `✉️ *Correo electrónico:* ${encodeURIComponent(email)}%0A` +
        `🏙️ *Ciudad de residencia:* ${encodeURIComponent(city)}`;

      const whatsappUrl = `https://wa.me/573246600562?text=${waText}`;

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');

      // Show success feedback
      quoteForm.classList.add('hidden');
      if (quoteSuccess) quoteSuccess.classList.remove('hidden');
      setTimeout(() => {
        quoteForm.reset();
        quoteForm.classList.remove('hidden');
        if (quoteSuccess) quoteSuccess.classList.add('hidden');
        quoteModal.classList.add('hidden');
      }, 4000);
    });
  }
}

window.openQuoteWithModel = function(modelName) {
  const quoteModal = document.getElementById('quote-modal');
  const selectModel = document.getElementById('quote-model-select');
  if (quoteModal) {
    if (selectModel && modelName) {
      for (let i = 0; i < selectModel.options.length; i++) {
        if (selectModel.options[i].text.toLowerCase().includes(modelName.toLowerCase())) {
          selectModel.selectedIndex = i;
          break;
        }
      }
    }
    quoteModal.classList.remove('hidden');
  }
};

/* ==========================================================================
   5. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('close-drawer-btn');
  const backdrop = document.getElementById('drawer-backdrop');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   6. COOKIE CONSENT BANNER
   ========================================================================== */
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies-btn');

  if (!banner || !acceptBtn) return;

  if (!localStorage.getItem('uma_cookie_consent')) {
    setTimeout(() => {
      banner.classList.remove('hidden');
    }, 1200);
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('uma_cookie_consent', 'true');
    banner.classList.add('hidden');
  });
}

/* ==========================================================================
   7. COUNTRY SELECTOR DROPDOWN
   ========================================================================== */
function initCountrySelector() {
  const trigger = document.getElementById('country-selector-btn');
  const menu = document.getElementById('country-dropdown-menu');

  if (!trigger || !menu) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    menu.classList.add('hidden');
  });
}