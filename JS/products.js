// 상품 데이터
let products = [];
let editingIndex = -1;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    renderProducts();
    updateStats();
    updateCategoryFilter();
});

// 상품 데이터 로드
function loadProducts() {
    // 초기 샘플 데이터
    if (products.length === 0) {
        products = [
            {
                name: "신라면",
                category: "라면",
                price: 1200,
                stock: 50,
                image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop",
                description: "매콤한 신라면"
            },
            {
                name: "콜라",
                category: "음료",
                price: 1500,
                stock: 3,
                image: "https://images.unsplash.com/photo-1546669910-5bd8c4d3347e?w=100&h=100&fit=crop",
                description: "시원한 콜라"
            },
            {
                name: "초콜릿",
                category: "과자",
                price: 2000,
                stock: 0,
                image: "https://images.unsplash.com/photo-1549007908-95c9c8187737?w=100&h=100&fit=crop",
                description: "달콤한 초콜릿"
            }
        ];
    }
}

// 상품 목록 렌더링
function renderProducts(filteredProducts = products) {
    const tbody = document.getElementById('productList');
    const emptyState = document.getElementById('emptyState');

    if (filteredProducts.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('d-none');
        return;
    }

    emptyState.classList.add('d-none');

    tbody.innerHTML = filteredProducts.map((product, index) => `
        <tr class="animate-fade-in">
          <td>
            <img src="${product.image || 'https://via.placeholder.com/60'}" 
                 class="product-image" alt="${product.name}"
                 onerror="this.src='https://via.placeholder.com/60'">
          </td>
          <td>
            <div class="fw-bold">${product.name}</div>
            <small class="text-muted">${product.description || ''}</small>
          </td>
          <td>
            <span class="badge bg-primary">${product.category}</span>
          </td>
          <td class="fw-bold">₩${product.price.toLocaleString()}</td>
          <td>
            <span class="badge badge-stock ${getStockBadgeClass(product.stock)}">
              ${product.stock}개
            </span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-action" onclick="editProduct(${products.indexOf(product)})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-outline-danger btn-action" onclick="deleteProduct(${products.indexOf(product)})">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join('');
}

// 재고 상태에 따른 배지 클래스
function getStockBadgeClass(stock) {
    if (stock === 0) return 'bg-danger';
    if (stock <= 5) return 'bg-warning text-dark';
    return 'bg-success';
}

// 통계 업데이트
function updateStats() {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock <= 5 && p.stock > 0).length;
    const categories = [...new Set(products.map(p => p.category))].length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('lowStockProducts').textContent = lowStockProducts;
    document.getElementById('totalCategories').textContent = categories;
    document.getElementById('totalValue').textContent = `₩${totalValue.toLocaleString()}`;
}

// 카테고리 필터 업데이트
function updateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(products.map(p => p.category))];

    categoryFilter.innerHTML = '<option value="">전체 카테고리</option>' +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

// 상품 저장
function saveProduct() {
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value.trim();
    const price = parseInt(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const image = document.getElementById('productImage').value.trim();
    const description = document.getElementById('productDescription').value.trim();

    if (!name || !category || isNaN(price) || isNaN(stock)) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
    }

    const productData = { name, category, price, stock, image, description };

    if (editingIndex >= 0) {
        products[editingIndex] = productData;
        editingIndex = -1;
    } else {
        products.push(productData);
    }

    renderProducts();
    updateStats();
    updateCategoryFilter();
    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    resetForm();
}

// 상품 수정
function editProduct(index) {
    const product = products[index];
    editingIndex = index;

    document.getElementById('modalTitle').textContent = '상품 수정';
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productImage').value = product.image || '';
    document.getElementById('productDescription').value = product.description || '';

    new bootstrap.Modal(document.getElementById('productModal')).show();
}

// 상품 삭제
function deleteProduct(index) {
    if (confirm('정말 삭제하시겠습니까?')) {
        products.splice(index, 1);
        renderProducts();
        updateStats();
        updateCategoryFilter();
    }
}

// 폼 리셋
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('modalTitle').textContent = '상품 등록';
    editingIndex = -1;
}

// 필터링
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const stockFilter = document.getElementById('stockFilter').value;

    let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;

        let matchesStock = true;
        if (stockFilter === 'inStock') matchesStock = product.stock > 0;
        else if (stockFilter === 'lowStock') matchesStock = product.stock <= 5 && product.stock > 0;
        else if (stockFilter === 'outOfStock') matchesStock = product.stock === 0;

        return matchesSearch && matchesCategory && matchesStock;
    });

    renderProducts(filtered);
}

// 이벤트 리스너
document.getElementById('saveProductBtn').addEventListener('click', saveProduct);
document.getElementById('searchInput').addEventListener('input', filterProducts);
document.getElementById('categoryFilter').addEventListener('change', filterProducts);
document.getElementById('stockFilter').addEventListener('change', filterProducts);

// 모달 리셋
document.getElementById('productModal').addEventListener('hidden.bs.modal', resetForm);