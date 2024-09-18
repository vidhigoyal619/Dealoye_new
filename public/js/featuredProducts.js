document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/featured-products');
        const featuredProducts = await response.json();
        
        const container = document.getElementById('featured-container');
        container.innerHTML = featuredProducts.map(product => `
            <div class="product">
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="product-info">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p class="price">$${product.price}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching featured products:', error);
    }
});
