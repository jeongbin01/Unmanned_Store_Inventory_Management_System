document.addEventListener('DOMContentLoaded', () => {
  // 사이드바 토글
  const sidebar = document.getElementById('sidebar');
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    sidebar.classList.toggle('show');
  });

  // KPI 렌더링
  document.getElementById('totalSales').textContent = 
    dashboardData.kpis.totalSales.toLocaleString() + '원';
  document.getElementById('totalOrders').textContent = 
    dashboardData.kpis.totalOrders + '개';
  document.getElementById('totalStock').textContent = 
    dashboardData.kpis.totalStock + '개';
  document.getElementById('totalAlerts').textContent = 
    dashboardData.kpis.totalAlerts + '건';

  // 차트 생성 (Chart.js)
  const salesCtx = document.getElementById('salesChart').getContext('2d');
  new Chart(salesCtx, {
    type: 'line',
    data: {
      labels: dashboardData.salesTrend.labels,
      datasets: [{
        label: '일별 매출',
        data: dashboardData.salesTrend.data,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });

  const prodCtx = document.getElementById('productChart').getContext('2d');
  new Chart(prodCtx, {
    type: 'doughnut',
    data: {
      labels: dashboardData.productSales.labels,
      datasets: [{
        data: dashboardData.productSales.data,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });
});
