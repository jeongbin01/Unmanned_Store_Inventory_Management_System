class DashboardCommon {
  static initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    // Toggle sidebar on mobile
    sidebarToggle?.addEventListener('click', function () {
      sidebar.classList.toggle('show');
      sidebarOverlay.classList.toggle('show');
    });

    // Close sidebar when clicking overlay
    sidebarOverlay?.addEventListener('click', function () {
      sidebar.classList.remove('show');
      sidebarOverlay.classList.remove('show');
    });

    // Handle window resize
    window.addEventListener('resize', function () {
      if (window.innerWidth > 992) {
        sidebar.classList.remove('show');
        sidebarOverlay.classList.remove('show');
      }
    });
  }

  static initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {

        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));

        // Add active class to clicked link
        this.classList.add('active');

        // Close mobile sidebar
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        sidebar.classList.remove('show');
        sidebarOverlay.classList.remove('show');

        // Handle page switching logic here
        const page = this.dataset.page;
        console.log('Switching to page:', page);
      });
    });
  }

  static formatCurrency(value) {
    return '₩' + value.toLocaleString();
  }

  static addFadeInAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    });

    document.querySelectorAll('.stats-card, .chart-container').forEach(el => {
      observer.observe(el);
    });
  }
}