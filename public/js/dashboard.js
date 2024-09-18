document.addEventListener('DOMContentLoaded', () => {
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const requirementsBtn = document.querySelector('.requirements-btn');
    const sellItemsBtn = document.querySelector('.sellItems-btn');

    // Wishlist Button Listener (already working)
    if (wishlistBtn) {  
        wishlistBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/wishlist');  // API to fetch wishlist data
                const wishlistHtml = await response.text();

                const contentDiv = document.getElementById('dynamic-content');
                if (contentDiv) {
                    contentDiv.innerHTML = wishlistHtml;  // Insert the fetched HTML into the dashboard
                } else {
                    console.error('Error: dynamic-content div not found');
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            }
        });
    } else {
        console.error('Error: wishlist-btn not found');
    }

    // Requirements Button Listener
    if (requirementsBtn) {
        requirementsBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/requirements');  // API to fetch requirements data
                const requirementsHtml = await response.text();

                const contentDiv = document.getElementById('dynamic-content');
                if (contentDiv) {
                    contentDiv.innerHTML = requirementsHtml;  // Insert the fetched HTML into the dashboard
                } else {
                    console.error('Error: dynamic-content div not found');
                }
            } catch (error) {
                console.error('Error fetching requirements:', error);
            }
        });
    } else {
        console.error('Error: requirements-btn not found');
    }

    if (sellItemsBtn) {
        sellItemsBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/sell-items');
                
                if (!response.ok) {
                    throw new Error('Error fetching sell items');
                }
    
                const html = await response.text();  // Get the HTML from the response
                const contentDiv = document.getElementById('dynamic-content');
                
                if (contentDiv) {
                    contentDiv.innerHTML = html;  // Inject the HTML into the div
                }
            } catch (error) {
                console.error('Error fetching sell items:', error);
            }
        });
    } else {
        console.error('Error: sell-items-btn not found');
    }

});



