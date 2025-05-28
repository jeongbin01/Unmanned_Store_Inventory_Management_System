'use strict';

// 1) 상품 카탈로그
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

// 2) 상태·고객·결제 데이터
const statuses = ['접수', '처리중', '완료', '취소'];
const customers = ['김철수', '이영희', '박지민', '최유진', '정민수', '김하늘', '이태민', '오승현', '박소연', '장우진'];
const payments = ['신용카드', '현금', '카카오페이', '네이버페이'];

// 3) 랜덤 유틸
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 4) 랜덤 주문 생성
function generateRandomOrder() {
  const items = [];
  const itemCount = getRandomInt(1, 4);

  for (let i = 0; i < itemCount; i++) {
    const p = productCatalog[getRandomInt(0, productCatalog.length - 1)];
    const qty = getRandomInt(1, 3);
    items.push({
      code: p.code,
      name: p.name,
      qty: qty,
      price: p.price
    });
  }

  const d = new Date();
  d.setFullYear(2025);
  d.setMonth(getRandomInt(0, 11));
  d.setDate(getRandomInt(1, 28));
  d.setHours(getRandomInt(0, 23), getRandomInt(0, 59));

  const total = items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  return {
    id: `ORD-2025-${getRandomInt(1000, 9999)}`,
    date: d.toISOString().slice(0, 16).replace('T', ' '),
    customer: customers[getRandomInt(0, customers.length - 1)],
    items: items,
    status: statuses[getRandomInt(0, statuses.length - 1)],
    payment: `${payments[getRandomInt(0, payments.length - 1)]} ****-****-${getRandomInt(1000, 9999)}`,
    totalPrice: total.toLocaleString() + '원'
  };
}

// 5) 초기 주문 데이터 생성
const initialOrders = Array.from({ length: 20 }, generateRandomOrder);
let orders = initialOrders.slice();
let filteredOrders = orders.slice();
let currentSort = { field: null, direction: 'asc' };

// 6) DOM 참조
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const ordersTableBody = document.getElementById('ordersTableBody');
const exportBtn = document.getElementById('exportBtn');
const selectAllBtn = document.getElementById('selectAll');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');

// 모달 관련
const orderModal = document.getElementById('orderModal');
const closeOrderModal = document.getElementById('closeOrderModal');
const modalOrderId = document.getElementById('modalOrderId');
const modalOrderDate = document.getElementById('modalOrderDate');
const modalOrderStatus = document.getElementById('modalOrderStatus');
const modalCustomer = document.getElementById('modalCustomerName');
const modalItemsBody = document.getElementById('modalItemsBody');
const modalTotalPrice = document.getElementById('modalTotalPrice');
const modalPayment = document.getElementById('modalPaymentInfo');
const modalStatusSelect = document.getElementById('modalStatusSelect');
const modalUpdateBtn = document.getElementById('modalUpdateBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// 7) 테이블 렌더링
function renderOrders() {
  if (!filteredOrders.length) {
    ordersTableBody.innerHTML =
      '<tr><td colspan="8" class="text-center py-5 text-muted">주문이 없습니다.</td></tr>';
    return;
  }

  ordersTableBody.innerHTML = filteredOrders.map(order => {
    const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
    return `
          <tr>
            <td><input type="checkbox" class="order-checkbox" data-id="${order.id}"></td>
            <td class="fw-medium">${order.id}</td>
            <td>${order.date}</td>
            <td>${order.customer}</td>
            <td>${itemCount}개</td>
            <td class="fw-medium">${order.totalPrice}</td>
            <td><span class="badge status-${order.status}">${order.status}</span></td>
            <td>
              <button class="action-btn view-btn" onclick="openOrderModal('${order.id}')" title="상세보기">
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>
        `;
  }).join('');
}

// 8) 필터링
function filterOrders() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const statusValue = statusFilter.value;

  filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm) ||
      order.customer.toLowerCase().includes(searchTerm);
    const matchesStatus = statusValue === '전체' || order.status === statusValue;

    return matchesSearch && matchesStatus;
  });

  applySorting();
  renderOrders();
}

