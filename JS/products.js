// 상품 관리 JavaScript

// 초기 샘플 데이터
let products = [
    {
        id: 'P001',
        name: '삼성 갤럭시 S24',
        category: '전자제품',
        price: 1200000,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop'
    },
    {
        id: 'P002',
        name: '애플 맥북 프로',
        category: '전자제품',
        price: 2500000,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop'
    },
    {
        id: 'P003',
        name: '나이키 에어포스',
        category: '의류/신발',
        price: 120000,
        stock: 25,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop'
    },
    {
        id: 'P004',
        name: '스타벅스 텀블러',
        category: '생활용품',
        price: 35000,
        stock: 0,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop'
    },
    {
        id: 'P005',
        name: '무선 이어폰',
        category: '전자제품',
        price: 180000,
        stock: 3,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop'
    }
];

let filteredProducts = [...products];
let editingProduct = null;
let deletingProduct = null;

// DOM 요소 참조
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const addProductBtn = document.getElementById('addProductBtn');
const productsTableBody = document.getElementById('productsTableBody');

// 모달 관련 요소
const productModal = document.getElementById('productModal');
const deleteModal = document.getElementById('deleteModal');
const modalTitle = document.getElementById('modalTitle');
const closeModalBtn = document.getElementById('closeModalBtn');
const productForm = document.getElementById('productForm');
const cancelBtn = document.getElementById('cancelBtn');
const submitBtn = document.getElementById('submitBtn');

// 삭제 모달 요소
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const deleteProductName = document.getElementById('deleteProductName');

// 폼 입력 요소
const productId = document.getElementById('productId');
const productName = document.getElementById('productName');
const productCategory = document.getElementById('productCategory');
const productPrice = document.getElementById('productPrice');
const productStock = document.getElementById('productStock');
const productImage = document.getElementById('productImage');
const imagePreview = document.getElementById('imagePreview');

// 유틸리티 함수들
function formatPrice(price) {
    return price.toLocaleString() + '원';
}

function generateProductId() {
    return 'P' + String(Date.now()).slice(-6);
}

function getStockBadge(stock) {
    if (stock === 0) {
        return '<span class="stock-badge out-of-stock">품절</span>';
    } else if (stock <= 5) {
        return '<span class="stock-badge low-stock">재고 부족</span>';
    } else {
        return '<span class="stock-badge in-stock">재고 충분</span>';
    }
}

// 상품 테이블 렌더링
function renderProductsTable() {
    if (filteredProducts.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <h3>상품이 없습니다</h3>
                    <p>검색 조건을 변경하거나 새로운 상품을 등록해보세요.</p>
                </td>
            </tr>
        `;
        return;
    }

    productsTableBody.innerHTML = filteredProducts.map(product => `
        <tr onclick="editProduct('${product.id}')">
            <td>
                <img src="${product.image || 'https://via.placeholder.com/48'}" 
                     alt="${product.name}" 
                     class="product-image"
                     onerror="this.src='https://via.placeholder.com/48'">
            </td>
            <td class="product-id">${product.id}</td>
            <td class="product-name">${product.name}</td>
            <td class="product-category">${product.category}</td>
            <td class="product-price">${formatPrice(product.price)}</td>
            <td>
                <div class="stock-info">
                    <span>${product.stock}개</span>
                    ${getStockBadge(product.stock)}
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="event.stopPropagation(); editProduct('${product.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-btn delete-btn" onclick="event.stopPropagation(); deleteProduct('${product.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 검색 및 필터링
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
            product.id.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === '전체' || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderProductsTable();
}

// 상품 추가/수정 모달 열기
function openProductModal(product = null) {
    editingProduct = product;

    if (product) {
        modalTitle.textContent = '상품 수정';
        submitBtn.textContent = '저장';

        productId.value = product.id;
        productName.value = product.name;
        productCategory.value = product.category;
        productPrice.value = product.price;
        productStock.value = product.stock;
        productImage.value = product.image || '';

        updateImagePreview(product.image);
    } else {
        modalTitle.textContent = '신규 상품 등록';
        submitBtn.textContent = '등록';

        productId.value = generateProductId();
        productName.value = '';
        productCategory.value = '전자제품';
        productPrice.value = '';
        productStock.value = '';
        productImage.value = '';

        updateImagePreview('');
    }

    productModal.classList.add('show');
    productName.focus();
}

// 모달 닫기
function closeProductModal() {
    productModal.classList.remove('show');
    editingProduct = null;
    productForm.reset();
    updateImagePreview('');
}

// 이미지 미리보기 업데이트
function updateImagePreview(imageUrl) {
    if (imageUrl) {
        imagePreview.innerHTML = `<img src="${imageUrl}" alt="미리보기" class="preview-image" onerror="this.style.display='none'">`;
    } else {
        imagePreview.innerHTML = '';
    }
}

// 상품 저장
function saveProduct(formData) {
    const productData = {
        id: formData.get('id'),
        name: formData.get('name'),
        category: formData.get('category'),
        price: parseInt(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        image: formData.get('image') || ''
    };

    // 유효성 검사
    if (!productData.name || !productData.price || productData.stock === undefined) {
        alert('모든 필수 항목을 입력해주세요.');
        return false;
    }

    if (productData.price <= 0) {
        alert('가격은 0보다 큰 값을 입력해주세요.');
        return false;
    }

    if (productData.stock < 0) {
        alert('재고는 0 이상의 값을 입력해주세요.');
        return false;
    }

    if (editingProduct) {
        // 수정
        const index = products.findIndex(p => p.id === productData.id);
        if (index !== -1) {
            products[index] = productData;
        }
    } else {
        // 새로 추가
        // 중복 ID 체크
        if (products.find(p => p.id === productData.id)) {
            productData.id = generateProductId();
        }
        products.push(productData);
    }

    filterProducts();
    closeProductModal();

    alert(editingProduct ? '상품이 수정되었습니다.' : '상품이 등록되었습니다.');
    return true;
}

// 상품 편집
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        openProductModal(product);
    }
}

