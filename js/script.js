// Menunggu sampai seluruh halaman HTML selesai dimuat
document.addEventListener('DOMContentLoaded', () => {

    // --- DATABASE PRODUK (disimpan dalam array of objects) ---
    // Ganti nama file gambar sesuai dengan file yang kamu punya di folder /images
    const products = [
        { id: 1, name: 'Blouse Vintage 90s', price: 85000, image: 'images/baju1.jpg', category: 'pakaian-wanita', condition: 'Sangat Baik' },
        { id: 2, name: 'Kemeja Flanel Uniqlo', price: 120000, image: 'images/baju2.jpg', category: 'pakaian-pria', condition: 'Seperti Baru' },
        { id: 3, name: 'Sneakers Converse 70s', price: 250000, image: 'images/sepatu1.jpg', category: 'sepatu', condition: 'Baik' },
        { id: 4, name: 'Jaket Denim Levis', price: 180000, image: 'images/baju3.jpg', category: 'pakaian-pria', condition: 'Sangat Baik' },
        { id: 5, name: 'Midi Dress Bunga', price: 95000, image: 'images/baju4.jpg', category: 'pakaian-wanita', condition: 'Baik' },
        { id: 6, name: 'Nike Air Force 1', price: 350000, image: 'images/sepatu2.jpg', category: 'sepatu', condition: 'Seperti Baru' },
        { id: 7, name: 'Celana Kargo Pria', price: 110000, image: 'images/baju5.jpg', category: 'pakaian-pria', condition: 'Baik' },
        { id: 8, name: 'Tas Tote Kulit Wanita', price: 75000, image: 'images/baju6.jpg', category: 'pakaian-wanita', condition: 'Baru' },
    ];

    // --- MENGAMBIL ELEMEN DARI HTML ---
    const productGrid = document.getElementById('product-grid');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const likeCounter = document.getElementById('like-counter');

    // --- MENGAMBIL DATA "LIKES" DARI LOCALSTORAGE ---
    // Ambil data 'likedItems' dari localStorage. Jika tidak ada, gunakan array kosong [].
    let likedItems = JSON.parse(localStorage.getItem('likedItems')) || [];

    // --- FUNGSI UTAMA ---

    /**
     * Fungsi untuk me-render (menampilkan) produk ke halaman.
     * @param {Array} productsToRender - Array produk yang ingin ditampilkan.
     */
    function renderProducts(productsToRender) {
        // Kosongkan dulu isi grid produk
        productGrid.innerHTML = '';

        // Jika tidak ada produk yang cocok, tampilkan pesan.
        if (productsToRender.length === 0) {
            productGrid.innerHTML = '<div class="col-12"><p class="text-center text-muted fs-5 mt-4">Oops, tidak ada produk yang cocok dengan pencarianmu.</p></div>';
            return;
        }

        // Loop setiap produk di array dan buat elemen HTML-nya
        productsToRender.forEach(product => {
            // Cek apakah produk ini sudah di-like sebelumnya
            const isLiked = likedItems.includes(product.id);
            // Tambahkan kelas 'liked' jika isLiked bernilai true
            const likedClass = isLiked ? 'liked' : '';

            const productCard = document.createElement('div');
            productCard.className = 'col-6 col-md-4 col-lg-3';
            productCard.setAttribute('data-aos', 'fade-up');
            productCard.innerHTML = `
                <div class="card product-card h-100">
                    <div class="card-img-container">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
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

    /**
     * Fungsi untuk mengupdate jumlah 'likes' di localStorage dan di counter navbar.
     */
    function updateLikes() {
        // Simpan array likedItems ke localStorage dalam bentuk string JSON
        localStorage.setItem('likedItems', JSON.stringify(likedItems));
        // Update teks di dalam counter
        likeCounter.innerText = likedItems.length;
    }
    
    /**
     * Fungsi untuk memfilter dan mencari produk, lalu me-render hasilnya.
     */
    function filterAndSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

        // 1. Filter berdasarkan kategori
        let filteredProducts = products.filter(product => {
            if (activeFilter === 'semua') {
                return true; // Tampilkan semua jika filter 'semua'
            }
            return product.category === activeFilter;
        });

        // 2. Filter berdasarkan pencarian
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );
        }

        // 3. Render hasil akhir
        renderProducts(filteredProducts);
    }


    // --- EVENT LISTENERS (Pendengar Aksi Pengguna) ---

    // Event listener untuk tombol filter kategori
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Hapus kelas 'active' dari semua tombol
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Tambahkan kelas 'active' ke tombol yang baru saja diklik
            button.classList.add('active');
            // Panggil fungsi filter utama
            filterAndSearch();
        });
    });

    // Event listener untuk input pencarian (real-time)
    searchInput.addEventListener('keyup', filterAndSearch);

    // Event listener untuk klik pada ikon hati (like)
    // Kita pasang listener di 'productGrid' karena kartu produk dinamis (event delegation)
    productGrid.addEventListener('click', (event) => {
        // Cek apakah yang diklik adalah elemen dengan kelas 'heart-icon'
        if (event.target.classList.contains('heart-icon')) {
            const productId = parseInt(event.target.dataset.id);

            // Toggle like status di tampilan
            event.target.classList.toggle('liked');

            // Cek apakah produk sudah ada di array likedItems
            if (likedItems.includes(productId)) {
                // Jika sudah ada, hapus dari array
                likedItems = likedItems.filter(id => id !== productId);
            } else {
                // Jika belum ada, tambahkan ke array
                likedItems.push(productId);
            }

            // Update localStorage dan counter
            updateLikes();
        }
    });


    // --- INISIALISASI SAAT HALAMAN DIBUKA ---
    // Tampilkan semua produk saat halaman pertama kali dibuka
    renderProducts(products);
    // Update counter sesuai data dari localStorage saat halaman dibuka
    updateLikes();

});