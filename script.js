document.addEventListener('DOMContentLoaded', () => {
  // ===== CONTROLE DE SCROLL AO RECARREGAR =====
  const navigationEntries = performance.getEntriesByType("navigation");
  const isReload = navigationEntries.length > 0 && navigationEntries[0].type === 'reload';
  const isHardReload = performance.navigation?.type === 1 || window.performance?.navigation?.type === 1;

  if (isReload || isHardReload) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 50);
  }

  // ===== ANIMAÇÃO DE SEÇÕES =====
  const sections = document.querySelectorAll('.section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'));
  }, { root: null, rootMargin: '0px', threshold: 0.1 });

  sections.forEach(section => sectionObserver.observe(section));

  // ===== CONTROLE DO MENU HAMBÚRGUER =====
  const menuToggle = document.querySelector('.menu-toggle');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.navbar a');

  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navbar.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', menuToggle.classList.contains('active'));
    });
  }

  // ===== SCROLL SUAVE E FECHAR MENU =====
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        menuToggle.classList.remove('active');
        navbar.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
      
      if (link.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(link.getAttribute('href'));
        if (targetSection) {
          window.scrollTo({ top: targetSection.offsetTop, behavior: 'smooth' });
          document.querySelectorAll('.section-content').forEach(c => c.classList.remove('highlighted'));
        }
      }
    });
  });

  // ===== CUBO SOCIAL INTERATIVO =====
  /**
   * Controla o cubo social:
   * - Pausa a rotação quando o mouse está sobre qualquer face
   * - Permite fácil seleção da rede social desejada
   * - Retoma a rotação quando o mouse sai
   */
  const socialCube = document.querySelector('.social-cube');
  const socialFaces = document.querySelectorAll('.social-cube .face');
  
  if (socialCube) {
    // Pausa quando qualquer face é hover/touch
    socialFaces.forEach(face => {
      face.addEventListener('mouseenter', () => {
        socialCube.style.animationPlayState = 'paused';
      });
      
      face.addEventListener('mouseleave', () => {
        socialCube.style.animationPlayState = 'running';
      });
      
      // Para dispositivos touch
      face.addEventListener('touchstart', (e) => {
        socialCube.style.animationPlayState = 'paused';
        e.stopPropagation(); // Evita propagação para o documento
      });
    });
    
    // Retoma a rotação após 3 segundos sem interação em dispositivos touch
    let touchTimer;
    socialCube.addEventListener('touchend', () => {
      clearTimeout(touchTimer);
      touchTimer = setTimeout(() => {
        socialCube.style.animationPlayState = 'running';
      }, 3000);
    });
  }

  // ===== CONTROLE DE ANIMAÇÕES =====
  const carousels = document.querySelectorAll('.partners-carousel');
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    });
  }, { threshold: 0.1 });

  carousels.forEach(el => visibilityObserver.observe(el));

  // ===== COMPORTAMENTO MOBILE =====
  const sectionContents = document.querySelectorAll('.section-content');
  const removeAllHighlights = () => sectionContents.forEach(c => c.classList.remove('highlighted'));

  sectionContents.forEach(content => {
    content.addEventListener('mouseenter', () => {
      if (window.innerWidth <= 768) {
        removeAllHighlights();
        content.classList.add('highlighted');
      }
    });
    
    content.addEventListener('mouseleave', () => {
      if (window.innerWidth <= 768 && !content.matches(':active')) {
        content.classList.remove('highlighted');
      }
    });
    
    content.addEventListener('touchstart', (e) => {
      if (window.innerWidth <= 768) {
        content.classList.toggle('highlighted', !content.classList.contains('highlighted'));
        removeAllHighlights();
        content.classList.contains('highlighted') && content.classList.add('highlighted');
        e.stopPropagation();
      }
    });
  });

  // ===== EVENTOS GLOBAIS =====
  document.addEventListener('touchstart', (e) => {
    if (window.innerWidth <= 768 && !e.target.closest('.section-content')) {
      removeAllHighlights();
    }
  });

  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 768) removeAllHighlights();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) removeAllHighlights();
  });
});