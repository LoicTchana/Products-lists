// Function to add item to cart and add quantity controls inside the button
function addToCart(platName, price) {
    const cartButton = document.querySelector(`button[data-plat-name='${platName}']`);

    // If button already has quantity controls, do nothing
    if (cartButton.classList.contains('quantity-control-active')) return;

    // Save original button content
    const originalContent = cartButton.innerHTML;

    // Add quantity controls inside the button and change button style
    cartButton.classList.add('quantity-control-active');
    cartButton.innerHTML = `
        <img src="assets/images/SIGNE_--removebg-preview.png" class="icon decrease-icon" alt="-">
        <span class="cart-quantity">1</span>
        <img src="assets/images/signe_+-removebg-preview.png" class="icon increase-icon" alt="+">
    `;

    // Add event listeners for quantity controls
    const decreaseIcon = cartButton.querySelector('.decrease-icon');
    const increaseIcon = cartButton.querySelector('.increase-icon');
    const quantitySpan = cartButton.querySelector('.cart-quantity');

    decreaseIcon.addEventListener('click', () => {
        let quantity = parseInt(quantitySpan.textContent);
        if (quantity > 1) {
            // Réduire la quantité et mettre à jour le panier
            quantity--;
            quantitySpan.textContent = quantity;
            updateCart(platName, price, quantity);
        } else {
            // Si la quantité atteint 1 et l'utilisateur clique sur decrease, réinitialiser le bouton
            resetButton(cartButton, originalContent, platName);
            
            // Retirer l'élément du panier si la quantité est 1 et qu'on clique sur decrease
            const cartItem = document.querySelector(`[data-cart-name='${platName}']`);
            if (cartItem) {
                cartItem.remove();
            }
    
            // Remettre le texte du bouton à son état initial (ajouter au panier)
            const cartButton = document.querySelector(`button[data-plat-name='${platName}']`);
            cartButton.querySelector('.cart-quantity').textContent = '0';
            cartButton.classList.remove('quantity-control-active');
        }
    });
    
    
    

    increaseIcon.addEventListener('click', () => {
        let quantity = parseInt(quantitySpan.textContent);
        quantity++;
        quantitySpan.textContent = quantity;
        updateCart(platName, price, quantity);
    });

    // Initially add the item to the cart
    updateCart(platName, price, 1);
    updateCartSummary();
}

// Function to update the cart with the selected item and quantity
function updateCart(platName, price, quantity) {
    const cartItems = document.getElementById('cartItems');
    let existingItem = document.querySelector(`[data-cart-name='${platName}']`);

    if (existingItem) {
        existingItem.querySelector('.cart-quantity').textContent = quantity;
        existingItem.querySelector('.cart-total-price').textContent = `${(quantity * price).toFixed(2)}`;
    } else {
        const listItem = document.createElement('li');
        listItem.dataset.cartName = platName;
        listItem.innerHTML = `
            <p style="font-weight: bold; font-family: 'Red Hat', sans-serif; display: flex; justify-content: space-between; align-items: center;">
                ${platName} 
                <span class="remove-item" style="color: red; cursor: pointer; font-size: 20px;">&times;</span>
            </p>
            <div style="display: flex; justify-content: space-between; width: 150px;">
                <span style="color: hsl(14, 86%, 42%); font-family: 'Red Hat', sans-serif;"><span class="cart-quantity">${quantity}x</span></span>
                <span>$ ${price.toFixed(2)}</span>
                <span style="color: grey; font-family: 'Red Hat', sans-serif;">$<span class="cart-total-price">${(quantity * price).toFixed(2)}</span></span>
            </div>
        `;
        
        // Add event listener to the remove button
        listItem.querySelector('.remove-item').addEventListener('click', () => {
            listItem.remove();
            const cartButton = document.querySelector(`button[data-plat-name='${platName}']`);
            resetButton(cartButton, originalContent, platName);
            cartButton.querySelector('.cart-quantity').textContent = '0';
            updateCartSummary();
        });

        cartItems.appendChild(listItem);
    }

    updateCartSummary();
}

// Function to update the cart summary with total quantity and total price
function updateCartSummary() {
    const cartHeader = document.querySelector('#cart h2');
    const cartItems = document.querySelectorAll('#cartItems li');
    let totalQuantity = 0;
    let totalPrice = 0;

    cartItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.cart-quantity').textContent);
        const itemTotalPrice = parseFloat(item.querySelector('.cart-total-price').textContent);
        totalQuantity += quantity;
        totalPrice += itemTotalPrice;
    });

    cartHeader.textContent = `Your Cart (${totalQuantity}) - Total: $${totalPrice.toFixed(2)}`;
}


// Function to reset the button to its original state
function resetButton(button, originalContent, platName) {
    button.classList.remove('quantity-control-active');
    button.innerHTML = originalContent;

    // Remove item from cart
    const cartItem = document.querySelector(`[data-cart-name='${platName}']`);
    if (cartItem) {
        cartItem.remove();
    }

    updateCartSummary();
}


