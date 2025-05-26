// JS/Dashboard.js
class Dashboard {
  constructor() {
    this.salesChart = null;
    this.productChart = null;
    this.init();
  }

  init() {
    this.initCharts();
    this.loadDashboardData();
  }

  initCharts() {
    this.initSalesChart();
    this.initProductChart();
  }

  initSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');

    this.salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['월', '화', '수', '목', '금', '토', '일'],
        datasets: [{
          label: '매출 (원)',
          data: [220000, 280000, 340000, 290000, 420000, 480000, 440000],
          borderColor: '#4285f4',
          backgroundColor: 'rgba(66, 133, 244, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#4285f4',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: '#4285f4',
            borderWidth: 1,
            callbacks: {
              label: function (context) {
                return DashboardCommon.formatCurrency(context.parsed.y);
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.05)',
              drawBorder: false
            },
            ticks: {
              callback: function (value) {
                return DashboardCommon.formatCurrency(value);
              },
              color: '#666',
              font: {
                size: 11
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#666',
              font: {
                size: 12
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  initProductChart() {
    const ctx = document.getElementById('productChart').getContext('2d');

    this.productChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['음료', '스낵', '생활용품', '기타'],
        datasets: [{
          data: [45, 30, 15, 10],
          backgroundColor: [
            '#4285f4',
            '#34a853',
            '#fbbc04',
            '#ea4335'
          ],
          borderWidth: 0,
          hoverOffset: 15,
          hoverBorderWidth: 2,
          hoverBorderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 13
              },
              color: '#666'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: '#4285f4',
            borderWidth: 1,
            callbacks: {
              label: function (context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        },
        cutout: '65%',
        animation: {
          animateRotate: true,
          duration: 1000
        }
      }
    });
  }

  loadDashboardData() {
    // Simulate loading data
    setTimeout(() => {
      this.updateStats();
    }, 500);
  }

  updateStats() {
    // Update statistics with animation
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
      stat.style.opacity = '0';
      setTimeout(() => {
        stat.style.transition = 'opacity 0.5s ease';
        stat.style.opacity = '1';
      }, 100);
    });
  }

  refreshCharts() {
    if (this.salesChart) {
      this.salesChart.update();
    }
    if (this.productChart) {
      this.productChart.update();
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize common functionality
  DashboardCommon.initSidebar();
  DashboardCommon.initNavigation();
  DashboardCommon.addFadeInAnimation();

  // Initialize dashboard
  const dashboard = new Dashboard();

  // Handle window resize for charts
  window.addEventListener('resize', function () {
    dashboard.refreshCharts();
  });
});