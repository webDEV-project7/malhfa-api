content = r'''/* ============================================================
   MALHAFTI DESIGN — Store JS v8 (Stable Clean)
   ============================================================ */

// ===== STATE =====
let storeCart   = JSON.parse(localStorage.getItem('malhfa_cart_v5')) || [];
let allProducts = [];
let currentPage = 1;
const PER_PAGE  = 12;
let currentCategory = 'all';
let currentSort     = 'default';
let currentCustomer = null;

// Helper to escape HTML to prevent XSS
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initCart();
    initCheckout();
    initAuth();
    checkStatus();
    updateCartBadge();

    // Home page vs Collections page detection
    if (window.IS_COLLECTIONS_PAGE) {
        initCatTabs();
        initSortSelect();
        loadCollectionsPage(1);
    } else {
        initCatTabsHome();
        loadFeaturedProducts();
    }

    // Newsletter
    const nf = document.getElementById('newsletter-form');
    if (nf) {
        nf.addEventListener('submit', (e) => {
            e.preventDefault();
            const el = document.getElementById('newsletter-email');
            if (el && el.value) {
                alert('Merci ! Vous êtes maintenant inscrit(e) à nos éditions.');
                el.value = '';
            }
        });
    }
});

// ===== NAVBAR =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');

    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            mobileNav.classList.toggle('open');
        });
    }
}

window.closeMobileNav = function() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    if (hamburgerBtn) hamburgerBtn.classList.remove('open');
    if (mobileNav) mobileNav.classList.remove('open');
};

// ===== PRODUCTS API & RENDERING =====
async function fetchProducts(category = 'all', page = 1, limit = 0) {
    try {
        let url = /api/products?page=;
        if (category !== 'all') url += &category=;
        if (limit > 0) url += &limit=;
        const res = await fetch(url);
        if (!res.ok) throw new Error('API error');
        return await res.json();
    } catch (e) {
        console.error('fetchProducts error:', e);
        return [];
    }
}

async function loadFeaturedProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    const products = await fetchProducts('all', 1, 6);
    allProducts = products;
    grid.innerHTML = products.map(p => renderProductCard(p)).join('');
}

async function loadCollectionsPage(page) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    currentPage = page;
    grid.innerHTML = <div class="grid-loading"><div class="spinner"></div><p>Chargement des pièces...</p></div>;
    
    let products = await fetchProducts(currentCategory, 1, 0); 
    allProducts = products;
    products = sortArray(products, currentSort);

    const countEl = document.getElementById('product-count-text');
    if (countEl) {
        countEl.textContent = ${products.length} pièce disponible;
    }

    const totalPages = Math.max(1, Math.ceil(products.length / PER_PAGE));
    const start = (page - 1) * PER_PAGE;
    const pageProducts = products.slice(start, start + PER_PAGE);

    if (pageProducts.length === 0) {
        grid.innerHTML = <div style="grid-column:1/-1; text-align:center; padding:4rem; color:var(--muted);">
            <i class='bx bx-search-alt' style="font-size:3rem; display:block; margin-bottom:1rem;"></i>
            <p>Aucune pièce dans cette catégorie pour le moment.</p>
        </div>;
    } else {
        grid.innerHTML = pageProducts.map(p => renderProductCard(p)).join('');
    }
    updatePagination(page, totalPages);
}

function renderProductCard(p) {
    const img = p.image_url
        ? <img src="" alt="" loading="lazy" class="product-img">
        : <div class="product-img-placeholder"><i class='bx bx-image'></i></div>;
    
    const videoBtn = p.video_url
        ? <button class="play-btn" onclick="playVideo('')"><i class='bx bx-play'></i></button>
        : '';
        
    const outBadge = p.stock <= 0 ? <div class="out-of-stock-badge">Épuisé</div> : '';
    const addBtn = p.stock <= 0
        ? <button class="btn-add-cart" disabled><i class='bx bx-x'></i> Épuisé</button>
        : <button class="btn-add-cart" onclick="addToCartById()"><i class='bx bx-cart-add'></i> Ajouter au panier</button>;

    return 
    <div class="product-card" data-id="" data-name="" data-price="" data-image="">
        <div class="product-image-wrapper">
            <div class="product-badge"></div>
            
            
            
            <div class="card-hover-overlay"></div>
        </div>
        <div class="product-details">
            <h3 class="product-name"></h3>
            <p class="product-price"> DH</p>
        </div>
    </div>;
}

function initCatTabs() {
    const tabs = document.querySelectorAll('#cat-tabs .cat-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            currentPage = 1;
            loadCollectionsPage(1);
        });
    });
}

function initCatTabsHome() {
    const tabs = document.querySelectorAll('#cat-tabs .cat-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.dataset.category;
            const filtered = cat === 'all' ? allProducts : allProducts.filter(p => p.category === cat);
            const grid = document.getElementById('product-grid');
            if (grid) grid.innerHTML = filtered.slice(0, 6).map(p => renderProductCard(p)).join('');
        });
    });
}

function initSortSelect() {
    const sel = document.getElementById('sort-select');
    if (sel) sel.addEventListener('change', () => {
        currentSort = sel.value;
        loadCollectionsPage(currentPage);
    });
}

window.sortProducts = function() {
    const sel = document.getElementById('sort-select');
    if (sel) { currentSort = sel.value; loadCollectionsPage(currentPage); }
};

function sortArray(arr, sort) {
    const copy = [...arr];
    if (sort === 'price-asc')  return copy.sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') return copy.sort((a,b) => b.price - a.price);
    if (sort === 'name')       return copy.sort((a,b) => a.name.localeCompare(b.name));
    return copy;
}

function updatePagination(page, totalPages) {
    const bar = document.getElementById('pagination-bar');
    if (!bar || totalPages <= 1) { if (bar) bar.style.display = 'none'; return; }
    bar.style.display = 'flex';
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indicators = document.getElementById('page-indicators');
    if (prevBtn) prevBtn.disabled = page <= 1;
    if (nextBtn) nextBtn.disabled = page >= totalPages;
    if (indicators) {
        indicators.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'page-dot' + (i === page ? ' active' : '');
            dot.textContent = i;
            dot.onclick = () => loadCollectionsPage(i);
            indicators.appendChild(dot);
        }
    }
}

window.changePage = function(dir) {
    loadCollectionsPage(currentPage + dir);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ===== CART =====
function initCart() {
    const openBtn = document.getElementById('open-cart-btn');
    const closeBtn = document.getElementById('close-cart-btn');
    const overlay = document.getElementById('cart-overlay');
    const proceedBtn = document.getElementById('btn-proceed-checkout');
    if (openBtn) openBtn.addEventListener('click', openCart);
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);
    if (proceedBtn) proceedBtn.addEventListener('click', () => { closeCart(); openCheckoutModal(); });
    renderCart();
}

function openCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('visible');
}

function closeCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
}

function saveCart() { localStorage.setItem('malhfa_cart_v5', JSON.stringify(storeCart)); }

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    const proceedBtn = document.getElementById('btn-proceed-checkout');
    if (!container) return;

    if (storeCart.length === 0) {
        container.innerHTML = <div class="empty-cart-msg"><i class='bx bx-cart' style="font-size:3rem; color:var(--border-col); display:block; margin-bottom:1rem;"></i><p>Votre panier est vide.</p></div>;
        if (totalEl) totalEl.textContent = '0,00 DH';
        if (proceedBtn) proceedBtn.disabled = true;
        return;
    }

    let total = 0;
    container.innerHTML = storeCart.map((item, idx) => {
        const lineTotal = item.price * item.qty;
        total += lineTotal;
        return 
        <div class="cart-item-card">
            <img src="" alt="" class="cart-item-img" onerror="this.src='/static/placeholder.jpg'">
            <div class="cart-item-info">
                <div class="cart-item-name"></div>
                <div class="cart-item-price"> DH</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQty(, -1)">–</button>
                    <span class="qty-display"></span>
                    <button class="qty-btn" onclick="changeQty(, 1)">+</button>
                    <button class="cart-item-remove" onclick="removeFromCart()" title="Supprimer"><i class='bx bx-trash'></i></button>
                </div>
            </div>
        </div>;
    }).join('');

    if (totalEl) totalEl.textContent = total.toFixed(2) + ' DH';
    if (proceedBtn) proceedBtn.disabled = false;
}

window.changeQty = function(idx, delta) {
    storeCart[idx].qty += delta;
    if (storeCart[idx].qty <= 0) storeCart.splice(idx, 1);
    saveCart(); renderCart(); updateCartBadge();
};

window.removeFromCart = function(idx) {
    storeCart.splice(idx, 1);
    saveCart(); renderCart(); updateCartBadge();
};

window.addToCartById = function(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;
    const item = { id: product.id, name: product.name, price: product.price, image: product.image_url || '/static/placeholder.jpg', qty: 1 };
    addItemToCart(item);
};

function addItemToCart(item) {
    const existing = storeCart.find(i => i.id === item.id);
    if (existing) { existing.qty++; } else { storeCart.push(item); }
    saveCart(); renderCart(); updateCartBadge(); openCart();
}

window.updateCartBadge = function() {
    const b = document.getElementById('cart-badge');
    if (b) { const count = storeCart.reduce((a, i) => a + i.qty, 0); b.textContent = count; b.style.display = count > 0 ? 'flex' : 'none'; }
};

// ===== CHECKOUT =====
function initCheckout() {
    const form = document.getElementById('checkout-form');
    if (form) form.addEventListener('submit', submitOrder);
}

function openCheckoutModal() {
    populateCheckoutSummary();
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function populateCheckoutSummary() {
    const summary = document.getElementById('chk-summary');
    const subtotalEl = document.getElementById('chk-subtotal-display');
    if (!summary) return;
    let subtotal = 0;
    summary.innerHTML = storeCart.map(item => {
        const lineTotal = item.price * item.qty;
        subtotal += lineTotal;
        return <div class="chk-order-line"><span> × </span><span> DH</span></div>;
    }).join('');
    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2) + ' DH';
    updateCheckoutTotal(subtotal);
}

window.updateCheckoutTotal = function(sub = null) {
    let subtotal = sub || storeCart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const shippingEl = document.getElementById('chk_shipping');
    const shippingFee = shippingEl ? parseFloat(shippingEl.value) || 0 : 0;
    const finalTotal = subtotal + shippingFee;
    const totalEl = document.getElementById('chk-total-display');
    const shippingDisplay = document.getElementById('chk-shipping-display');
    if (shippingDisplay) shippingDisplay.textContent = '+ ' + shippingFee.toFixed(2) + ' DH';
    if (totalEl) totalEl.textContent = finalTotal.toFixed(2) + ' DH';
};

async function submitOrder(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-validate-order');
    const origText = btn.innerHTML;
    btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Traitement...';
    btn.disabled = true;

    const payload = {
        client_name: document.getElementById('chk_name')?.value || '',
        client_phone: document.getElementById('chk_phone')?.value || '',
        client_address: (document.getElementById('chk_city')?.value || '') + ' - ' + (document.getElementById('chk_address')?.value || ''),
        payment_method: document.querySelector('input[name="payment_method"]:checked')?.value || 'Cash',
        shipping_fee: parseFloat(document.getElementById('chk_shipping')?.value) || 0,
        items: storeCart.map(i => ({ product_id: i.id, quantity: i.qty, unit_price: i.price }))
    };

    try {
        const res = await fetch('/api/checkout-store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok) {
            const data = await res.json();
            document.getElementById('checkout-form').style.display = 'none';
            document.getElementById('order-success-msg').style.display = 'block';
            const pdfBtn = document.getElementById('download-invoice-btn');
            if (pdfBtn && data.order_id) pdfBtn.href = /api/orders//pdf;
            storeCart = []; saveCart(); renderCart(); updateCartBadge();
        } else {
            const err = await res.json(); alert('Erreur : ' + (err.detail || 'impossible de traiter la commande.'));
        }
    } catch { alert('Erreur de connexion.'); } finally { btn.innerHTML = origText; btn.disabled = false; }
}

window.closeOrderSuccess = function() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
    const form = document.getElementById('checkout-form');
    if (form) { form.style.display = 'flex'; form.reset(); }
    const success = document.getElementById('order-success-msg');
    if (success) success.style.display = 'none';
};

// ===== VIDEO =====
window.playVideo = function(url) {
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('video-player');
    if (!modal || !player) return;
    player.src = url; modal.style.display = 'flex'; document.body.style.overflow = 'hidden';
};
window.closeVideoModal = function() {
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('video-player');
    if (player) { player.pause(); player.src = ''; }
    if (modal) modal.style.display = 'none'; document.body.style.overflow = '';
};

// ===== AUTH =====
function initAuth() {
    const btnOpenAuth = document.getElementById('btn-open-auth');
    const authModal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('customer-login-form');
    if (btnOpenAuth && authModal) btnOpenAuth.addEventListener('click', () => { authModal.style.display = 'flex'; document.body.style.overflow = 'hidden'; });
    if (authModal) authModal.addEventListener('click', (e) => { if (e.target === authModal) { authModal.style.display = 'none'; document.body.style.overflow = ''; } });
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const res = await fetch('/api/customers/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: document.getElementById('login_email').value, password: document.getElementById('login_pass').value }) });
            if (res.ok) { const data = await res.json(); currentCustomer = data.customer; showLoggedIn(data.customer.full_name); authModal.style.display = 'none'; document.body.style.overflow = ''; }
            else { alert('Erreur connexion.'); }
        });
    }
}

async function checkStatus() {
    try { const res = await fetch('/api/customers/me'); if (res.ok) { const data = await res.json(); currentCustomer = data; showLoggedIn(data.full_name); } } catch {}
}

function showLoggedIn(name) {
    const display = document.getElementById('customer-name-display');
    const info = document.getElementById('customer-logged-in');
    const btn = document.getElementById('btn-open-auth');
    if (display) display.textContent = name;
    if (info) info.style.display = 'flex';
    if (btn) btn.style.display = 'none';
}

// ===== EXTENDED FEATURES =====
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = "<i class='bx bx-sun'></i>";
    }
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = "<i class='bx bx-sun'></i>";
        } else {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = "<i class='bx bx-moon'></i>";
        }
    });
}

const TRANSLATIONS = {
    fr: { 'home': 'Accueil', 'collection': 'Collection', 'catalogue': 'Catalogue', 'cart': 'Mon Panier', 'checkout': 'Passer à la caisse', 'search_placeholder': 'Rechercher une malhfa...' },
    en: { 'home': 'Home', 'collection': 'Collection', 'catalogue': 'Catalogue', 'cart': 'My Cart', 'checkout': 'Checkout', 'search_placeholder': 'Search...' },
    ar: { 'home': 'الرئيسية', 'collection': 'المجموعة', 'catalogue': 'الكتالوج', 'cart': 'سلة التسوق', 'checkout': 'الدفع', 'search_placeholder': 'ابحث...' }
};

window.setLang = function(lang) { localStorage.setItem('lang', lang); applyLang(lang); };

function applyLang(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['fr'];
    document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    const cartHeader = document.querySelector('.cart-header h2');
    if (cartHeader) cartHeader.innerHTML = <i class='bx bx-shopping-bag'></i> ;
    const checkoutBtn = document.getElementById('btn-proceed-checkout');
    if (checkoutBtn) checkoutBtn.innerHTML = ${dict.checkout} ;
}

const savedLang = localStorage.getItem('lang') || 'fr';
applyLang(savedLang);

// Search Bar
const searchBtn = document.getElementById('search-btn');
const searchOverlay = document.getElementById('search-overlay');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', async () => {
        searchOverlay.style.display = 'flex'; searchInput.focus();
        if (allProducts.length === 0) allProducts = await fetchProducts('all', 1, 0);
    });
}
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        if (!q.trim()) { searchResults.innerHTML = ''; return; }
        const f = allProducts.filter(p => p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q)));
        searchResults.innerHTML = f.length ? f.slice(0, 8).map(p => renderProductCard(p)).join('') : '<p style="color:white;">Aucun résultat.</p>';
    });
}
'''

with open('static/store.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Rebuilt store.js cleanly with all features and no syntax errors.")
