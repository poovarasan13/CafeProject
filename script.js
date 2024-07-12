function increaseCount(productId) {
    const countInput = document.getElementById(`product-count-${productId}`);
    countInput.value = parseInt(countInput.value) + 1;
}

function decreaseCount(productId) {
    const countInput = document.getElementById(`product-count-${productId}`);
    if (countInput.value > 1) {
        countInput.value = parseInt(countInput.value) - 1;
    }
}

function placeOrder(productId) {
    const productName = document.getElementById(`product-name-${productId}`).innerText;
    const productPrice = parseInt(document.getElementById(`product-price-${productId}`).innerText);
    const productCount = parseInt(document.getElementById(`product-count-${productId}`).value);

    let orders = JSON.parse(sessionStorage.getItem('orders')) || [];

    const existingOrderIndex = orders.findIndex(order => order.name === productName);
    if (existingOrderIndex !== -1) {
        orders[existingOrderIndex].count += productCount;
        orders[existingOrderIndex].price += productPrice * productCount;
    } else {
        orders.push({ name: productName, price: productPrice * productCount, count: productCount });
    }

    sessionStorage.setItem('orders', JSON.stringify(orders));

    console.log(`${productCount} x ${productName} has been added to your order.`);
    console.log('Current orders:', orders);

    alert(`${productCount} x ${productName} has been added to your order.`);
}

function displayOrders() {
    const orders = JSON.parse(sessionStorage.getItem('orders')) || [];

    console.log('Orders to display:', orders);

    if (orders.length === 0) {
        document.getElementById('order-list').innerHTML = '<p>No orders placed yet.</p>';
        return;
    }

    let totalPrice = 0;
    let orderListHtml = '<ul class="list-group">';

    orders.forEach((order, index) => {
        totalPrice += order.price;
        orderListHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">
                            ${order.count} x ${order.name}
                            <span class="badge bg-primary rounded-pill">${order.price}</span>
                            <button class="btn btn-danger btn-sm" onclick="deleteOrder(${index})">Delete</button>
                          </li>`;
    });

    orderListHtml += `</ul>
                      <div class="mt-3">
                        <h4>Total Price: ${totalPrice}</h4>
                      </div>`;

    document.getElementById('order-list').innerHTML = orderListHtml;
}

function deleteOrders() {
    sessionStorage.removeItem('orders');
    displayOrders();
    alert('All orders have been deleted.');
}

function deleteOrder(orderIndex) {
    let orders = JSON.parse(sessionStorage.getItem('orders')) || [];
    orders.splice(orderIndex, 1);
    sessionStorage.setItem('orders', JSON.stringify(orders));
    displayOrders();
    alert('Order item has been deleted.');
}

function finalizeOrder(event) {
    event.preventDefault();

    const userName = document.getElementById('userName').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    const address = document.getElementById('address').value;

    const orders = JSON.parse(sessionStorage.getItem('orders')) || [];
    if (orders.length === 0) {
        alert('No orders to finalize.');
        return;
    }

    const orderDetails = {
        userName,
        mobileNumber,
        address,
        orders,
        totalPrice: orders.reduce((total, order) => total + order.price, 0)
    };

    sessionStorage.setItem('finalOrder', JSON.stringify(orderDetails));

    // Redirect to finalize order page
    window.location.href = 'order.html';
}

document.getElementById('finalizeOrderForm').addEventListener('submit', finalizeOrder);
