// Dashboard.js
// ————————————————
// 차트 및 테이블 초기화 로직

document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  initTables();
});

function initCharts() {
  // Chart.js 예시 초기화 – 실제 데이터 fetch 로직으로 교체하세요
  const salesCtx = document.getElementById('salesChart').getContext('2d');
  const prodCtx = document.getElementById('productChart').getContext('2d');
  const visitorCtx = document.getElementById('visitorChart').getContext('2d');

  // 주간 매출 라인
  new Chart(salesCtx, {
    type: 'line',
    data: {
      labels: ['월', '화', '수', '목', '금', '토', '일'],
      datasets: [{
        label: '매출',
        data: [120, 135, 110, 145, 160, 180, 210].map(v => v * 10000),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: v => '₩' + (v / 10000) + '만'
          }
        }
      },
      plugins: { legend: { display: false } },
      maintainAspectRatio: false
    }
  });

  // 상품별 주문량 도넛
  new Chart(prodCtx, {
    type: 'doughnut',
    data: {
      labels: ['음료', '과자', '아이스크림', '컵라면', '기타'],
      datasets: [{ data: [35, 25, 20, 15, 5], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'] }]
    },
    options: {
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } },
      maintainAspectRatio: false
    }
  });

  // 일일 방문자 바
  new Chart(visitorCtx, {
    type: 'bar',
    data: {
      labels: Array.from({ length: 7 }, (_, i) => ['월', '화', '수', '목', '금', '토', '일'][i]),
      datasets: [{
        label: '방문자',
        data: [120, 135, 98, 145, 162, 189, 210],
        backgroundColor: 'rgba(16,185,129,0.8)',
        borderColor: '#10b981',
        borderWidth: 1
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { display: false } },
      maintainAspectRatio: false
    }
  });
}

// JS/orders.js

// ① 샘플 주문 데이터 (여기에 10개의 주문을 미리 정의해주세요)
const initialOrders = [
  {
    id: 'ORD-2025-1001',
    customer: '김철수',
    amount: 1200000 * 1 + 1800 * 2, // 총액 계산 예시
    status: 'completed',
    time: '10분 전'
  },
  {
    id: 'ORD-2025-1002',
    customer: '이영희',
    amount: 2500000 + 35000,
    status: 'processing',
    time: '25분 전'
  },
  {
    id: 'ORD-2025-1003',
    customer: '박지민',
    amount: 120000 * 2 + 1500 * 3 + 1200 * 1,
    status: 'pending',
    time: '50분 전'
  },
  {
    id: 'ORD-2025-1004',
    customer: '최유진',
    amount: 35000,
    status: 'completed',
    time: '1시간 전'
  },
  {
    id: 'ORD-2025-1005',
    customer: '정민수',
    amount: 1700 * 4 + 1700 * 2,
    status: 'cancelled',
    time: '2시간 전'
  },
  {
    id: 'ORD-2025-1006',
    customer: '김하늘',
    amount: 2500000 + 120000 + 1500 * 2 + 2500 * 3,
    status: 'completed',
    time: '3시간 전'
  },
  {
    id: 'ORD-2025-1007',
    customer: '이태민',
    amount: 2000 * 2,
    status: 'processing',
    time: '4시간 전'
  },
  {
    id: 'ORD-2025-1008',
    customer: '오승현',
    amount: 1200000 + 1800 * 5 + 1200,
    status: 'completed',
    time: '5시간 전'
  },
  {
    id: 'ORD-2025-1009',
    customer: '박소연',
    amount: 1800 * 3 + 1700,
    status: 'pending',
    time: '6시간 전'
  },
  {
    id: 'ORD-2025-1010',
    customer: '장우진',
    amount: 2500000 + 1700 * 2 + 1200 * 2,
    status: 'completed',
    time: '7시간 전'
  }
];

// ② 테이블 초기화 함수
function initTables() {
  // 샘플에서 랜덤으로 5개 추출
  const randomFive = initialOrders
    .sort(() => Math.random() - 0.5)  // 배열을 무작위로 섞고
    .slice(0, 5);                     // 앞의 5개만 취함

  const orderTbody = document.getElementById('ordersTable');
  orderTbody.innerHTML = ''; // 기존 내용 초기화

  randomFive.forEach(o => {
    // 상태 텍스트와 클래스 매핑
    let cls, txt;
    switch (o.status) {
      case 'completed':
        cls = 'completed'; txt = '완료'; break;
      case 'processing':
        cls = 'processing'; txt = '처리중'; break;
      case 'pending':
        cls = 'pending'; txt = '대기'; break;
      case 'cancelled':
        cls = 'cancelled'; txt = '취소'; break;
      default:
        cls = 'completed'; txt = '완료';
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.customer}</td>
      <td>₩${o.amount.toLocaleString()}</td>
      <td><span class="status-badge ${cls}">${txt}</span></td>
      <td>${o.time}</td>
    `;
    orderTbody.appendChild(tr);
  });
}

// ③ 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', initTables);


// 재고 부족 예시
const lowStock = [
  { name: '코카콜라 500ml', stock: 3, level: 'low' },
  { name: '하겐다즈', stock: 2, level: 'low' }
];
const stockTbody = document.getElementById('stockTable');
lowStock.forEach(item => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
      <td>
        <div class="stock-level">
          <span class="stock-indicator ${item.level}"></span>
          ${item.name}
        </div>
      </td>
      <td>${item.stock}개</td>
    `;
  stockTbody.appendChild(tr);
});
