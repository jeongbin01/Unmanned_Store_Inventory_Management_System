let orders = JSON.parse(localStorage.getItem("orders")) || [];

function renderOrders() {
    const tbody = document.getElementById("orderList");
    tbody.innerHTML = "";

    orders.forEach((o, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>#${o.id}</td>
      <td>${o.customer}</td>
      <td>₩${o.amount.toLocaleString()}</td>
      <td><span class="status ${o.status}">${getStatusLabel(o.status)}</span></td>
      <td>
        <select onchange="updateOrderStatus(${i}, this.value)">
          <option value="pending" ${o.status === "pending" ? "selected" : ""}>접수</option>
          <option value="processing" ${o.status === "processing" ? "selected" : ""}>처리중</option>
          <option value="completed" ${o.status === "completed" ? "selected" : ""}>완료</option>
          <option value="cancelled" ${o.status === "cancelled" ? "selected" : ""}>취소</option>
        </select>
      </td>
      <td><button class="btn btn-sm btn-outline" onclick="showOrderDetail(${i})">보기</button></td>
    `;
        tbody.appendChild(row);
    });
}

function getStatusLabel(status) {
    const labels = {
        pending: "접수",
        processing: "처리중",
        completed: "완료",
        cancelled: "취소",
    };
    return labels[status] || status;
}

function updateOrderStatus(index, status) {
    orders[index].status = status;
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
}

function showOrderDetail(index) {
    const order = orders[index];
    const box = document.getElementById("orderDetailBox");

    box.innerHTML = `
    <p><strong>주문번호:</strong> #${order.id}</p>
    <p><strong>고객명:</strong> ${order.customer}</p>
    <p><strong>금액:</strong> ₩${order.amount.toLocaleString()}</p>
    <p><strong>상태:</strong> ${getStatusLabel(order.status)}</p>
    <p><strong>상품목록:</strong></p>
    <ul>
      ${order.items.map(item => `<li>${item.name} (${item.quantity}개)</li>`).join("")}
    </ul>
  `;
    openModal("orderDetailModal");
}

renderOrders();
