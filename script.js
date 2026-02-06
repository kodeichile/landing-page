// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
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

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // Header background on scroll
  const header = document.querySelector('.header');
  function updateHeader() {
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

  // Animation on scroll
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

  // Client Filters
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

  // ==========================================
  // CONTACT FORM HANDLER - GOOGLE SHEETS & REDIRECT
  // ==========================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); 

      const btnSubmit = contactForm.querySelector('.btn-submit');
      const formData = new FormData(contactForm);
      const url = contactForm.action;
      
      // Feedback visual
      btnSubmit.disabled = true;
      btnSubmit.innerText = 'Enviando...';

      // Usamos el modo 'no-cors' para evitar problemas de seguridad con Google
      fetch(url, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' 
      })
      .then(() => {
        // Redirección inmediata tras el envío exitoso
        window.location.href = "graciasforms.html";
      })
      .catch(error => {
        console.error('Error:', error);
        // Redirigimos igual en caso de error para no bloquear al usuario
        window.location.href = "graciasforms.html";
      });
      
      // Seguro de vida: Forzamos la redirección tras 4 segundos si algo se queda pegado
      setTimeout(() => {
        window.location.href = "graciasforms.html";
      }, 4000);
    });
  }
});
