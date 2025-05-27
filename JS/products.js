// 상품 관리 JavaScript

// localStorage 키
const STORAGE_KEY = 'productsData';

// ① 초기 데이터 로드
let products = (() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { return JSON.parse(saved); }
    catch(e) { console.warn('로컬데이터 파싱 오류', e); }
  }
  return [
    { id:'P001', name:'삼성 갤럭시 S24', category:'전자제품', price:1200000, stock:15, image:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop' },
    { id:'P002', name:'애플 맥북 프로', category:'전자제품', price:2500000, stock:8,  image:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop' },
    { id:'P003', name:'나이키 에어포스', category:'의류/신발', price:120000,  stock:25, image:'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop' },
    { id:'P004', name:'스타벅스 텀블러', category:'생활용품', price:35000,   stock:0,  image:'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop' },
    { id:'P005', name:'무선 이어폰',   category:'전자제품', price:180000,  stock:3,  image:'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop' }
  ];
})();
let filteredProducts = [...products];
let editingProduct = null;
let deletingProduct = null;

// ② localStorage 에 저장
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// DOM 참조
const searchInput     = document.getElementById('searchInput');
const categoryFilter  = document.getElementById('categoryFilter');
const addProductBtn   = document.getElementById('addProductBtn');
const productsTableBody = document.getElementById('productsTableBody');
const productModal    = document.getElementById('productModal');
const deleteModal     = document.getElementById('deleteModal');
const modalTitle      = document.getElementById('modalTitle');
const closeModalBtn   = document.getElementById('closeModalBtn');
const productForm     = document.getElementById('productForm');
const cancelBtn       = document.getElementById('cancelBtn');
const submitBtn       = document.getElementById('submitBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn= document.getElementById('confirmDeleteBtn');
const deleteProductName = document.getElementById('deleteProductName');

const productId       = document.getElementById('productId');
const productName     = document.getElementById('productName');
const productCategory = document.getElementById('productCategory');
const productPrice    = document.getElementById('productPrice');
const productStock    = document.getElementById('productStock');
const productImage    = document.getElementById('productImage');
const imagePreview    = document.getElementById('imagePreview');

// 유틸
function formatPrice(price) {
  return price.toLocaleString() + '원';
}
function generateProductId() {
  return 'P' + String(Date.now()).slice(-6);
}
function getStockBadge(stock) {
  if (stock === 0)      return '<span class="stock-badge out-of-stock">품절</span>';
  if (stock <= 5)       return '<span class="stock-badge low-stock">재고 부족</span>';
  return '<span class="stock-badge in-stock">재고 충분</span>';
}

// 렌더
function renderProductsTable() {
  if (!filteredProducts.length) {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <h3>상품이 없습니다</h3>
          <p>검색 조건을 변경하거나 새로운 상품을 등록해보세요.</p>
        </td>
      </tr>`;
    return;
  }
  productsTableBody.innerHTML = filteredProducts.map(p=>`
    <tr onclick="editProduct('${p.id}')">
      <td><img src="${p.image||'https://via.placeholder.com/48'}"
               alt="${p.name}"
               class="product-image"
               onerror="this.src='https://via.placeholder.com/48'"></td>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${formatPrice(p.price)}</td>
      <td>
        <div class="stock-info">
          <span>${p.stock}개</span>
          ${getStockBadge(p.stock)}
        </div>
      </td>
      <td>
        <button class="action-btn edit-btn" onclick="event.stopPropagation();editProduct('${p.id}')">
          <i class="fas fa-pen"></i>
        </button>
        <button class="action-btn delete-btn" onclick="event.stopPropagation();deleteProduct('${p.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// 필터
function filterProducts() {
  const term = searchInput.value.toLowerCase();
  const cat  = categoryFilter.value;
  filteredProducts = products.filter(p=>{
    const matchText = p.id.toLowerCase().includes(term) || p.name.toLowerCase().includes(term);
    const matchCat  = cat==='전체' || p.category===cat;
    return matchText && matchCat;
  });
  renderProductsTable();
}

// 모달 열기
function openProductModal(prod=null) {
  editingProduct = prod;
  if (prod) {
    modalTitle.textContent = '상품 수정';
    submitBtn.textContent = '저장';
    productId.value = prod.id;
    productName.value = prod.name;
    productCategory.value = prod.category;
    productPrice.value = prod.price;
    productStock.value = prod.stock;
    productImage.value = prod.image;
    updateImagePreview(prod.image);
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

// 이미지 미리보기
function updateImagePreview(url) {
  imagePreview.innerHTML = url
    ? `<img src="${url}" alt="미리보기" onerror="this.style.display='none'">`
    : '';
}

// 저장
function saveProduct(formData) {
  const data = {
    id:       formData.get('id'),
    name:     formData.get('name'),
    category: formData.get('category'),
    price:    parseInt(formData.get('price')),
    stock:    parseInt(formData.get('stock')),
    image:    formData.get('image')||''
  };
  if (!data.name||!data.price||data.stock<0) {
    alert('필수 항목을 올바르게 입력해주세요.');
    return false;
  }
  if (editingProduct) {
    const idx = products.findIndex(p=>p.id===data.id);
    products[idx] = data;
  } else {
    if (products.some(p=>p.id===data.id)) data.id = generateProductId();
    products.push(data);
  }
  saveToStorage();
  filterProducts();
  closeProductModal();
  alert(editingProduct?'상품이 수정되었습니다.':'상품이 등록되었습니다.');
  return true;
}

// 편집
function editProduct(id) {
  const prod = products.find(p=>p.id===id);
  if (prod) openProductModal(prod);
}

// 삭제
function deleteProduct(id) {
  const prod = products.find(p=>p.id===id);
  if (!prod) return;
  deletingProduct = prod;
  deleteProductName.textContent = prod.name;
  deleteModal.classList.add('show');
}
function closeDeleteModal() {
  deleteModal.classList.remove('show');
  deletingProduct = null;
}
function confirmDelete() {
  if (!deletingProduct) return;
  products = products.filter(p=>p.id!==deletingProduct.id);
  saveToStorage();
  filterProducts();
  closeDeleteModal();
  alert('상품이 삭제되었습니다.');
}

// 이벤트 바인딩
document.addEventListener('DOMContentLoaded',()=>{
  renderProductsTable();
  searchInput.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);
  addProductBtn.addEventListener('click', ()=>openProductModal());
  closeModalBtn.addEventListener('click', closeProductModal);
  cancelBtn.addEventListener('click', closeProductModal);
  productForm.addEventListener('submit', e=>{
    e.preventDefault();
    saveProduct(new FormData(productForm));
  });
  productImage.addEventListener('input', e=>updateImagePreview(e.target.value));
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  confirmDeleteBtn.addEventListener('click', confirmDelete);
  productModal.addEventListener('click', e=>{ if(e.target===productModal) closeProductModal(); });
  deleteModal.addEventListener('click', e=>{ if(e.target===deleteModal) closeDeleteModal(); });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      if(productModal.classList.contains('show')) closeProductModal();
      if(deleteModal.classList.contains('show')) closeDeleteModal();
    }
  });

  // FormData 용 name 속성
  productId.name       = 'id';
  productName.name     = 'name';
  productCategory.name = 'category';
  productPrice.name    = 'price';
  productStock.name    = 'stock';
  productImage.name    = 'image';
});

// 전역 노출
window.editProduct   = editProduct;
window.deleteProduct = deleteProduct;
