/* ===================================
   GLOBAL STATE & DOM ELEMENTS
=================================== */

const header = document.querySelector('.site-header');
const hero = document.querySelector('#hero');
const toggleBtn = document.querySelector('.mode-toggle');
const body = document.body;
const backToTopBtn = document.querySelector('.back-to-top');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav a');

/* ===================================
   THEME MANAGEMENT
=================================== */

const theme = {
  current: localStorage.getItem('theme') || 'dark',
  
  apply() {
    body.classList.toggle('light', this.current === 'light');
    toggleBtn.querySelector('.toggle-icon').textContent = 
      this.current === 'light' ? '🌙' : '☀️';
  },
  
  toggle() {
    this.current = this.current === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.current);
    this.apply();
  }
};

// Apply saved theme on load
theme.apply();

// Theme toggle with smooth transition
toggleBtn.addEventListener('click', () => {
  body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  theme.toggle();
  
  setTimeout(() => {
    body.style.transition = '';
  }, 300);
});

/* ===================================
   HEADER SCROLL BEHAVIOR
=================================== */

let lastScrollY = window.scrollY;
let ticking = false;

function updateHeader() {
  const scrollY = window.scrollY;
  const heroHeight = hero ? hero.offsetHeight - 100 : 300;
  
  // Add scrolled class when past hero section
  if (scrollY > heroHeight) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScrollY = scrollY;
  ticking = false;
}

function requestHeaderUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(updateHeader);
    ticking = true;
  }
}

window.addEventListener('scroll', requestHeaderUpdate, { passive: true });

/* ===================================
   SMOOTH SCROLL FOR NAVIGATION
=================================== */

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    
    // Only handle internal anchor links
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update active state
        updateActiveNavLink(targetId);
      }
    }
  });
});

/* ===================================
   ACTIVE NAVIGATION LINK
=================================== */

function updateActiveNavLink(activeId) {
  navLinks.forEach(link => {
    const href = link.getAttribute('href').substring(1);
    if (href === activeId) {
      link.style.color = 'var(--primary)';
    } else {
      link.style.color = '';
    }
  });
}

/* ===================================
   INTERSECTION OBSERVER FOR SECTIONS
=================================== */

const observerOptions = {
  threshold: 0.3,
  rootMargin: '-100px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add animation class
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      
      // Update active navigation
      const id = entry.target.getAttribute('id');
      if (id) {
        updateActiveNavLink(id);
      }
    }
  });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
  // Set initial state for animation
  if (section.id !== 'hero') {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  }
  sectionObserver.observe(section);
});

/* ===================================
   BACK TO TOP BUTTON
=================================== */

function updateBackToTop() {
  if (window.scrollY > 500) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

window.addEventListener('scroll', updateBackToTop, { passive: true });

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

/* ===================================
   SCROLL ANIMATIONS FOR ELEMENTS
=================================== */

// Animate stats when in view
const statItems = document.querySelectorAll('.stat-item');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumber = entry.target.querySelector('.stat-number');
      const finalNumber = statNumber.textContent;
      
      // Animate number counting
      animateValue(statNumber, finalNumber);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statItems.forEach(item => statObserver.observe(item));

function animateValue(element, endValue) {
  const isPercentage = endValue.includes('%');
  const isPlus = endValue.includes('+');
  const numericValue = parseInt(endValue.replace(/[^0-9]/g, ''));
  const duration = 1500;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = Math.floor(easeOutQuart * numericValue);
    
    element.textContent = currentValue + (isPlus ? '+' : '') + (isPercentage ? '%' : '');
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = endValue;
    }
  }
  
  requestAnimationFrame(update);
}

/* ===================================
   PROJECT CARDS HOVER EFFECT
=================================== */

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
  });
  
  card.addEventListener('mousemove', function(e) {
    if (window.innerWidth > 768) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

/* ===================================
   SKILL ITEMS STAGGER ANIMATION
=================================== */

const skillCategories = document.querySelectorAll('.skill-category');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 100);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

skillCategories.forEach(category => {
  category.style.opacity = '0';
  category.style.transform = 'translateY(30px)';
  category.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  skillObserver.observe(category);
});

/* ===================================
   CONTACT CARDS ANIMATION
=================================== */

const contactCards = document.querySelectorAll('.contact-card');
const contactObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 150);
      contactObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

contactCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  contactObserver.observe(card);
});

/* ===================================
   KEYBOARD ACCESSIBILITY
=================================== */

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
  // ESC to scroll to top
  if (e.key === 'Escape' && window.scrollY > 500) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Shift + T to toggle theme
  if (e.shiftKey && e.key === 'T') {
    e.preventDefault();
    toggleBtn.click();
  }
});

/* ===================================
   PERFORMANCE OPTIMIZATIONS
=================================== */

// Debounce function for resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle window resize
const handleResize = debounce(() => {
  // Reset any transform on project cards when resizing
  projectCards.forEach(card => {
    card.style.transform = '';
  });
}, 250);

window.addEventListener('resize', handleResize);

/* ===================================
   LAZY LOADING IMAGES
=================================== */

const images = document.querySelectorAll('img[loading="lazy"]');

if ('loading' in HTMLImageElement.prototype) {
  // Browser supports native lazy loading
  images.forEach(img => {
    img.src = img.src;
  });
} else {
  // Fallback for older browsers
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.src;
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

/* ===================================
   CONSOLE EASTER EGG
=================================== */

console.log(
  '%c👋 Halo Developer!',
  'font-size: 20px; font-weight: bold; color: #3b82f6;'
);
console.log(
  '%cTertarik dengan kode website ini? Check it out di GitHub!',
  'font-size: 14px; color: #9ca3af;'
);
console.log(
  '%chttps://github.com/mkhairultegar',
  'font-size: 12px; color: #3b82f6; text-decoration: underline;'
);

/* ===================================
   INITIALIZATION
=================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initial header update
  updateHeader();
  
  // Initial back to top button state
  updateBackToTop();
  
  // Add loaded class to body for any CSS transitions
  setTimeout(() => {
    body.classList.add('loaded');
  }, 100);
  
  console.log('🚀 Website initialized successfully!');
});

/* ===================================
   ERROR HANDLING
=================================== */

window.addEventListener('error', (e) => {
  console.error('An error occurred:', e.error);
});

// Service Worker Registration (optional, for PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js')
    //   .then(reg => console.log('Service Worker registered'))
    //   .catch(err => console.log('Service Worker registration failed'));
  });
}