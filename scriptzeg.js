
    document.addEventListener('DOMContentLoaded', function() {
      const menuToggle = document.getElementById('menuToggle');
      const sidebar = document.getElementById('sidebar');
      const menuOverlay = document.getElementById('menuOverlay');

      // Ouvrir/fermer le menu
      menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        sidebar.classList.toggle('active');
        menuOverlay.classList.toggle('active');
      });

      // Fermer le menu en cliquant sur l'overlay
      menuOverlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        sidebar.classList.remove('active');
        this.classList.remove('active');
      });

      // Fermer le menu en cliquant sur un lien
      document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', function() {
          menuToggle.classList.remove('active');
          sidebar.classList.remove('active');
          menuOverlay.classList.remove('active');
        });
      });

      // Gestion des réponses (existant)
      document.querySelectorAll('.reponse').forEach(reponse => {
        reponse.addEventListener('click', function(e) {
          e.stopPropagation();
          this.classList.toggle('visible');
        });
      });

      // Raccourci clavier "A" (existant)
      document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          const allReponses = document.querySelectorAll('.reponse');
          const allVisible = Array.from(allReponses).every(r => r.classList.contains('visible'));
          allReponses.forEach(r => allVisible ? r.classList.remove('visible') : r.classList.add('visible'));
        }
      });
    });

// Gestion du zoom des images
document.addEventListener('DOMContentLoaded', function() {
  // Créer le modal
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.innerHTML = `
    <div class="image-modal-content">
      <button class="image-modal-close">&times;</button>
      <button class="image-modal-nav image-modal-prev">‹</button>
      <button class="image-modal-nav image-modal-next">›</button>
      <div class="image-modal-counter"></div>
      <img src="" alt="">
      <div class="image-modal-caption"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector('img');
  const modalCaption = modal.querySelector('.image-modal-caption');
  const modalClose = modal.querySelector('.image-modal-close');
  const modalPrev = modal.querySelector('.image-modal-prev');
  const modalNext = modal.querySelector('.image-modal-next');
  const modalCounter = modal.querySelector('.image-modal-counter');

  let currentImageIndex = 0;
  let images = [];

  // Récupérer toutes les images zoomables
  function getZoomableImages() {
    return Array.from(document.querySelectorAll('figure img'));
  }

  // Ouvrir le modal
  function openModal(index) {
    images = getZoomableImages();
    currentImageIndex = index;
    updateModal();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Mettre à jour le modal
  function updateModal() {
    const currentImage = images[currentImageIndex];
    const figure = currentImage.closest('figure');
    const caption = figure ? figure.querySelector('figcaption') : null;

    modalImg.src = currentImage.src;
    modalImg.alt = currentImage.alt;
    modalCaption.textContent = caption ? caption.textContent : currentImage.alt;
    modalCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;

    // Masquer les boutons de navigation s'il n'y a qu'une image
    modalPrev.style.display = images.length > 1 ? 'flex' : 'none';
    modalNext.style.display = images.length > 1 ? 'flex' : 'none';
    modalCounter.style.display = images.length > 1 ? 'block' : 'none';
  }

  // Fermer le modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    modalImg.classList.remove('zoomed');
  }

  // Navigation
  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateModal();
  }

  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateModal();
  }

  // Zoom/dézoom au clic sur l'image
  function toggleZoom() {
    modalImg.classList.toggle('zoomed');
  }

  // Événements
  document.querySelectorAll('figure img').forEach((img, index) => {
    img.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(index);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalNext.addEventListener('click', nextImage);
  modalPrev.addEventListener('click', prevImage);
  modalImg.addEventListener('click', toggleZoom);

  // Fermer avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    switch(e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case ' ':
        e.preventDefault();
        toggleZoom();
        break;
    }
  });

  // Fermer en cliquant en dehors de l'image
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
});
