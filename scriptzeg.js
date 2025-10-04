
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
