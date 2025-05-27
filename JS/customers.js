// ───────── customers.js ─────────

// 샘플 고객 데이터
const initialCustomers = [
    { id: 'C0001', name: '김민수', email: 'minsu@example.com', tier: '브론즈', date: '2025-07-01' },
    { id: 'C0002', name: '이영희', email: 'younghee@example.com', tier: '실버', date: '2025-07-03' },
    { id: 'C0003', name: '박지민', email: 'jimin@example.com', tier: '골드', date: '2025-07-05' },
    { id: 'C0004', name: '최유진', email: 'yujin@example.com', tier: '플래티넘', date: '2025-07-07' },
    { id: 'C0005', name: '정민수', email: 'jms@example.com', tier: '브론즈', date: '2025-07-09' },
    // ... 필요시 추가
];

let customers = [...initialCustomers];
let filteredCustomers = [...customers];

// DOM 참조
const searchInput = document.getElementById('searchInput');
const tierFilter = document.getElementById('tierFilter');
const customersTbody = document.getElementById('customersTableBody');

// 모달 요소
const customerModal = document.getElementById('customerModal');
const closeCustomerModal = document.getElementById('closeCustomerModal');
const modalTitle = document.getElementById('modalTitle');
const formId = document.getElementById('modalCustomerId');
const formName = document.getElementById('modalCustomerName');
const formEmail = document.getElementById('modalCustomerEmail');
const formTier = document.getElementById('modalCustomerTier');
const formDate = document.getElementById('modalCustomerDate');
const saveCustomerBtn = document.getElementById('saveCustomerBtn');

let editingCustomer = null;

// ─ 테이블 렌더링
function renderCustomers() {
    customersTbody.innerHTML = filteredCustomers.map(c => `
    <tr onclick="openCustomerModal('${c.id}')">
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.tier}</td>
      <td>${c.date}</td>
      <td>
        <button class="action-btn view-btn" onclick="event.stopPropagation(); openCustomerModal('${c.id}')">
          <i class="fas fa-eye"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// ─ 검색·필터링
function filterCustomers() {
    const term = searchInput.value.toLowerCase();
    const tier = tierFilter.value;
    filteredCustomers = customers.filter(c => {
        const matchText = c.name.toLowerCase().includes(term)
            || c.email.toLowerCase().includes(term);
        const matchTier = tier === '전체' || c.tier === tier;
        return matchText && matchTier;
    });
    renderCustomers();
}

// ─ 모달 열기
function openCustomerModal(id) {
    editingCustomer = customers.find(c => c.id === id) || null;
    if (!editingCustomer) return;

    modalTitle.textContent = '고객 정보 수정';
    formId.value = editingCustomer.id;
    formName.value = editingCustomer.name;
    formEmail.value = editingCustomer.email;
    formTier.value = editingCustomer.tier;
    formDate.value = editingCustomer.date;

    customerModal.classList.add('show');
}

// ─ 모달 닫기
function closeModal() {
    customerModal.classList.remove('show');
    editingCustomer = null;
}

// ─ 저장
function saveCustomer() {
    if (!formName.value || !formEmail.value) {
        alert('이름과 이메일을 입력해주세요.');
        return;
    }

    editingCustomer.name = formName.value;
    editingCustomer.email = formEmail.value;
    editingCustomer.tier = formTier.value;
    editingCustomer.date = formDate.value;

    filterCustomers();
    closeModal();
}

// ─ 가입자 추이 차트 초기화
function initSignupChart() {
    const ctx = document.getElementById('signupChart').getContext('2d');
    // 최근 7일 샘플 데이터
    const labels = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    const data = labels.map(() => Math.floor(Math.random() * 10) + 5);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels, datasets: [{
                label: '신규 가입자',
                data,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59,130,246,0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// ─ 등급 비율 차트 초기화
function initTierChart() {
    const ctx = document.getElementById('tierChart').getContext('2d');
    const counts = customers.reduce((acc, c) => {
        acc[c.tier] = (acc[c.tier] || 0) + 1;
        return acc;
    }, {});
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    const colors = ['#d97706', '#3b82f6', '#10b981', '#8b5cf6'];

    new Chart(ctx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: colors }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
}

// ─ 초기화
document.addEventListener('DOMContentLoaded', () => {
    renderCustomers();
    initSignupChart();
    initTierChart();

    searchInput.addEventListener('input', filterCustomers);
    tierFilter.addEventListener('change', filterCustomers);

    closeCustomerModal.addEventListener('click', closeModal);
    saveCustomerBtn.addEventListener('click', saveCustomer);

    customerModal.addEventListener('click', e => {
        if (e.target === customerModal) closeModal();
    });
});

// 전역 호출
window.openCustomerModal = openCustomerModal;
