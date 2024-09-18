document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        const container = document.getElementById('product-container');
        container.innerHTML = products.map(product => `
            <div class="product">
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="product-info">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p>Condition: ${product.condition}</p>
                    <p>Category: ${product.category}</p>
                    <p>Brand: ${product.brand}</p>
                    <p>Color: ${product.color || 'N/A'}</p>
                    <p class="price">Rs ${product.price}</p>
                    <div class="product-buttons">
                        <button class="btns cart-btn" data-product-id="${product._id}"><i class="fa-solid fa-cart-shopping"></i></button>
                        <button class="btns buy-btn"><i class="fa-solid fa-phone"></i></button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listener to cart buttons
        document.querySelectorAll('.cart-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const productId = event.target.closest('.cart-btn').dataset.productId;
                try {
                    await fetch('/api/cart/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ productId }),
                    });
                    alert('Product added to cart!');
                } catch (error) {
                    console.error('Error adding product to cart:', error);
                }
            });
        });

    } catch (error) {
        console.error('Error fetching products:', error);
    }
});