// 9) 정렬 기능
function sortOrders(field) {
  if (currentSort.field === field) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.field = field;
    currentSort.direction = 'asc';
  }

  applySorting();
  renderOrders();
  updateSortIcons();
}

function applySorting() {
  if (!currentSort.field) return;

  filteredOrders.sort((a, b) => {
    let valueA, valueB;

    switch (currentSort.field) {
      case 'id':
        valueA = a.id;
        valueB = b.id;
        break;
      case 'date':
        valueA = new Date(a.date);
        valueB = new Date(b.date);
        break;
      case 'customer':
        valueA = a.customer;
        valueB = b.customer;
        break;
      case 'count':
        valueA = a.items.reduce((sum, item) => sum + item.qty, 0);
        valueB = b.items.reduce((sum, item) => sum + item.qty, 0);
        break;
      case 'total':
        valueA = a.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
        valueB = b.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
        break;
      case 'status':
        valueA = a.status;
        valueB = b.status;
        break;
      default:
        return 0;
    }

    if (valueA < valueB) return currentSort.direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return currentSort.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function updateSortIcons() {
  // 모든 정렬 아이콘 초기화
  document.querySelectorAll('th[data-sort] i').forEach(icon => {
    icon.className = 'fas fa-sort';
  });

  // 현재 정렬 필드 아이콘 업데이트
  if (currentSort.field) {
    const currentHeader = document.querySelector(`th[data-sort="${currentSort.field}"] i`);
    if (currentHeader) {
      currentHeader.className = currentSort.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
  }
}

// 10) 모달 열기
function openOrderModal(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  modalOrderId.textContent = order.id;
  modalOrderDate.textContent = order.date;
  modalCustomer.textContent = order.customer;
  modalPayment.textContent = order.payment;
  modalOrderStatus.textContent = order.status;
  modalOrderStatus.className = `badge status-${order.status}`;

  modalItemsBody.innerHTML = order.items.map(item => {
    const subtotal = (item.qty * item.price).toLocaleString() + '원';
    return `
          <tr>
            <td class="fw-medium">${item.code}</td>
            <td>${item.name}</td>
            <td>${item.qty}개</td>
            <td class="fw-medium">${subtotal}</td>
          </tr>
        `;
  }).join('');

  modalTotalPrice.textContent = order.totalPrice;
  modalStatusSelect.value = order.status;
  orderModal.classList.add('show');
}

// 11) 모달 닫기
function closeModal() {
  orderModal.classList.remove('show');
}

// 12) 상태 변경
function updateOrderStatus() {
  const newStatus = modalStatusSelect.value;
  const orderId = modalOrderId.textContent;
  const order = orders.find(o => o.id === orderId);

  if (order) {
    order.status = newStatus;
    filterOrders(); // 테이블 업데이트
    closeModal();

    // 성공 메시지 (간단한 알림)
    showNotification(`주문 ${orderId}의 상태가 '${newStatus}'로 변경되었습니다.`);
  }
}

// 13) 알림 표시
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'alert alert-success position-fixed';
  notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  notification.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
      `;

  document.body.appendChild(notification);

  // 3초 후 자동 제거
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 3000);
}

// 14) CSV 내보내기
function exportCSV() {
  const headers = ['주문번호', '주문일시', '고객명', '상품수', '총액', '상태'];
  const rows = [headers.join(',')];

  orders.forEach(order => {
    const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
    const totalAmount = order.items.reduce((sum, item) => sum + (item.qty * item.price), 0);

    const row = [
      order.id,
      `"${order.date}"`,
      `"${order.customer}"`,
      itemCount,
      totalAmount,
      order.status
    ];

    rows.push(row.join(','));
  });

  const csvContent = rows.join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `orders_export_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showNotification('CSV 파일이 다운로드되었습니다.');
}

// 15) 전체 선택/해제
function handleSelectAll() {
  const checkboxes = document.querySelectorAll('.order-checkbox');
  const isChecked = selectAllBtn.checked;

  checkboxes.forEach(checkbox => {
    checkbox.checked = isChecked;
  });
}

// 16) 모바일 메뉴 토글
function toggleMobileMenu() {
  sidebar.classList.toggle('show');
}

// 17) 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function () {
  // 초기 렌더링
  renderOrders();

  // 검색 및 필터링
  searchInput.addEventListener('input', filterOrders);
  statusFilter.addEventListener('change', filterOrders);

  // 정렬 이벤트
  document.querySelectorAll('th[data-sort]').forEach(header => {
    header.addEventListener('click', function () {
      const field = this.getAttribute('data-sort');
      sortOrders(field);
    });
  });

  // 전체 선택
  selectAllBtn.addEventListener('change', handleSelectAll);

  // 모달 이벤트
  closeOrderModal.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);
  modalUpdateBtn.addEventListener('click', updateOrderStatus);

  // 모달 외부 클릭 시 닫기
  orderModal.addEventListener('click', function (e) {
    if (e.target === orderModal) {
      closeModal();
    }
  });

  // ESC 키로 모달 닫기
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && orderModal.classList.contains('show')) {
      closeModal();
    }
  });

  // CSV 내보내기
  exportBtn.addEventListener('click', exportCSV);

  // 모바일 메뉴
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  // 사이드바 외부 클릭 시 닫기 (모바일)
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 768 &&
      sidebar.classList.contains('show') &&
      !sidebar.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)) {
      sidebar.classList.remove('show');
    }
  });

  // 창 크기 변경 시 사이드바 상태 조정
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('show');
    }
  });
});

