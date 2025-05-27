const salesData = [
    { date: "2024-05-20", orders: 12, total: 184000 },
    { date: "2024-05-21", orders: 18, total: 213000 },
    { date: "2024-05-22", orders: 14, total: 190000 },
    { date: "2024-05-23", orders: 21, total: 250000 },
    { date: "2024-05-24", orders: 17, total: 223000 },
    { date: "2024-05-25", orders: 20, total: 278000 },
    { date: "2024-05-26", orders: 15, total: 198000 },
];

const categorySales = {
    "음료": 340000,
    "스낵": 280000,
    "생활용품": 150000,
    "기타": 90000,
};

// 📊 Line Chart (일별 매출)
const ctxLine = document.getElementById("dailySalesChart").getContext("2d");
new Chart(ctxLine, {
    type: "line",
    data: {
        labels: salesData.map(s => s.date),
        datasets: [{
            label: "일별 매출",
            data: salesData.map(s => s.total),
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderColor: "#3b82f6",
            fill: true,
            tension: 0.3,
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

// 🍩 Doughnut Chart (카테고리 비율)
const ctxDoughnut = document.getElementById("categorySalesChart").getContext("2d");
new Chart(ctxDoughnut, {
    type: "doughnut",
    data: {
        labels: Object.keys(categorySales),
        datasets: [{
            data: Object.values(categorySales),
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

// 📋 Table Rendering
const tbody = document.getElementById("salesTableBody");
salesData.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${s.date}</td>
    <td>${s.orders}건</td>
    <td>₩${s.total.toLocaleString()}</td>
  `;
    tbody.appendChild(tr);
});
