// ───────── Inventory.js ─────────

// 샘플 재고 데이터
const initialInventory = [
    { code: 'P1001', name: '삼각김밥 참치', category: '도시락', stock: 24, reorder: 10 },
    { code: 'P1002', name: '삼각김밥 김치', category: '도시락', stock: 18, reorder: 10 },
    { code: 'P1003', name: '도시락 김치볶음밥', category: '도시락', stock: 12, reorder: 8 },
    { code: 'P1004', name: '코카콜라 500ml', category: '음료류', stock: 36, reorder: 15 },
    { code: 'P1005', name: '스프라이트 500ml', category: '음료류', stock: 28, reorder: 15 },
    { code: 'P1006', name: '펩시콜라 500ml', category: '음료류', stock: 0, reorder: 15 },
    { code: 'P1007', name: '새우깡 중형', category: '과자류', stock: 42, reorder: 20 },
    { code: 'P1008', name: '포카칩 오리지널', category: '과자류', stock: 5, reorder: 12 },
    { code: 'P1009', name: '허니버터칩', category: '과자류', stock: 0, reorder: 12 },
    { code: 'P1010', name: '물티슈 소형', category: '생활용품', stock: 15, reorder: 8 },
    { code: 'P1011', name: '면봉 100개입', category: '생활용품', stock: 8, reorder: 5 },
    { code: 'P1012', name: 'AA건전지 2개입', category: '생활용품', stock: 20, reorder: 10 }
];

// 샘플 입출고 내역
const initialTransactions = [
    { date: '2025-07-18 16:45', name: '삼각김밥 참치', type: '출고', qty: 3, note: '판매' },
    { date: '2025-07-18 15:20', name: '코카콜라 500ml', type: '출고', qty: 2, note: '판매' },
    { date: '2025-07-18 14:00', name: '새우깡 중형', type: '입고', qty: 24, note: '입고' },
    { date: '2025-07-18 11:30', name: '삼각김밥 김치', type: '출고', qty: 1, note: '판매' },
    { date: '2025-07-17 16:50', name: '물티슈 소형', type: '입고', qty: 12, note: '입고' }
];

let inventory = [...initialInventory];

// 차트 초기화
function initCharts() {
    // 카테고리별 재고
    const ctxCat = document.getElementById('categoryChart').getContext('2d');
    const byCat = inventory.reduce((acc, i) => {
        acc[i.category] = (acc[i.category] || 0) + i.stock;
        return acc;
    }, {});
    new Chart(ctxCat, {
        type: 'bar',
        data: {
            labels: Object.keys(byCat),
            datasets: [{ label: '재고수량', data: Object.values(byCat), backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'] }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });

    // 재고 상태 도넛
    const ctxSt = document.getElementById('statusChart').getContext('2d');
    const cnts = { 충분: 0, 부족: 0, 품절: 0 };
    inventory.forEach(i => i.stock === 0 ? cnts['품절']++ : (i.stock < i.reorder ? cnts['부족']++ : cnts['충분']++));
    new Chart(ctxSt, {
        type: 'doughnut',
        data: {
            labels: ['충분', '부족', '품절'],
            datasets: [{ data: Object.values(cnts), backgroundColor: ['#10b981', '#f59e0b', '#ef4444'] }]
        },
        options: { responsive: true }
    });

    // KPI 숫자
    document.getElementById('lowStockCount').textContent = cnts['부족'] + '건';
    document.getElementById('outStockCount').textContent = cnts['품절'] + '건';
}

// 재고 테이블 렌더링
function renderInventory() {
    const tbody = document.getElementById('inventoryTable');
    tbody.innerHTML = '';
    inventory.forEach(i => {
        let state = i.stock === 0 ? 'cancelled' : (i.stock < i.reorder ? 'pending' : 'completed');
        let txt = i.stock === 0 ? '품절' : (i.stock < i.reorder ? '부족' : '충분');

        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${i.code}</td>
      <td>${i.name}</td>
      <td>${i.category}</td>
      <td><span class="status-badge ${state}">${txt}</span> ${i.stock}개</td>
      <td>${i.reorder}개</td>
      <td>
        <button class="action-btn view-btn"><i class="fas fa-download"></i>입고</button>
        <button class="action-btn view-btn"><i class="fas fa-upload"></i>출고</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

// 입출고 내역 렌더링
function renderTransactions() {
    const tb = document.getElementById('transactionsTable');
    tb.innerHTML = '';
    initialTransactions.forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${t.date}</td>
      <td>${t.name}</td>
      <td><span class="status-badge ${t.type === '입고' ? 'completed' : 'cancelled'}">${t.type}</span></td>
      <td>${t.qty}개</td>
      <td>${t.note}</td>
    `;
        tb.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    renderInventory();
    renderTransactions();
});
