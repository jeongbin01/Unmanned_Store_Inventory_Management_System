// JS/Orders.js

// 1) 상품 카탈로그 정의 (코드, 이름, 가격)
const productCatalog = [
  { code: 'P1001', name: '삼성 갤럭시 S24', price: 1200000 },
  { code: 'P1002', name: '애플 맥북 프로', price: 2500000 },
  { code: 'P1003', name: '나이키 에어포스 1', price: 120000 },
  { code: 'P1004', name: '스타벅스 텀블러', price: 35000 },
  { code: 'P1005', name: '무선 이어폰', price: 180000 },
  { code: 'P1006', name: '펩시콜라 500ml', price: 1700 },
  { code: 'P1007', name: '새우깡 중형', price: 1500 },
  { code: 'P1008', name: '포카칩 오리지널', price: 1700 },
  { code: 'P1009', name: '허니버터칩', price: 1800 },
  { code: 'P1010', name: '물티슈 소형', price: 1200 },
  { code: 'P1011', name: '면봉 100개입', price: 2000 },
  { code: 'P1012', name: 'AA 건전지 2개입', price: 2500 }
];

// 2) 기타 랜덤용 데이터 풀
const statuses = ['접수', '처리중', '완료', '취소'];
const customers = ['김철수', '이영희', '박지민', '최유진', '정민수', '김하늘', '이태민', '오승현', '박소연', '장우진'];
const payments = ['신용카드', '현금', '카카오페이', '네이버페이'];

// 3) 유틸리티
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 4) 랜덤 주문 생성 함수
function generateRandomOrder() {
  const itemCount = getRandomInt(1, 4);
  const items = [];
  for (let i = 0; i < itemCount; i++) {
    const prod = productCatalog[getRandomInt(0, productCatalog.length - 1)];
    const qty = getRandomInt(1, 3);
    items.push({ code: prod.code, name: prod.name, qty, price: prod.price });
  }

  const d = new Date();
  d.setFullYear(2025);
  d.setMonth(getRandomInt(0, 11));
  d.setDate(getRandomInt(1, 28));
  d.setHours(getRandomInt(0, 23), getRandomInt(0, 59));

  const total = items.reduce((sum, it) => sum + it.qty * it.price, 0);
  return {
    id: `ORD-2025-${getRandomInt(1000, 9999)}`,
    date: d.toISOString().slice(0, 16).replace('T', ' '),
    customer: customers[getRandomInt(0, customers.length - 1)],
    items,
    status: statuses[getRandomInt(0, statuses.length - 1)],
    payment: `${payments[getRandomInt(0, payments.length - 1)]} ****-****-${getRandomInt(1000, 9999)}`,
    totalPrice: total.toLocaleString() + '원'
  };
}

// 5) 랜덤 10개 주문 생성
const initialOrders = Array.from({ length: 10 }, () => generateRandomOrder());

// 6) 데이터 참조
let orders = [...initialOrders];
let filteredOrders = [...orders];

// 7) DOM 참조
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const ordersTableBody = document.getElementById('ordersTableBody');
const exportBtn = document.getElementById('exportBtn');

const orderModal = document.getElementById('orderModal');
const closeOrderModal = document.getElementById('closeOrderModal');
const modalOrderId = document.getElementById('modalOrderId');
const modalOrderDate = document.getElementById('modalOrderDate');
const modalOrderStatus = document.getElementById('modalOrderStatus');
const modalCustomer = document.getElementById('modalCustomerName');
const modalItemsBody = document.getElementById('modalItemsBody');
const modalTotalPrice = document.getElementById('modalTotalPrice');
const modalPayment = document.getElementById('modalPaymentInfo');
const modalStatusSel = document.getElementById('modalStatusSelect');
const modalUpdateBtn = document.getElementById('modalUpdateBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// 8) 테이블 렌더링
function renderOrders() {
  if (!filteredOrders.length) {
    ordersTableBody.innerHTML = '<tr><td colspan="7" class="text-center py-5">주문이 없습니다.</td></tr>';
    return;
  }
  ordersTableBody.innerHTML = filteredOrders.map(o => {
    const cnt = o.items.reduce((s, i) => s + i.qty, 0);
    return `
      <tr>
        <td>${o.id}</td>
        <td>${o.date}</td>
        <td>${o.customer}</td>
        <td>${cnt}개</td>
        <td>${o.totalPrice}</td>
        <td><span class="badge status-${o.status}">${o.status}</span></td>
        <td>
          <button class="action-btn view-btn" onclick="openOrderModal('${o.id}')">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>`;
  }).join('');
}

// 9) 필터링
function filterOrders() {
  const term = searchInput.value.toLowerCase();
  const st = statusFilter.value;
  filteredOrders = orders.filter(o => {
    const t1 = o.id.toLowerCase().includes(term) || o.customer.toLowerCase().includes(term);
    const t2 = st === '전체' || o.status === st;
    return t1 && t2;
  });
  renderOrders();
}

// 10) 모달 열기
function openOrderModal(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  modalOrderId.textContent = o.id;
  modalOrderDate.textContent = o.date;
  modalCustomer.textContent = o.customer;
  modalPayment.textContent = o.payment;
  modalOrderStatus.textContent = o.status;
  modalOrderStatus.className = `badge status-${o.status}`;

  modalItemsBody.innerHTML = o.items.map(it => {
    const sub = (it.qty * it.price).toLocaleString() + '원';
    return `<tr>
      <td>${it.code}</td>
      <td>${it.name}</td>
      <td>${it.qty}개</td>
      <td>${sub}</td>
    </tr>`;
  }).join('');

  modalTotalPrice.textContent = o.totalPrice;
  modalStatusSel.value = o.status;
  orderModal.classList.add('show');
}

// 11) 모달 닫기 & 상태 변경
function closeModal() { orderModal.classList.remove('show'); }
function updateStatus() {
  const newSt = modalStatusSel.value;
  const o = orders.find(x => x.id === modalOrderId.textContent);
  if (o) { o.status = newSt; filterOrders(); closeModal(); }
}

// 12) CSV 내보내기
function exportCSV() {
  const rows = ['주문번호,주문일시,고객명,상품수,총액,상태'];
  orders.forEach(o => {
    const cnt = o.items.reduce((s, i) => s + i.qty, 0);
    const total = o.items.reduce((s, i) => s + i.qty * i.price, 0);
    rows.push([o.id, `"${o.date}"`, `"${o.customer}"`, cnt, total, o.status].join(','));
  });
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'orders_export.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 13) 이벤트 바인딩
document.addEventListener('DOMContentLoaded', () => {
  renderOrders();
  searchInput.addEventListener('input', filterOrders);
  statusFilter.addEventListener('change', filterOrders);
  closeOrderModal.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);
  modalUpdateBtn.addEventListener('click', updateStatus);
  orderModal.addEventListener('click', e => e.target === orderModal && closeModal());
  exportBtn.addEventListener('click', exportCSV);
});

// 14) 전역 노출
window.openOrderModal = openOrderModal;
