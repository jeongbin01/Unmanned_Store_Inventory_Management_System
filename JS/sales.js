// ───────── sales.js ─────────

// 1) 샘플 데이터 (7일치)
const sampleData = [
    { date: '2025-07-09', sales: 452000, orders: 87, profit: 153680 },
    { date: '2025-07-10', sales: 387500, orders: 74, profit: 131750 },
    { date: '2025-07-11', sales: 421000, orders: 81, profit: 143140 },
    { date: '2025-07-12', sales: 376000, orders: 72, profit: 127840 },
    { date: '2025-07-13', sales: 398500, orders: 79, profit: 135490 },
    { date: '2025-07-14', sales: 547000, orders: 105, profit: 186150 },
    { date: '2025-07-15', sales: 615000, orders: 118, profit: 209100 },
];

// 카테고리별 매출
const categoryData = [
    { category: '도시락', value: 2587000 },
    { category: '음료류', value: 1964500 },
    { category: '과자류', value: 2367000 },
    { category: '생활용품', value: 1845000 },
    { category: '기타', value: 280000 }
];

// 결제 수단별 매출
const paymentData = [
    { method: '신용카드', value: 5237500 },
    { method: '현금', value: 1547500 },
    { method: '모바일결제', value: 1984500 },
    { method: '포인트', value: 267500 }
];

// DOM 참조
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

// 날짜 범위 표시
dateRangeEl.textContent = '2025년 7월 9일 (수) - 2025년 7월 15일 (화)';

// KPI 집계
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

    // TODO: 예시용 정적 퍼센트
    kpiSalesChange.textContent = '▲7.2%';
    kpiOrdersChange.textContent = '▲3.8%';
    kpiProfitChange.textContent = '▲6.5%';
    kpiAvgOrderChange.textContent = '▲2.3%';
    kpiROIChange.textContent = '▲1.2%';
}

// Line + Bar 복합 차트 (매출/거래건수)
function renderSalesOrdersChart() {
    new Chart(salesOrdersCtx, {
        data: {
            labels: sampleData.map(d => d.date.slice(5).replace('-', '.')),
            datasets: [
                {
                    type: 'line',
                    label: '일일 매출',
                    data: sampleData.map(d => d.sales),
                    yAxisID: 'y-sales',
                    borderColor: '#3b82f6',
                    fill: true
                },
                {
                    type: 'line',
                    label: '거래 건수',
                    data: sampleData.map(d => d.orders),
                    yAxisID: 'y-orders',
                    borderColor: '#f59e0b',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                'y-sales': { position: 'left', ticks: { callback: v => v / 1000 + 'k' } },
                'y-orders': { position: 'right', ticks: { callback: v => v } }
            }
        }
    });
}

// Bar 차트 (일일 수익)
function renderProfitChart() {
    new Chart(profitCtx, {
        type: 'bar',
        data: {
            labels: sampleData.map(d => d.date.slice(5).replace('-', '.')),
            datasets: [{
                label: '일일 수익',
                data: sampleData.map(d => d.profit),
                backgroundColor: '#10b981'
            }]
        },
        options: { responsive: true }
    });
}

// Doughnut 차트 + 리스트
function renderCategoryChart() {
    new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: categoryData.map(c => c.category),
            datasets: [{ data: categoryData.map(c => c.value) }]
        },
        options: { responsive: true }
    });
    categoryListEl.innerHTML = categoryData.map(c =>
        `<li><span>${c.category}</span><span>${c.value.toLocaleString()}원</span></li>`
    ).join('');
}

function renderPaymentChart() {
    new Chart(paymentCtx, {
        type: 'doughnut',
        data: {
            labels: paymentData.map(p => p.method),
            datasets: [{ data: paymentData.map(p => p.value) }]
        },
        options: { responsive: true }
    });
    paymentListEl.innerHTML = paymentData.map(p =>
        `<li><span>${p.method}</span><span>${p.value.toLocaleString()}원</span></li>`
    ).join('');
}

// Detail Table 렌더링
function renderDetailTable() {
    detailTableBody.innerHTML = sampleData.map(d => {
        const avg = Math.round(d.sales / d.orders);
        const roi = Math.round((d.profit / d.sales) * 100);
        return `
      <tr>
        <td>${d.date.replace(/-/g, '.')}</td>
        <td>${d.sales.toLocaleString()}원</td>
        <td>${d.orders}건</td>
        <td>${avg.toLocaleString()}원</td>
        <td>${d.profit.toLocaleString()}원</td>
        <td><span class="text-success">${roi}%</span></td>
      </tr>
    `;
    }).join('');
}

// 초기 렌더링
document.addEventListener('DOMContentLoaded', () => {
    renderKPI();
    renderSalesOrdersChart();
    renderProfitChart();
    renderCategoryChart();
    renderPaymentChart();
    renderDetailTable();

    // 모바일 사이드바 토글
    const sidebar = document.getElementById('sidebar');
    const btn = document.getElementById('mobileMenuBtn');
    btn?.addEventListener('click', () => sidebar.classList.toggle('show'));
});
ㄴ