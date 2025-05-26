document.addEventListener('DOMContentLoaded', () => {
  const productModalEl = document.getElementById('productModal');
  const productModal = new bootstrap.Modal(productModalEl);
  const form       = document.getElementById('productForm');
  const tblBody    = document.getElementById('productTableBody');
  const searchInput= document.getElementById('searchInput');
  const selectAll  = document.getElementById('selectAll');
  let products = [
    { id: 1, name: '아메리카노', category: '음료', price: 3000, stock: 50 },
    { id: 2, name: '카페라떼', category: '음료', price: 3500, stock: 30 },
    { id: 3, name: '초코칩 쿠키', category: '디저트', price: 2500, stock: 20 }
  ];

  function renderTable(filter = '') {
    tblBody.innerHTML = '';
    products
      .filter(p => p.name.includes(filter))
      .forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><input type="checkbox" class="row-check" data-id="${p.id}"></td>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>${p.price.toLocaleString()}원</td>
          <td>${p.stock}개</td>
          <td>
            <button class="btn btn-sm btn-info edit-btn" data-id="${p.id}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger del-btn" data-id="${p.id}"><i class="fas fa-trash"></i></button>
          </td>`;
        tblBody.appendChild(tr);
      });
  }

  // 이벤트 바인딩
  document.getElementById('addProductBtn').addEventListener('click', () => {
    form.reset(); 
    form.productId.value = '';
    productModalEl.querySelector('.modal-title').textContent = '상품 추가';
    productModal.show();
  });

  tblBody.addEventListener('click', e => {
    const id = +e.target.closest('[data-id]')?.dataset.id;
    if (e.target.closest('.edit-btn')) {
      const prod = products.find(p => p.id === id);
      form.productId.value       = prod.id;
      form.productName.value     = prod.name;
      form.productCategory.value = prod.category;
      form.productPrice.value    = prod.price;
      form.productStock.value    = prod.stock;
      productModalEl.querySelector('.modal-title').textContent = '상품 수정';
      productModal.show();
    }
    if (e.target.closest('.del-btn')) {
      products = products.filter(p => p.id !== id);
      renderTable(searchInput.value);
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const id = form.productId.value;
    const newProd = {
      id: id ? +id : (products.length ? products.at(-1).id + 1 : 1),
      name: form.productName.value,
      category: form.productCategory.value,
      price: +form.productPrice.value,
      stock: +form.productStock.value
    };
    if (id) {
      products = products.map(p => p.id === newProd.id ? newProd : p);
    } else {
      products.push(newProd);
    }
    productModal.hide();
    renderTable(searchInput.value);
  });

  // 검색
  searchInput.addEventListener('input', () => renderTable(searchInput.value));

  // 전체 선택/해제
  selectAll.addEventListener('change', () => {
    document.querySelectorAll('.row-check').forEach(chk => chk.checked = selectAll.checked);
  });

  // 선택 삭제
  document.getElementById('deleteSelectedBtn').addEventListener('click', () => {
    const toDel = [...document.querySelectorAll('.row-check:checked')].map(chk => +chk.dataset.id);
    products = products.filter(p => !toDel.includes(p.id));
    renderTable(searchInput.value);
  });

  renderTable();
});