// 18) 전역 함수로 노출 (모달 열기용)
window.openOrderModal = openOrderModal;

// 19) 추가 유틸리티 함수들

// 새 주문 추가 (데모용)
function addNewOrder() {
  const newOrder = generateRandomOrder();
  orders.unshift(newOrder); // 맨 앞에 추가
  filterOrders();
  showNotification('새 주문이 추가되었습니다.');
}

// 선택된 주문들 일괄 처리 (데모용)
function bulkUpdateStatus(newStatus) {
  const checkedBoxes = document.querySelectorAll('.order-checkbox:checked');
  const orderIds = Array.from(checkedBoxes).map(cb => cb.getAttribute('data-id'));

  if (orderIds.length === 0) {
    showNotification('선택된 주문이 없습니다.', 'warning');
    return;
  }

  orderIds.forEach(orderId => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
    }
  });

  filterOrders();
  selectAllBtn.checked = false;
  showNotification(`${orderIds.length}개 주문의 상태가 '${newStatus}'로 변경되었습니다.`);
}

// 알림 타입별 스타일
function showNotification(message, type = 'success') {
  const alertClass = type === 'warning' ? 'alert-warning' : 'alert-success';
  const iconClass = type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle';

  const notification = document.createElement('div');
  notification.className = `alert ${alertClass} position-fixed alert-dismissible`;
  notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
  notification.innerHTML = `
        <i class="${iconClass} me-2"></i>${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
      `;

  document.body.appendChild(notification);

  // 자동 제거
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }
  }, 3000);
}

// 통계 정보 계산
function getOrderStats() {
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === '접수').length,
    processing: orders.filter(o => o.status === '처리중').length,
    completed: orders.filter(o => o.status === '완료').length,
    cancelled: orders.filter(o => o.status === '취소').length,
    totalRevenue: orders
      .filter(o => o.status === '완료')
      .reduce((sum, o) => sum + o.items.reduce((s, i) => s + (i.qty * i.price), 0), 0)
  };

  return stats;
}

// 개발자 도구용 헬퍼 함수들
window.orderManager = {
  orders,
  addNewOrder,
  bulkUpdateStatus,
  getOrderStats,
  generateRandomOrder
};