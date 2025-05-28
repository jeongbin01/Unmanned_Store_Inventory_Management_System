'use strict';

// -------------------- 샘플 데이터 (10개) --------------------
const inventory = [
    { code: 'P001', name: '삼성 갤럭시 S24', category: '전자제품', stock: 15, reorder: 10 },
    { code: 'P002', name: '애플 맥북 프로', category: '전자제품', stock: 8, reorder: 5 },
    { code: 'P003', name: '무선 이어폰', category: '전자제품', stock: 3, reorder: 5 },
    { code: 'P004', name: '나이키 에어포스', category: '의류/신발', stock: 25, reorder: 10 },
    { code: 'P005', name: '데상트 스니커즈', category: '의류/신발', stock: 7, reorder: 10 },
    { code: 'P006', name: '물티슈 100매', category: '생활용품', stock: 20, reorder: 15 },
    { code: 'P007', name: '스타벅스 텀블러', category: '생활용품', stock: 0, reorder: 5 },
    { code: 'P008', name: '모나미 볼펜', category: '도서/문구', stock: 50, reorder: 30 },
    { code: 'P009', name: '노트 A5', category: '도서/문구', stock: 30, reorder: 20 },
    { code: 'P010', name: '코카콜라 500ml', category: '식품/음료', stock: 40, reorder: 30 }
];

const transactions = [
    { date: '2025-05-28 10:00', name: '삼성 갤럭시 S24', type: '출고', qty: 1, note: '판매' },
    { date: '2025-05-28 11:30', name: '무선 이어폰', type: '입고', qty: 5, note: '입고' },
    { date: '2025-05-28 12:00', name: '코카콜라 500ml', type: '출고', qty: 3, note: '판매' },
    { date: '2025-05-27 15:45', name: '모나미 볼펜', type: '입고', qty: 20, note: '입고' },
    { date: '2025-05-27 16:00', name: '스타벅스 텀블러', type: '출고', qty: 1, note: '판매' }
];

let filteredInventory = [...inventory],
    categoryChart, statusChart,
    currentProduct = null;

// 현재 시각
function now() {
    return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

// 재고 상태 판정
function statusOf(item) {
    if (item.stock === 0) return '품절';
    else if (item.stock < item.reorder) return '부족';
    else return '충분';
}

// KPI 업데이트
function updateKPIs() {
    document.getElementById('lowStockCount').textContent =
        `${inventory.filter(i => i.stock > 0 && i.stock < i.reorder).length}건`;
    document.getElementById('outStockCount').textContent =
        `${inventory.filter(i => i.stock === 0).length}건`;
}

// 차트 초기화
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
            scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } },
            plugins: { legend: { display: false } }
        }
    });

    // 재고 상태 도넛 차트
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

// 카테고리 필터 동적 생성
function populateCategoryFilter() {
    const sel = document.getElementById('invCategoryFilter');
    sel.innerHTML = '<option value="전체">모든 카테고리</option>';
    [...new Set(inventory.map(i => i.category))].forEach(cat => {
        const o = document.createElement('option');
        o.value = cat; o.textContent = cat;
        sel.appendChild(o);
    });
}

// 테이블 렌더링
function renderInventory() {
    const tbody = document.getElementById('inventoryTable');
    tbody.innerHTML = filteredInventory.map(i => {
        const st = statusOf(i);
        return `
      <tr>
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
        </td>
      </tr>`;
    }).join('');
}

// 트랜잭션 렌더링
function renderTransactions() {
    const tbody = document.getElementById('transactionsTable');
    tbody.innerHTML = transactions.slice(0, 10).map(t => {
        return `
      <tr>
        <td>${t.date}</td>
        <td>${t.name}</td>
        <td><span class="status-badge ${t.type}">${t.type}</span></td>
        <td>${t.qty}개</td>
        <td>${t.note}</td>
      </tr>`;
    }).join('');
}

// 필터링
function filterInv() {
    const kw = document.getElementById('invSearchInput').value.toLowerCase();
    const cat = document.getElementById('invCategoryFilter').value;
    const st = document.getElementById('invStateFilter').value;
    filteredInventory = inventory.filter(i => {
        return (i.name.toLowerCase().includes(kw) || i.code.toLowerCase().includes(kw))
            && (cat === '전체' || i.category === cat)
            && (st === '전체' || statusOf(i) === st);
    });
    renderInventory();
}

// 모달 열기
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

// 프리뷰 업데이트
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

// 입고/출고 처리
function processStockIn() {
    const q = parseInt(document.getElementById('stockInQty').value);
    if (!q || q <= 0) return alert('수량을 확인해주세요');
    currentProduct.stock += q;
    transactions.unshift({ date: now(), name: currentProduct.name, type: '입고', qty: q, note: document.getElementById('stockInNote').value || '입고' });
    updateAll();
    bootstrap.Modal.getInstance(document.getElementById('stockInModal')).hide();
}
function processStockOut() {
    const q = parseInt(document.getElementById('stockOutQty').value);
    if (!q || q <= 0) return alert('수량을 확인해주세요');
    if (q > currentProduct.stock) return alert('재고가 부족합니다');
    currentProduct.stock -= q;
    transactions.unshift({ date: now(), name: currentProduct.name, type: '출고', qty: q, note: document.getElementById('stockOutNote').value || '출고' });
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
    populateCategoryFilter();
    updateAll();

    document.getElementById('invSearchInput').addEventListener('input', filterInv);
    document.getElementById('invCategoryFilter').addEventListener('change', filterInv);
    document.getElementById('invStateFilter').addEventListener('change', filterInv);

    document.getElementById('stockInQty').addEventListener('input', updateInPreview);
    document.getElementById('stockOutQty').addEventListener('input', updateOutPreview);
    document.getElementById('confirmStockIn').addEventListener('click', processStockIn);
    document.getElementById('confirmStockOut').addEventListener('click', processStockOut);

    document.getElementById('mobileMenuBtn').addEventListener('click', toggleMenu);
    document.getElementById('sidebarOverlay').addEventListener('click', toggleMenu);
});
