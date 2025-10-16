document.addEventListener('DOMContentLoaded', () => {

    const products = [
        { id: 1, name: 'Blouse Vintage 90s', price: 85000, image: 'images/baju1.jpg', category: 'pakaian-wanita', condition: 'Sangat Baik' },
        { id: 2, name: 'Kemeja Flanel Uniqlo', price: 120000, image: 'images/baju2.jpg', category: 'pakaian-pria', condition: 'Seperti Baru' },
        { id: 3, name: 'Sneakers Converse 70s', price: 250000, image: 'images/sepatu1.jpg', category: 'sepatu', condition: 'Baik' },
        { id: 4, name: 'Jaket Denim Levis', price: 180000, image: 'images/jaket1.jpg', category: 'pakaian-pria', condition: 'Sangat Baik' },
        { id: 5, name: 'Midi Dress Bunga', price: 95000, image: 'images/baju4.jpg', category: 'pakaian-wanita', condition: 'Baik' },
        { id: 6, name: 'Nike Air Force 1', price: 350000, image: 'images/sepatu2.jpg', category: 'sepatu', condition: 'Seperti Baru' },
        { id: 7, name: 'Celana Kargo Pria', price: 110000, image: 'images/baju5.jpg', category: 'pakaian-pria', condition: 'Baik' },
        { id: 8, name: 'Tas Tote Kulit Wanita', price: 75000, image: 'images/baju6.jpg', category: 'pakaian-wanita', condition: 'Baru' },
        { id: 9, name: 'Totebag VANS', price: 160000, image: 'images/tbvans.jpg', category: 'pakaian-pria', condition: 'Baru' },
        { id: 10, name: 'Tas Converse', price: 180000, image: 'images/tasc.jpg', category: 'pakaian-wanita', category: 'pakaian-pria', condition: 'Baru' },
        { id: 11, name: 'Pinion Denim', price: 1250000, image: 'images/pinion.jpg', category: 'pakaian-pria', condition: 'Baru' },
        { id: 12, name: 'Momotaro', price: 2599999, image: 'images/momotaro.jpg', category: 'pakaian-pria', condition: 'Baru' },

    ];

    const productGrid = document.getElementById('product-grid');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const likeCounter = document.getElementById('like-counter');
    const productDetailModal = new bootstrap.Modal(document.getElementById('productDetailModal'));
    const filterIndicator = document.getElementById('filter-indicator');
    const activeFilterText = document.getElementById('active-filter-text');
    const resetFilterBtn = document.getElementById('reset-filter-btn');

    let likedItems = JSON.parse(localStorage.getItem('likedItems')) || [];

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function renderProducts(productsToRender) {
        productGrid.innerHTML = '';

        if (productsToRender.length === 0) {
            productGrid.innerHTML = '<div class="col-12"><p class="text-center text-muted fs-5 mt-4">Oops, tidak ada produk yang cocok dengan pencarianmu.</p></div>';
            return;
        }

        productsToRender.forEach(product => {
            const isLiked = likedItems.includes(product.id);
            const likedClass = isLiked ? 'liked' : '';

            const productCard = document.createElement('div');
            productCard.className = 'col-6 col-md-4 col-lg-3';
            productCard.setAttribute('data-aos', 'fade-up');
            productCard.innerHTML = `
                <div class="card product-card h-100">
                    <div class="card-img-container">
                        <img src="${product.image}" class="card-img-top lazyload" alt="${product.name}">
                        <i class="bi bi-heart-fill heart-icon ${likedClass}" data-id="${product.id}"></i>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text price">Rp ${product.price.toLocaleString('id-ID')}</p>
                        <span class="badge bg-secondary align-self-start">${product.condition}</span>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    function updateLikes() {
        localStorage.setItem('likedItems', JSON.stringify(likedItems));
        likeCounter.innerText = likedItems.length;
    }
    
    function filterAndSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

        let filteredProducts = products.filter(product => {
            if (activeFilter === 'semua') return true;
            return product.category === activeFilter;
        });

        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );
        }

        if (activeFilter !== 'semua' || searchTerm) {
            let indicatorText = '';
            if (activeFilter !== 'semua') {
                indicatorText += document.querySelector('.filter-btn.active').innerText;
            }
            if (searchTerm) {
                indicatorText += (indicatorText ? ` & ` : '') + `"${searchTerm}"`;
            }
            activeFilterText.innerText = indicatorText;
            filterIndicator.style.display = 'block';
        } else {
            filterIndicator.style.display = 'none';
        }
        
        renderProducts(filteredProducts);
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterAndSearch();
        });
    });

    searchInput.addEventListener('keyup', debounce(filterAndSearch, 300));

    productGrid.addEventListener('click', (event) => {
        const heartIcon = event.target.closest('.heart-icon');
        const productCard = event.target.closest('.product-card');

        if (heartIcon) {
            const productId = parseInt(heartIcon.dataset.id);
            heartIcon.classList.toggle('liked');

            if (likedItems.includes(productId)) {
                likedItems = likedItems.filter(id => id !== productId);
            } else {
                likedItems.push(productId);
            }
            updateLikes();
        } else if (productCard) {
            const productId = parseInt(productCard.querySelector('.heart-icon').dataset.id);
            const productData = products.find(p => p.id === productId);

            if (productData) {
                document.getElementById('modalProductName').innerText = productData.name;
                document.getElementById('modalProductImage').src = productData.image;
                document.getElementById('modalProductPrice').innerText = `Rp ${productData.price.toLocaleString('id-ID')}`;
                document.getElementById('modalProductCondition').innerText = productData.condition;
                document.getElementById('modalProductDescription').innerText = `Ini adalah ${productData.name}, sebuah item berkualitas dengan kondisi ${productData.condition.toLowerCase()}. Siap untuk menjadi bagian dari koleksi Anda!`;
                productDetailModal.show();
            }
        }
    });
    
    resetFilterBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="semua"]').classList.add('active');
        filterAndSearch();
    });

    // --- INISIALISASI ---
    renderProducts(products);
    updateLikes();

});