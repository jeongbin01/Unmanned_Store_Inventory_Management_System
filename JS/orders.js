document.addEventListener('DOMContentLoaded', () => {
  const tblBody = document.getElementById('orderTableBody');
  const searchInput = document.getElementById('orderSearch');
  let orders = [
    { id: 101, customer: '홍길동', items: 3, total: 9000, status: '완료', time: '2025-05-26 14:32' },
    { id: 102, customer: '김영희', items: 1, total: 3500, status: '대기', time: '2025-05-26 15:10' },
    { id: 103, customer: '이철수', items: 2, total: 6500, status: '취소', time: '2025-05-25 11:05' }
  ];

  function renderTable(filter='') {
    tblBody.innerHTML = '';
    orders
      .filter(o => 
         o.customer.includes(filter) ||
         o.status.includes(filter) ||
         String(o.id).includes(filter))
      .forEach(o => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${o.id}</td>
          <td>${o.customer}</td>
          <td>${o.items}개</td>
          <td>${o.total.toLocaleString()}원</td>
          <td>${o.status}</td>
          <td>${o.time}</td>`;
        tblBody.appendChild(tr);
      });
  }

  searchInput.addEventListener('input', () => renderTable(searchInput.value));
  renderTable();
});
