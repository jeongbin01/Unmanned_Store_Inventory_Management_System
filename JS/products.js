let products = JSON.parse(localStorage.getItem("products")) || [];

function renderProducts(list = products) {
    const tbody = document.getElementById("productList");
    tbody.innerHTML = "";

    list.forEach((p, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td><img src="${p.image || 'https://via.placeholder.com/50'}" /></td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>₩${p.price.toLocaleString()}</td>
      <td>${p.stock}개</td>
      <td class="product-actions">
        <button class="btn btn-sm btn-outline" onclick="editProduct(${i})">수정</button>
        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${i})">삭제</button>
      </td>
    `;
        tbody.appendChild(row);
    });
}

function saveProduct() {
    const name = document.getElementById("productName").value;
    const category = document.getElementById("productCategory").value;
    const price = parseInt(document.getElementById("productPrice").value);
    const stock = parseInt(document.getElementById("productStock").value);
    const image = document.getElementById("productImage").value;

    if (!name || !category || isNaN(price) || isNaN(stock)) return alert("모든 항목을 입력해주세요.");

    products.push({ name, category, price, stock, image });
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
    document.querySelector('[data-modal-close="productModal"]').click();
}

function editProduct(index) {
    const product = products[index];
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.stock;
    document.getElementById("productImage").value = product.image;

    openModal("productModal");

    const saveBtn = document.getElementById("saveProductBtn");
    const newSave = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSave, saveBtn);

    newSave.addEventListener("click", () => {
        products[index] = {
            name: document.getElementById("productName").value,
            category: document.getElementById("productCategory").value,
            price: parseInt(document.getElementById("productPrice").value),
            stock: parseInt(document.getElementById("productStock").value),
            image: document.getElementById("productImage").value,
        };
        localStorage.setItem("products", JSON.stringify(products));
        renderProducts();
        closeModal("productModal");
    });
}

function deleteProduct(index) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
}

document.getElementById("saveProductBtn").addEventListener("click", saveProduct);

document.getElementById("searchInput").addEventListener("input", e => {
    const keyword = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
    renderProducts(filtered);
});

renderProducts();
