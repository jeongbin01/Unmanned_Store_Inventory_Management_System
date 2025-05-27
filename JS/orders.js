// 샘플 주문 데이터
const initialOrders = [
  {
    id: 'ORD-2025-1001',
    date: '2025-07-18 16:45',
    customer: '김철수',
    items: [
      { code: 'P1001', name: '삼성 갤럭시 S24', qty: 1, price: 1200000 },
      { code: 'P1005', name: '스프라이트 500ml', qty: 2, price: 1800 }
    ],
    status: '완료',
    payment: '신용카드 ****-****-1234'
  },
  {
    id: 'ORD-2025-1002',
    date: '2025-07-18 14:30',
    customer: '이영희',
    items: [
      { code: 'P1002', name: '애플 맥북 프로', qty: 1, price: 2500000 },
      { code: 'P1004', name: '스타벅스 텀블러', qty: 1, price: 35000 }
    ],
    status: '처리중',
    payment: '현금'
  },
  {
    id: 'ORD-2025-1003',
    date: '2025-07-17 10:15',
    customer: '박지민',
    items: [
      { code: 'P1003', name: '나이키 에어포스', qty: 2, price: 120000 },
      { code: 'P1007', name: '새우깡 중형', qty: 3, price: 1500 },
      { code: 'P1010', name: '물티슈 소형', qty: 1, price: 1200 }
    ],
    status: '접수',
    payment: '카카오페이'
  },
  {
    id: 'ORD-2025-1004',
    date: '2025-07-17 09:05',
    customer: '최유진',
    items: [
      { code: 'P1004', name: '스타벅스 텀블러', qty: 1, price: 35000 }
    ],
    status: '완료',
    payment: '신용카드 ****-****-5678'
  },
  {
    id: 'ORD-2025-1005',
    date: '2025-07-16 18:25',
    customer: '정민수',
    items: [
      { code: 'P1006', name: '펩시콜라 500ml', qty: 4, price: 1700 },
      { code: 'P1008', name: '포카칩 오리지널', qty: 2, price: 1700 }
    ],
    status: '취소',
    payment: '현금'
  },
  {
    id: 'ORD-2025-1006',
    date: '2025-07-16 12:40',
    customer: '김하늘',
    items: [
      { code: 'P1002', name: '애플 맥북 프로', qty: 1, price: 2500000 },
      { code: 'P1003', name: '나이키 에어포스', qty: 1, price: 120000 },
      { code: 'P1007', name: '새우깡 중형', qty: 2, price: 1500 },
      { code: 'P1012', name: 'AA건전지 2개입', qty: 3, price: 2500 }
    ],
    status: '완료',
    payment: '카카오페이'
  },
  {
    id: 'ORD-2025-1007',
    date: '2025-07-15 16:00',
    customer: '이태민',
    items: [
      { code: 'P1011', name: '면봉 100개입', qty: 2, price: 2000 }
    ],
    status: '처리중',
    payment: '신용카드 ****-****-9012'
  },
  {
    id: 'ORD-2025-1008',
    date: '2025-07-15 11:20',
    customer: '오승현',
    items: [
      { code: 'P1001', name: '삼성 갤럭시 S24', qty: 1, price: 1200000 },
      { code: 'P1009', name: '허니버터칩', qty: 5, price: 1800 },
      { code: 'P1010', name: '물티슈 소형', qty: 1, price: 1200 }
    ],
    status: '완료',
    payment: '현금'
  },
  {
    id: 'ORD-2025-1009',
    date: '2025-07-14 14:55',
    customer: '박소연',
    items: [
      { code: 'P1005', name: '스프라이트 500ml', qty: 3, price: 1800 },
      { code: 'P1008', name: '포카칩 오리지널', qty: 1, price: 1700 }
    ],
    status: '접수',
    payment: '카카오페이'
  },
  {
    id: 'ORD-2025-1010',
    date: '2025-07-14 09:10',
    customer: '장우진',
    items: [
      { code: 'P1002', name: '애플 맥북 프로', qty: 1, price: 2500000 },
      { code: 'P1006', name: '펩시콜라 500ml', qty: 2, price: 1700 },
      { code: 'P1010', name: '물티슈 소형', qty: 2, price: 1200 }
    ],
    status: '완료',
    payment: '신용카드 ****-****-3456'
  }

  // 추가 주문들
];

