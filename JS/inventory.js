// inventory.js
'use strict';

// -------------------- 샘플 데이터 --------------------
const inventory = [
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
const transactions = [
    { date: '2025-05-28 16:45', name: '삼각김밥 참치', type: '출고', qty: 3, note: '판매' },
    { date: '2025-05-28 15:20', name: '코카콜라 500ml', type: '출고', qty: 2, note: '판매' },
    { date: '2025-05-28 14:00', name: '새우깡 중형', type: '입고', qty: 24, note: '입고' },
    { date: '2025-05-28 11:30', name: '삼각김밥 김치', type: '출고', qty: 1, note: '판매' },
    { date: '2025-05-27 16:50', name: '물티슈 소형', type: '입고', qty: 12, note: '입고' }
];

let filteredInventory = [...inventory],
    categoryChart, statusChart,
    currentProduct = null;

// 현재 시각 가져오기
function now() {
    return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

// 재고 상태 판정
function statusOf(item) {
    if (item.stock === 0) return '품절';
    if (item.stock < item.reorder) return '부족';
    return '충분';
}

// KPI 업데이트
function updateKPIs() {
    document.getElementById('lowStockCount').textContent =
        `${inventory.filter(i => i.stock > 0 && i.stock < i.reorder).length}건`;
    document.getElementById('outStockCount').textContent =
        `${inventory.filter(i => i.stock === 0).length}건`;
}

// Chart.js 초기화
function initCharts() {
    // 카테고리별 바 차트
    const ctx1 = document.getElementById('categoryChart').getContext('2d');
    const byCat = {};
    inventory.forEach(i => byCat[i.category] = (byCat[i.category] || 0) + i.stock);
    if (categoryChart) categoryChart.destroy();
    categoryChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: Object.keys(byCat),
            datasets: [{
                data: Object.values(byCat),
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                borderRadius: 8
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });

    // 상태 도넛 차트
    const ctx2 = document.getElementById('statusChart').getContext('2d');
    const cnt = { 충분: 0, 부족: 0, 품절: 0 };
    inventory.forEach(i => cnt[statusOf(i)]++);
    if (statusChart) statusChart.destroy();
    statusChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['충분', '부족', '품절'],
            datasets: [{
                data: Object.values(cnt),
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { padding: 20 } } }
        }
    });
}

// 재고 테이블 렌더링
function renderInventory() {
    const tbody = document.getElementById('inventoryTable');
    tbody.innerHTML = '';
    filteredInventory.forEach(i => {
        const st = statusOf(i);
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${i.code}</td>
      <td>${i.name}</td>
      <td>${i.category}</td>
      <td><span class="status-badge ${st}">${st}</span> ${i.stock}개</td>
      <td>${i.reorder}개</td>
      <td>
        <button class="btn btn-success btn-sm" onclick="openIn('${i.code}')">
          <i class="fas fa-plus"></i> 입고
        </button>
        <button class="btn btn-danger btn-sm" onclick="openOut('${i.code}')" ${i.stock === 0 ? 'disabled' : ''}>
          <i class="fas fa-minus"></i> 출고
        </button>
      </td>`;
        tbody.appendChild(tr);
    });
}

// 트랜잭션 테이블 렌더링
function renderTransactions() {
    const tbody = document.getElementById('transactionsTable');
    tbody.innerHTML = '';
    transactions.slice(0, 10).forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${t.date}</td>
      <td>${t.name}</td>
      <td><span class="status-badge ${t.type}">${t.type}</span></td>
      <td>${t.qty}개</td>
      <td>${t.note}</td>`;
        tbody.appendChild(tr);
    });
}

// 검색·필터링
function filterInv() {
    const s = document.getElementById('invSearchInput').value.toLowerCase();
    const c = document.getElementById('invCategoryFilter').value;
    const st = document.getElementById('invStateFilter').value;
    filteredInventory = inventory.filter(i =>
        (i.name.toLowerCase().includes(s) || i.code.toLowerCase().includes(s)) &&
        (c === '전체' || i.category === c) &&
        (st === '전체' || statusOf(i) === st)
    );
    renderInventory();
}

