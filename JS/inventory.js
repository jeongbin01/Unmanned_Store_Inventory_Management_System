let products = JSON.parse(localStorage.getItem("products")) || [];

function renderInventory() {
    const tbody = document.getElementById("inventoryList");
    tbody.innerHTML = "";

    products.forEach((p, i) => {
        const badge = getInventoryBadge(p.stock);
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.stock}개</td>
      <td><span class="badge ${badge.class}">${badge.label}</span></td>
    `;
        tbody.appendChild(row);
    });

    // 드롭다운 옵션 동기화
    const select = document.getElementById("stockProductSelect");
    select.innerHTML = "";
    products.forEach((p, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = p.name;
        select.appendChild(option);
    });
}

function getInventoryBadge(stock) {
    if (stock === 0) return { class: "out", label: "품절" };
    if (stock <= 5) return { class: "low", label: "부족" };
    return { class: "in-stock", label: "충분" };
}

document.getElementById("saveStockBtn").addEventListener("click", () => {
    const index = parseInt(document.getElementById("stockProductSelect").value);
    const qty = parseInt(document.getElementById("stockQuantity").value);
    const type = document.getElementById("stockType").value;

    if (isNaN(qty) || qty < 1) return alert("수량을 입력하세요.");

    if (type === "in") {
        products[index].stock += qty;
    } else {
        products[index].stock = Math.max(0, products[index].stock - qty);
    }

    localStorage.setItem("products", JSON.stringify(products));
    renderInventory();
    closeModal("stockModal");
});

renderInventory();
