document.addEventListener('DOMContentLoaded', () => {
  const tblBody = document.getElementById('inventoryTableBody');
  const totalItemsEl = document.getElementById('invTotalItems');
  const lowStockEl   = document.getElementById('invLowStock');
  const adjustModalEl = document.getElementById('adjustModal');
  const adjustModal   = new bootstrap.Modal(adjustModalEl);
  const form          = document.getElementById('adjustForm');
  const chartCtx      = document.getElementById('inventoryChart').getContext('2d');

  let items = [
    { id: 1, name: '아메리카노', category: '음료', stock: 50 },
    { id: 2, name: '카페라떼', category: '음료', stock: 30 },
    { id: 3, name: '쿠키',         category: '디저트', stock: 10 },
    { id: 4, name: '샌드위치',     category: '식사',   stock: 5 }
  ];

  function renderInventory() {
    tblBody.innerHTML = '';
    items.forEach(i => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i.id}</td>
        <td>${i.name}</td>
        <td>${i.category}</td>
        <td>${i.stock}개</td>
        <td>
          <button class="btn btn-sm btn-warning adjust-btn" data-id="${i.id}">
            <i class="fas fa-edit"></i>
          </button>
        </td>`;
      tblBody.appendChild(tr);
    });
    totalItemsEl.textContent = items.length + '개';
    lowStockEl.textContent   = items.filter(i => i.stock < 10).length + '개';
    renderChart();
  }

  function renderChart() {
    const byCat = {};
    items.forEach(i => byCat[i.category] = (byCat[i.category]||0) + i.stock);
    new Chart(chartCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(byCat),
        datasets: [{ label: '재고 수량', data: Object.values(byCat), barPercentage: 0.6 }]
      },
      options: { responsive: true, plugins:{ legend:{ display:false } } }
    });
  }

  tblBody.addEventListener('click', e => {
    if (e.target.closest('.adjust-btn')) {
      const id = +e.target.closest('[data-id]').dataset.id;
      const item = items.find(x => x.id === id);
      form.adjustId.value = id;
      document.getElementById('adjustName').textContent = `${item.name} (현재 ${item.stock}개)`;
      form.adjustQty.value = '';
      adjustModal.show();
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const id  = +form.adjustId.value;
    const qty = +form.adjustQty.value;
    items = items.map(i => i.id === id ? {...i, stock: i.stock + qty} : i);
    adjustModal.hide();
    renderInventory();
  });

  renderInventory();
});
