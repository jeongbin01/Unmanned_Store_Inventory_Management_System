document.addEventListener("DOMContentLoaded", () => {
  // 주간 매출 추이 (Line Chart)
  const salesCtx = document.getElementById("salesLineChart").getContext("2d");
  new Chart(salesCtx, {
    type: "line",
    data: {
      labels: ["월", "화", "수", "목", "금", "토", "일"],
      datasets: [{
        label: "매출(원)",
        data: [220000, 340000, 280000, 420000, 390000, 500000, 440000],
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "#3b82f6",
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // 상품별 판매 비율 (Doughnut Chart)
  const productCtx = document.getElementById("productDoughnutChart").getContext("2d");
  new Chart(productCtx, {
    type: "doughnut",
    data: {
      labels: ["음료", "스낵", "생활용품", "기타"],
      datasets: [{
        data: [45, 25, 20, 10],
        backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#64748b"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
});