let orders = [...initialOrders];
let filteredOrders = [...orders];

// DOM 참조
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const ordersTableBody = document.getElementById('ordersTableBody');

// 모달 관련
const orderModal = document.getElementById('orderModal');
const closeOrderModal = document.getElementById('closeOrderModal');
const modalOrderId = document.getElementById('modalOrderId');
const modalOrderDate = document.getElementById('modalOrderDate');
const modalOrderStatus = document.getElementById('modalOrderStatus');
const modalCustomerName = document.getElementById('modalCustomerName');
const modalItemsBody = document.getElementById('modalItemsBody');
const modalTotalPrice = document.getElementById('modalTotalPrice');
const modalPaymentInfo = document.getElementById('modalPaymentInfo');
const modalStatusSelect = document.getElementById('modalStatusSelect');
const modalUpdateBtn = document.getElementById('modalUpdateBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// 테이블 렌더링
function renderOrders() {
  if (filteredOrders.length === 0) {
    ordersTableBody.innerHTML = `
      <tr><td colspan="7" class="text-center py-5">주문이 없습니다.</td></tr>
    `;
    return;
  }

  ordersTableBody.innerHTML = filteredOrders.map(o => {
    const itemCount = o.items.reduce((sum, i) => sum + i.qty, 0);
    const total = o.items.reduce((sum, i) => sum + i.qty * i.price, 0)
      .toLocaleString() + '원';
    return `
      <tr>
        <td>${o.id}</td>
        <td>${o.date}</td>
        <td>${o.customer}</td>
        <td>${itemCount}개</td>
        <td>${total}</td>
        <td><span class="badge status-${o.status}">${o.status}</span></td>
        <td>
          <button class="action-btn view-btn" onclick="openOrderModal('${o.id}')">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 필터링
function filterOrders() {
  const term = searchInput.value.toLowerCase();
  const status = statusFilter.value;
  filteredOrders = orders.filter(o => {
    const matchText = o.id.toLowerCase().includes(term)
      || o.customer.toLowerCase().includes(term);
    const matchStatus = status === '전체' || o.status === status;
    return matchText && matchStatus;
  });
  renderOrders();
}

// 모달 열기
function openOrderModal(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  modalOrderId.textContent = o.id;
  modalOrderDate.textContent = o.date;
  modalCustomerName.textContent = o.customer;
  modalPaymentInfo.textContent = o.payment;
  modalOrderStatus.textContent = o.status;
  modalOrderStatus.className = `badge status-${o.status}`;

  // 상품 목록
  modalItemsBody.innerHTML = o.items.map(item => {
    const subtotal = (item.qty * item.price).toLocaleString() + '원';
    return `
      <tr>
        <td>${item.code}</td>
        <td>${item.name}</td>
        <td>${item.qty}개</td>
        <td>${subtotal}</td>
      </tr>
    `;
  }).join('');
  // 총액
  const total = o.items.reduce((sum, i) => sum + i.qty * i.price, 0)
    .toLocaleString() + '원';
  modalTotalPrice.textContent = total;

  // 상태 선택
  modalStatusSelect.value = o.status;

  orderModal.classList.add('show');
}

// 모달 닫기
function closeModal() {
  orderModal.classList.remove('show');
}

// 상태 업데이트
function updateStatus() {
  const newStatus = modalStatusSelect.value;
  const id = modalOrderId.textContent;
  const o = orders.find(x => x.id === id);
  if (o) {
    o.status = newStatus;
    filterOrders();
    closeModal();
  }
}

// 이벤트 리스너
document.addEventListener('DOMContentLoaded', () => {
  renderOrders();
  searchInput.addEventListener('input', filterOrders);
  statusFilter.addEventListener('change', filterOrders);

  closeOrderModal.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);
  modalUpdateBtn.addEventListener('click', updateStatus);

  orderModal.addEventListener('click', e => {
    if (e.target === orderModal) closeModal();
  });
});

// 전역 호출 허용
window.openOrderModal = openOrderModal;
