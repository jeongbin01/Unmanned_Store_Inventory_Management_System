'use strict';

// 샘플 데이터 (7일치)
const sampleData = [
    { date: '2025-03-09', sales: 452000, orders: 87, profit: 153680 },
    { date: '2025-03-10', sales: 387500, orders: 74, profit: 131750 },
    { date: '2025-03-11', sales: 421000, orders: 81, profit: 143140 },
    { date: '2025-03-12', sales: 376000, orders: 72, profit: 127840 },
    { date: '2025-03-13', sales: 398500, orders: 79, profit: 135490 },
    { date: '2025-03-14', sales: 547000, orders: 105, profit: 186150 },
    { date: '2025-03-15', sales: 615000, orders: 118, profit: 209100 },
];

// 카테고리·결제 데이터
const categoryData = [
    { category: '전자제품', value: 3045000 },
    { category: '의류/신발', value: 2315000 },
    { category: '도서/문구', value: 1800000 },
    { category: '생활용품', value: 1400000 },
    { category: '식품/음료', value: 1200000 }
];
const paymentData = [
    { method: '신용카드', value: 2045000 },
    { method: '현금', value: 1200000 },
    { method: '모바일결제', value: 1000000 },
    { method: '포인트', value: 500000 }
];

// --- DOM 참조 ---
const dateRangeEl = document.getElementById('dateRange');
const kpiTotalSales = document.getElementById('kpiTotalSales');
const kpiTotalOrders = document.getElementById('kpiTotalOrders');
const kpiTotalProfit = document.getElementById('kpiTotalProfit');
const kpiAvgOrder = document.getElementById('kpiAvgOrder');
const kpiAvgROI = document.getElementById('kpiAvgROI');
const kpiSalesChange = document.getElementById('kpiSalesChange');
const kpiOrdersChange = document.getElementById('kpiOrdersChange');
const kpiProfitChange = document.getElementById('kpiProfitChange');
const kpiAvgOrderChange = document.getElementById('kpiAvgOrderChange');
const kpiROIChange = document.getElementById('kpiROIChange');

const salesOrdersCtx = document.getElementById('salesOrdersChart').getContext('2d');
const profitCtx = document.getElementById('profitChart').getContext('2d');
const categoryCtx = document.getElementById('categoryChart').getContext('2d');
const paymentCtx = document.getElementById('paymentChart').getContext('2d');

const categoryListEl = document.getElementById('categoryList');
const paymentListEl = document.getElementById('paymentList');
const detailTableBody = document.getElementById('detailTableBody');

let salesOrdersChart, profitChart, categoryChart, paymentChart;

// 날짜 범위
dateRangeEl.textContent = '2025년 7월 9일 (수) - 2025년 7월 15일 (화)';

// KPI 렌더
function renderKPI() {
    const totalSales = sampleData.reduce((a, b) => a + b.sales, 0);
    const totalOrders = sampleData.reduce((a, b) => a + b.orders, 0);
    const totalProfit = sampleData.reduce((a, b) => a + b.profit, 0);
    const avgOrder = Math.round(totalSales / totalOrders);
    const avgROI = Math.round((totalProfit / totalSales) * 100);

    kpiTotalSales.textContent = `${totalSales.toLocaleString()}원`;
    kpiTotalOrders.textContent = `${totalOrders}건`;
    kpiTotalProfit.textContent = `${totalProfit.toLocaleString()}원`;
    kpiAvgOrder.textContent = `${avgOrder.toLocaleString()}원`;
    kpiAvgROI.textContent = `${avgROI}%`;

    kpiSalesChange.textContent = '▲7.2%';
    kpiOrdersChange.textContent = '▲3.8%';
    kpiProfitChange.textContent = '▲6.5%';
    kpiAvgOrderChange.textContent = '▲2.3%';
    kpiROIChange.textContent = '▲1.2%';
}