// 입고·출고 모달 열기
function openIn(code) {
    currentProduct = inventory.find(i => i.code === code);
    document.getElementById('stockInProduct').value = currentProduct.name;
    document.getElementById('stockInCurrent').value = `${currentProduct.stock}개`;
    document.getElementById('stockInQty').value = '';
    document.getElementById('stockInNote').value = '';
    updateInPreview();
    new bootstrap.Modal('#stockInModal').show();
}
function openOut(code) {
    currentProduct = inventory.find(i => i.code === code);
    document.getElementById('stockOutProduct').value = currentProduct.name;
    document.getElementById('stockOutCurrent').value = `${currentProduct.stock}개`;
    document.getElementById('stockOutQty').value = '';
    document.getElementById('stockOutNote').value = '';
    updateOutPreview();
    new bootstrap.Modal('#stockOutModal').show();
}

// 실시간 프리뷰 업데이트
function updateInPreview() {
    const cur = currentProduct.stock;
    const q = parseInt(document.getElementById('stockInQty').value) || 0;
    document.getElementById('inPreviewCurrent').textContent = `${cur}개`;
    document.getElementById('inPreviewQty').textContent = `+${q}개`;
    document.getElementById('inPreviewExpected').textContent = `${cur + q}개`;
}
function updateOutPreview() {
    const cur = currentProduct.stock;
    const q = parseInt(document.getElementById('stockOutQty').value) || 0;
    document.getElementById('outPreviewCurrent').textContent = `${cur}개`;
    document.getElementById('outPreviewQty').textContent = `-${q}개`;
    document.getElementById('outPreviewExpected').textContent = `${Math.max(cur - q, 0)}개`;
}

// 입고·출고 처리
function processStockIn() {
    const qty = parseInt(document.getElementById('stockInQty').value);
    const note = document.getElementById('stockInNote').value || '입고';
    if (!qty || qty <= 0) return alert('수량을 확인해주세요');
    currentProduct.stock += qty;
    transactions.unshift({ date: now(), name: currentProduct.name, type: '입고', qty, note });
    updateAll();
    bootstrap.Modal.getInstance(document.getElementById('stockInModal')).hide();
}
function processStockOut() {
    const qty = parseInt(document.getElementById('stockOutQty').value);
    const note = document.getElementById('stockOutNote').value || '출고';
    if (!qty || qty <= 0) return alert('수량을 확인해주세요');
    if (qty > currentProduct.stock) return alert('재고가 부족합니다');
    currentProduct.stock -= qty;
    transactions.unshift({ date: now(), name: currentProduct.name, type: '출고', qty, note });
    updateAll();
    bootstrap.Modal.getInstance(document.getElementById('stockOutModal')).hide();
}

// 전체 업데이트
function updateAll() {
    updateKPIs();
    initCharts();
    filterInv();
    renderTransactions();
}

// 모바일 메뉴 토글
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebarOverlay').classList.toggle('active');
}

// 초기 바인딩
document.addEventListener('DOMContentLoaded', () => {
    updateAll();
    document.getElementById('invSearchInput').addEventListener('input', filterInv);
    document.getElementById('invCategoryFilter').addEventListener('change', filterInv);
    document.getElementById('invStateFilter').addEventListener('change', filterInv);
    document.getElementById('confirmStockIn').addEventListener('click', processStockIn);
    document.getElementById('confirmStockOut').addEventListener('click', processStockOut);
    document.getElementById('stockInQty').addEventListener('input', updateInPreview);
    document.getElementById('stockOutQty').addEventListener('input', updateOutPreview);
    document.getElementById('mobileMenuBtn').addEventListener('click', toggleMenu);
    document.getElementById('sidebarOverlay').addEventListener('click', toggleMenu);
});