// 상품 삭제 확인 모달 열기
function deleteProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        deletingProduct = product;
        deleteProductName.textContent = product.name;
        deleteModal.classList.add('show');
    }
}

// 삭제 모달 닫기
function closeDeleteModal() {
    deleteModal.classList.remove('show');
    deletingProduct = null;
}

// 상품 삭제 확인
function confirmDelete() {
    if (deletingProduct) {
        products = products.filter(p => p.id !== deletingProduct.id);
        filterProducts();
        closeDeleteModal();
        alert('상품이 삭제되었습니다.');
    }
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function () {
    // 초기 렌더링
    renderProductsTable();

    // 검색 및 필터링 이벤트
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);

    // 상품 추가 버튼
    addProductBtn.addEventListener('click', () => openProductModal());

    // 모달 관련 이벤트
    closeModalBtn.addEventListener('click', closeProductModal);
    cancelBtn.addEventListener('click', closeProductModal);

    // 폼 제출 이벤트
    productForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(productForm);
        saveProduct(formData);
    });

    // 이미지 URL 변경 시 미리보기 업데이트
    productImage.addEventListener('input', function (e) {
        updateImagePreview(e.target.value);
    });

    // 삭제 모달 이벤트
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    confirmDeleteBtn.addEventListener('click', confirmDelete);

    // 모달 외부 클릭 시 닫기
    productModal.addEventListener('click', function (e) {
        if (e.target === productModal) {
            closeProductModal();
        }
    });

    deleteModal.addEventListener('click', function (e) {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (productModal.classList.contains('show')) {
                closeProductModal();
            }
            if (deleteModal.classList.contains('show')) {
                closeDeleteModal();
            }
        }
    });

    // 폼 요소에 name 속성 추가 (FormData 사용을 위해)
    productId.name = 'id';
    productName.name = 'name';
    productCategory.name = 'category';
    productPrice.name = 'price';
    productStock.name = 'stock';
    productImage.name = 'image';
});

// 전역 함수로 노출 (HTML에서 onclick 사용을 위해)
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

// 추가 유틸리티 함수들
function exportProducts() {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importProducts(jsonData) {
    try {
        const importedProducts = JSON.parse(jsonData);
        if (Array.isArray(importedProducts)) {
            products = importedProducts;
            filterProducts();
            alert('상품 데이터를 성공적으로 가져왔습니다.');
        } else {
            throw new Error('올바른 형식이 아닙니다.');
        }
    } catch (error) {
        alert('파일 형식이 올바르지 않습니다: ' + error.message);
    }
}

// 재고 부족 상품 확인
function getLowStockProducts() {
    return products.filter(product => product.stock <= 5 && product.stock > 0);
}

function getOutOfStockProducts() {
    return products.filter(product => product.stock === 0);
}

// 통계 정보
function getProductStats() {
    return {
        totalProducts: products.length,
        totalValue: products.reduce((sum, product) => sum + (product.price * product.stock), 0),
        lowStockCount: getLowStockProducts().length,
        outOfStockCount: getOutOfStockProducts().length,
        categoryStats: products.reduce((stats, product) => {
            stats[product.category] = (stats[product.category] || 0) + 1;
            return stats;
        }, {})
    };
}