// 매출 & 거래 차트
function drawSalesOrders() {
    if (salesOrdersChart) salesOrdersChart.destroy();
    salesOrdersChart = new Chart(salesOrdersCtx, {
        data: {
            labels: sampleData.map(d => d.date.slice(5).replace('-', '\.')),
            datasets: [
                {
                    type: 'line', label: '매출', data: sampleData.map(d => d.sales),
                    yAxisID: 'y-sales', borderColor: '#3b82f6', fill: true, tension: 0.3
                },
                {
                    type: 'line', label: '거래 건수', data: sampleData.map(d => d.orders),
                    yAxisID: 'y-orders', borderColor: '#f59e0b', fill: false, tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            interaction: { mode: 'index', intersect: false },
            scales: {
                'y-sales': { position: 'left', ticks: { callback: v => v / 1000 + 'k' } },
                'y-orders': { position: 'right', ticks: { callback: v => v } }
            },
            plugins: {
                legend: { position: 'top', labels: { font: { size: 12 } } }
            }
        }
    });
}

// 수익 차트
function drawProfit() {
    if (profitChart) profitChart.destroy();
    profitChart = new Chart(profitCtx, {
        type: 'bar',
        data: {
            labels: sampleData.map(d => d.date.slice(5).replace('-', '\.')),
            datasets: [{
                label: '일일 수익',
                data: sampleData.map(d => d.profit),
                backgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: { legend: { display: false } }
        }
    });
}

// 카테고리 도넛 + 리스트
function drawCategory() {
    if (categoryChart) categoryChart.destroy();
    categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: categoryData.map(c => c.category),
            datasets: [{ data: categoryData.map(c => c.value) }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.2,
            cutout: '60%',
            plugins: {
                legend: { position: 'top', labels: { font: { size: 11 } } }
            }
        }
    });
    // 리스트 생성 (비율 포함)
    const total = categoryData.reduce((a, b) => a + b.value, 0);
    categoryListEl.innerHTML = categoryData.map(c => {
        const pct = (c.value / total * 100).toFixed(1) + '%';
        return `<li>
      <span>${c.category}</span>
      <span>${c.value.toLocaleString()}원</span>
      <span>${pct}</span>
    </li>`;
    }).join('');
}

// 결제 수단 도넛 + 리스트
function drawPayment() {
    if (paymentChart) paymentChart.destroy();
    paymentChart = new Chart(paymentCtx, {
        type: 'doughnut',
        data: {
            labels: paymentData.map(p => p.method),
            datasets: [{ data: paymentData.map(p => p.value) }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.2,
            cutout: '60%',
            plugins: {
                legend: { position: 'top', labels: { font: { size: 11 } } }
            }
        }
    });
    const total = paymentData.reduce((a, b) => a + b.value, 0);
    paymentListEl.innerHTML = paymentData.map(p => {
        const pct = (p.value / total * 100).toFixed(1) + '%';
        return `<li>
      <span>${p.method}</span>
      <span>${p.value.toLocaleString()}원</span>
      <span>${pct}</span>
    </li>`;
    }).join('');
}

// 상세 테이블
function renderDetailTable() {
    detailTableBody.innerHTML = sampleData.map(d => {
        const avg = Math.round(d.sales / d.orders);
        const roi = Math.round(d.profit / d.sales * 100);
        return `<tr>
      <td>${d.date.replace(/-/g, '.')}</td>
      <td>${d.sales.toLocaleString()}원</td>
      <td>${d.orders}건</td>
      <td>${avg.toLocaleString()}원</td>
      <td>${d.profit.toLocaleString()}원</td>
      <td><span class="text-success">${roi}%</span></td>
    </tr>`;
    }).join('');
}

// 초기 렌더
document.addEventListener('DOMContentLoaded', () => {
    renderKPI();
    drawSalesOrders();
    drawProfit();
    drawCategory();
    drawPayment();
    renderDetailTable();

    // Interval 버튼 토글
    document.querySelectorAll('.interval-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.interval-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // TODO: interval에 따라 sampleData 필터링 후 다시 그리기
            drawSalesOrders();
            drawProfit();
        });
    });

    // 모바일 메뉴 토글
    document.getElementById('mobileMenuBtn')
        .addEventListener('click', () => document.getElementById('sidebar').classList.toggle('show'));
});