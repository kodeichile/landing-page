/**
 * KODEI - Soluciones Tecnológicas e Inteligencia de Datos
 * Main JavaScript Handler - Versión Unificada con GTM Ready
 */

// 1. Funciones Globales (Back to Top)
window.scrollToTop = function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.addEventListener('DOMContentLoaded', function() {
  
  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      const isExpanded = mobileMenu.classList.contains('active');
      mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    });

    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Smooth Scroll para Anclas ---
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerElement = document.querySelector('.header');
        const headerHeight = headerElement ? headerElement.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // --- Header Control on Scroll ---
  const header = document.querySelector('.header');
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 50) {
      header.style.backgroundColor = 'rgba(250, 250, 250, 0.95)';
      header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
    } else {
      header.style.backgroundColor = 'rgba(250, 250, 250, 0.7)';
      header.style.boxShadow = 'none';
    }
  }
  window.addEventListener('scroll', updateHeader);
  updateHeader();

  // --- Animaciones de Entrada (Intersection Observer) ---
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .product-card, .client-card').forEach(function(card) {
    observer.observe(card);
  });

  // --- Filtros de Clientes/Proyectos ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const clientCards = document.querySelectorAll('.client-card');

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      const filter = this.getAttribute('data-filter');
      clientCards.forEach(function(card) {
        const category = card.getAttribute('data-category');
        if (filter === 'todos' || category === filter) {
          card.classList.remove('hidden');
          setTimeout(function() {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(function() { card.classList.add('hidden'); }, 300);
        }
      });
    });
  });

  // --- Botón Back to Top (Visibilidad) ---
  const scrollButton = document.getElementById("scrollToTop");
  if (scrollButton) {
    window.addEventListener("scroll", () => {
      scrollButton.style.display = (window.scrollY > 300) ? "flex" : "none";
    });
  }

  // --- Contact Form Handler (Google Sheets, GTM & Redirect) ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); 

      const btnSubmit = contactForm.querySelector('.btn-submit');
      const formData = new FormData(contactForm);
      const url = contactForm.action;
      
      btnSubmit.disabled = true;
      btnSubmit.innerText = 'Enviando...';

      fetch(url, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' 
      })
      .then(() => {
        // SEÑAL PARA GOOGLE TAG MANAGER
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'form_submission_success',
          'form_id': 'contact_main'
        });

        window.location.href = "graciasforms.html";
      })
      .catch(error => {
        console.error('Error:', error);
        window.location.href = "graciasforms.html";
      });
      
      // Seguro de vida: Redirección forzada tras 4 segundos
      setTimeout(() => {
        if(window.location.pathname !== "/graciasforms.html") {
            window.location.href = "graciasforms.html";
        }
      }, 4000);
    });
  }
});
