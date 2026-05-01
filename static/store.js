/* ============================================================
   MALHAFTI DESIGN — Unified Store JS (Final Stable)
   ============================================================ */

// ===== STATE =====
let storeCart       = JSON.parse(localStorage.getItem('malhfa_cart_v5')) || [];
let allProducts     = [];
let currentPage     = 1;
const PER_PAGE      = 12;
let currentCategory = 'all';
let currentSort     = 'default';
let currentCustomer = null;
let currentQuery    = '';
let currentLang     = localStorage.getItem('malhfa_lang_v1') || 'fr';
let storeFavorites  = JSON.parse(localStorage.getItem('malhfa_favs_v1')) || [];

const TRANSLATIONS = {
    fr: {
        accueil: "Accueil", collection: "Collection", catalogue: "Catalogue", histoire: "Notre Histoire", contact: "Contact",
        panier: "Mon Panier", commander: "Passer à la caisse", vide: "Votre panier est vide.",
        hero_title: "L’art du Sahara, <br>à portée de clic",
        hero_desc: "Découvrez des malhafas authentiques, élégantes et modernes.<br>Choisissez votre style parmi des pièces uniques et raffinées.",
        collection_title: "Pièces choisies, <em>façonnées</em> avec patience.",
        btn_histo: "Notre Histoire —", btn_discover: "Découvrir nos créations —",
        cat_tout: "Tout", cat_nouveautés: "Nouveautés", cat_luxe: "Édition Luxe", cat_tradition: "Tradition", fav_tab: "Favoris",
        fav_empty: "Vous n'avez pas encore de favoris.", 
        heritage_label: "— NOTRE HÉRITAGE",
        heritage_title: "Mille secrets se cachent <br>dans le <em>désert</em>… et la malhafa les raconte.",
        heritage_p1: "Ce n’est pas simplement un vêtement, mais une histoire qui s’enroule autour du corps, portant le parfum du passé et l’élégance de la femme sahraouie. Quatre mètres de beauté, tissés par des mains expertes et transmis de génération en génération.",
        heritage_p2: "Chez MALHAFTI Design, nous vous apportons l’authenticité du désert directement de Dakhla, Laâyoune et Smara, où les artisanes créent des pièces uniques, chacune portant une âme et une histoire incomparable. Portez-la… et vivez l’histoire.",
        sf_label: "— SAVOIR-FAIRE",
        sf_title: "Trois gestes, <em>une tradition.</em>",
        sf1_t: "La sélection", sf1_p: "Nous choisissons avec soin les plus beaux tissus au cœur du désert, où le goût rencontre l’authenticité.",
        sf2_t: "Le savoir-faire", sf2_p: "Chaque malhafa est tissée à la main par des mains expertes, alliant précision des détails et richesse du patrimoine.",
        sf3_t: "La signature", sf3_p: "Votre pièce est unique… signée, authentifiée, et porte une empreinte inimitable.",
        news_label: "NEWSLETTER", news_title: "Abonnez-vous pour recevoir nos actualités.", news_btn: "S'INSCRIRE",
        footer_help: "Aide & Service", footer_shipping: "Livraison & Retours", footer_care: "Entretien du tissu", footer_how: "Comment commander",
        footer_loc: "<i class='bx bx-map'></i> Laâyoune, Maroc", footer_tag: "L'élégance sahraouie dans chaque fil.",
        prev: "<i class='bx bx-chevron-left'></i> Précédent", next: "Suivant <i class='bx bx-chevron-right'></i>",
        copyright: "© 2025 MALHAFTI DESIGN — Tous droits réservés — Sahara Marocain",
        search_placeholder: "Rechercher une malhfa...", email_placeholder: "votre@email.com",
        btn_custom: "Personnaliser", btn_collection: "Découvrir la Collection", search: "Rechercher", dark_mode: "Mode Sombre", account: "Mon compte",
        already_customer: "Déjà client ?",
        subtotal: "Sous-total", shipping_note: "Livraison calculée à la commande",
        login: "Connexion", register: "Inscription", full_name: "Nom complet", pass: "Mot de passe",
        shipping: "Livraison", payment: "Paiement", cash: "Paiement à la livraison", card: "Carte Bancaire",
        shipping_fee: "Frais de livraison", total: "Total Commande", city: "Ville", phone: "Téléphone", address: "Adresse",
        processing: "Traitement sécurisé...", add_to_cart: "Ajouter au panier",
        found_products: "{n} produits trouvés"
    },
    en: {
        accueil: "Home", collection: "Collection", catalogue: "Catalogue", histoire: "Our History", contact: "Contact",
        panier: "My Cart", commander: "Proceed to Checkout", vide: "Your cart is empty.",
        hero_title: "The Art of Sahara, <br>just a click away",
        hero_desc: "Discover authentic, elegant, and modern malhafas.<br>Choose your style from unique and refined pieces.",
        collection_title: "Chosen pieces, <em>crafted</em> with patience.",
        btn_histo: "Our Story —", btn_discover: "Discover our creations —",
        cat_tout: "All", cat_nouveautés: "New Arrivals", cat_luxe: "Luxury Edition", cat_tradition: "Tradition", fav_tab: "Favorites",
        fav_empty: "You don't have any favorites yet.",
        heritage_label: "— OUR HERITAGE",
        heritage_title: "A thousand secrets hidden <br>in the <em>desert</em>… and the malhafa tells them.",
        heritage_p1: "It is not just a garment, but a story that wraps around the body, carrying the scent of the past and the elegance of the Sahrawi woman. Four meters of beauty, woven by expert hands and passed down through generations.",
        heritage_p2: "At MALHAFTI Design, we bring you the authenticity of the desert directly from Dakhla, Laayoune, and Smara, where artisans create unique pieces, each carrying an incomparable soul and story. Wear it… and live the story.",
        sf_label: "— SAVOIR-FAIRE",
        sf_title: "Three gestures, <em>one tradition.</em>",
        sf1_t: "Selection", sf1_p: "We carefully choose the finest fabrics in the heart of the desert, where taste meets authenticity.",
        sf2_t: "Savoir-faire", sf2_p: "Each malhafa is hand-woven by expert hands, combining precision of detail with the richness of heritage.",
        sf3_t: "Signature", sf3_p: "Your piece is unique… signed, authenticated, and carries an inimitable mark.",
        news_label: "NEWSLETTER", news_title: "Subscribe to receive our latest news.", news_btn: "SUBSCRIBE",
        footer_help: "Help & Service", footer_shipping: "Shipping & Returns", footer_care: "Fabric Care", footer_how: "How to Order",
        footer_loc: "<i class='bx bx-map'></i> Laayoune, Morocco", footer_tag: "Sahrawi elegance in every thread.",
        prev: "<i class='bx bx-chevron-left'></i> Previous", next: "Next <i class='bx bx-chevron-right'></i>",
        copyright: "© 2025 MALHAFTI DESIGN — All rights reserved — Moroccan Sahara",
        search_placeholder: "Search for a malhfa...", email_placeholder: "your@email.com",
        btn_custom: "Customize", btn_collection: "Discover Collection", search: "Search", dark_mode: "Dark Mode", account: "My Account",
        already_customer: "Already a customer?",
        subtotal: "Subtotal", shipping_note: "Shipping calculated at checkout",
        login: "Login", register: "Register", full_name: "Full Name", pass: "Password",
        shipping: "Shipping", payment: "Payment", cash: "Cash on Delivery", card: "Credit Card",
        shipping_fee: "Shipping Fee", total: "Total Order", city: "City", phone: "Phone", address: "Address",
        processing: "Secure processing...", add_to_cart: "Add to Cart",
        found_products: "{n} products found"
    },
    ar: {
        accueil: "الرئيسية", collection: "التشكيلة", catalogue: "الكتالوج", histoire: "قصتنا", contact: "اتصل بنا",
        panier: "سلة التسوق", commander: "إتمام الطلب", vide: "سلة التسوق فارغة.",
        hero_title: "فن الصحراء، <br>بنقرة واحدة",
        hero_desc: "اكتشفوا الملحفة الأصلية، الأنيقة والحديثة.<br>اختاروا أسلوبكم من بين قطع فريدة وراقية.",
        collection_title: "قطع مختارة، <em>صيغت</em> بصبر.",
        btn_histo: "قصتنا —", btn_discover: "اكتشفوا إبداعاتنا —",
        cat_tout: "الكل", cat_nouveautés: "وصل حديثاً", cat_luxe: "إصدار فاخر", cat_tradition: "تقليدي", fav_tab: "المفضلة",
        fav_empty: "ليس لديك أي مفضلات حتى الآن.",
        heritage_label: "— تراثنا",
        heritage_title: "ألف سر يختبئ <br>في <em>الصحراء</em>... والملحفة تحكيها.",
        heritage_p1: "ليست مجرد ثوب، بل قصة تلتف حول الجسد، تحمل عبق الماضي وأناقة المرأة الصحراوية. أربعة أمتار من الجمال، نسجتها أيادٍ خبيرة وتوارثتها الأجيال.",
        heritage_p2: "في MALHAFTI Design، ننقل إليكم أصالة الصحراء مباشرة من الداخلة والعيون والسمارة، حيث تبدع الحرفيات قطعاً فريدة، كل واحدة منها تحمل روحاً وقصة لا تضاهى. ارتديها... وعيشي الحكاية.",
        sf_label: "— المهارة التقليدية",
        sf_title: "ثلاث حركات، <em>تقليد واحد.</em>",
        sf1_t: "الاختيار", sf1_p: "نختار بعناية أجمل الأقمشة من قلب الصحراء، حيث يلتقي الذوق بالأصالة.",
        sf2_t: "المهارة التقليدية", sf2_p: "كل ملحفة منسوجة يدوياً بأيدٍ خبيرة، تجمع بين دقة التفاصيل وغنى التراث.",
        sf3_t: "التوقيع", sf3_p: "قطعتك فريدة... موقعة، موثقة، وتحمل بصمة لا تضاهى.",
        news_label: "النشرة الإخبارية", news_title: "اشترك في النشرة الإخبارية ليصلك كل جديد", news_btn: "اشتراك",
        footer_help: "المساعدة والخدمة", footer_shipping: "الشحن والإرجاع", footer_care: "العناية بالأقمشة", footer_how: "كيفية الطلب",
        footer_loc: "<i class='bx bx-map'></i> العيون، المغرب", footer_tag: "الأناقة الصحراوية في كل خيط.",
        prev: "السابق <i class='bx bx-chevron-left'></i>", next: "<i class='bx bx-chevron-right'></i> التالي",
        copyright: "© 2025 MALHAFTI DESIGN — جميع الحقوق محفوظة — الصحراء المغربية",
        search_placeholder: "ابحث عن ملحفة...", email_placeholder: "بريدك@الإلكتروني.com",
        btn_custom: "تخصيص", search: "بحث", dark_mode: "الوضع الليلي", account: "حسابي",
        already_customer: "هل لديك حساب بالفعل؟",
        subtotal: "المجموع الفرعي", shipping_note: "الشحن يُحسب عند الطلب",
        login: "تسجيل الدخول", register: "إنشاء حساب", full_name: "الاسم الكامل", pass: "كلمة المرور",
        shipping: "طريقة الشحن", payment: "طريقة الدفع", cash: "الدفع عند الاستلام", card: "بطاقة بنكية",
        shipping_fee: "رسوم الشحن", total: "المجموع الكلي", city: "المدينة", phone: "الهاتف", address: "العنوان الكامل",
        processing: "معالجة آمنة...", add_to_cart: "أضف إلى السلة",
        found_products: "تم العثور على {n} منتجات"
    }
};

// ===== CORE ACTIONS =====
window.setLang = function(lang) {
    currentLang = lang;
    localStorage.setItem('malhfa_lang_v1', lang);
    applyLang(lang);
    if (window.IS_COLLECTIONS_PAGE) loadCollectionsPage(1);
    else { loadFeaturedProducts(); initCatTabsHome(); }
};

window.toggleFavorite = function(id, btn) {
    const idx = storeFavorites.indexOf(id);
    if (idx === -1) {
        storeFavorites.push(id);
        btn.classList.add('active');
        btn.querySelector('i').classList.replace('bx-heart', 'bxs-heart');
    } else {
        storeFavorites.splice(idx, 1);
        btn.classList.remove('active');
        btn.querySelector('i').classList.replace('bxs-heart', 'bx-heart');
    }
    localStorage.setItem('malhfa_favs_v1', JSON.stringify(storeFavorites));
    if (currentCategory === 'favorites') {
        if (window.IS_COLLECTIONS_PAGE) loadCollectionsPage(1);
        else filterFavorites();
    }
};

window.addToCartById = function(id) {
    const p = allProducts.find(x => x.id === id);
    if (!p) return;
    const item = { id: p.id, name: p.name, price: p.discount_price || p.price, image: p.image_url || '/static/placeholder.jpg', qty: 1 };
    const existing = storeCart.find(x => x.id === id);
    if (existing) existing.qty++;
    else storeCart.push(item);
    saveCart(); renderCart(); updateCartBadge(); openCart();
};

window.saveCart = function() { localStorage.setItem('malhfa_cart_v5', JSON.stringify(storeCart)); };

window.logoutCustomer = function() {
    localStorage.removeItem('malhfa_customer_v1');
    localStorage.removeItem('malhfa_cart_v5');
    window.location.href = '/store/logout';
};

// ===== LOGIC =====
function applyLang(lang) {
    const t = TRANSLATIONS[lang];
    if (!t) return;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', lang === 'ar');
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.dataset.t;
        if (t[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                el.innerHTML = t[key];
            }
        }
        // Handle title translation separately if data-t-title exists
        const titleKey = el.dataset.tTitle;
        if (titleKey && t[titleKey]) {
            el.title = t[titleKey];
        }
    });
}

async function fetchProducts(category = 'all', page = 1) {
    try {
        let url = `/api/products?page=${page}`;
        if (category !== 'all' && category !== 'favorites') url += `&category=${encodeURIComponent(category)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('API Error');
        return await res.json();
    } catch (e) { console.error(e); return []; }
}

function renderProductCard(p) {
    const isFav = storeFavorites.includes(p.id);
    const heartIcon = isFav ? 'bxs-heart' : 'bx-heart';
    const favActive = isFav ? 'active' : '';
    const img = p.image_url ? `<img src="${p.image_url}" alt="${escHtml(p.name)}" class="product-img" onclick="openProductModal(${p.id})">` : `<div class="product-img-placeholder" onclick="openProductModal(${p.id})"><i class='bx bx-image'></i></div>`;
    
    let priceHtml = `<p class="product-price">${p.price.toFixed(2)} DH</p>`;
    let saleBadge = '';
    if (p.discount_price && p.discount_price < p.price) {
        saleBadge = `<div class="product-badge sale">PROMO</div>`;
        priceHtml = `<p class="product-price"><span class="old-price">${p.price.toFixed(2)} DH</span> <span class="sale-price">${p.discount_price.toFixed(2)} DH</span></p>`;
    }
    const addBtn = p.stock <= 0 ? `<button class="btn-add-cart" disabled>Épuisé</button>` : `<button class="btn-add-cart" onclick="addToCartById(${p.id})">Ajouter au panier</button>`;

    return `
    <div class="product-card" data-id="${p.id}">
        <div class="product-image-wrapper">
            <div class="product-badge">${escHtml(p.category)}</div>
            ${saleBadge}
            <button class="fav-btn ${favActive}" onclick="toggleFavorite(${p.id}, this); event.stopPropagation();">
                <i class='bx ${heartIcon}'></i>
            </button>
            ${img}
            <div class="card-hover-overlay">${addBtn}</div>
        </div>
        <div class="product-details">
            <h3 class="product-name" onclick="openProductModal(${p.id})">${escHtml(p.name)}</h3>
            ${priceHtml}
        </div>
    </div>`;
}

window.openProductModal = function(id) {
    const p = allProducts.find(x => x.id === id);
    if (!p) return;
    
    const m = document.getElementById('product-modal');
    if (!m) return;

    document.getElementById('modal-img').src = p.image_url || '/static/placeholder.jpg';
    document.getElementById('modal-name').textContent = p.name;
    document.getElementById('modal-cat').textContent = p.category;
    document.getElementById('modal-desc').textContent = p.description || (currentLang === 'ar' ? "لا يوجد وصف متاح لهذا المنتج الاستثنائي." : "Aucune description disponible pour ce produit d'exception.");
    
    let priceHtml = `${p.price.toFixed(2)} DH`;
    if (p.discount_price && p.discount_price < p.price) {
        priceHtml = `<span style="text-decoration:line-through; font-size:0.8em; opacity:0.6;">${p.price.toFixed(2)} DH</span> ${p.discount_price.toFixed(2)} DH`;
    }
    document.getElementById('modal-price').innerHTML = priceHtml;
    
    const addBtn = document.getElementById('modal-add-btn');
    if (p.stock <= 0) {
        addBtn.disabled = true;
        addBtn.innerHTML = currentLang === 'ar' ? "نفذت الكمية" : "Épuisé";
    } else {
        addBtn.disabled = false;
        addBtn.onclick = () => { addToCartById(p.id); closeProductModal(); };
        addBtn.innerHTML = TRANSLATIONS[currentLang].add_to_cart || "Ajouter au panier";
    }
    
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Stop scroll
};

window.closeProductModal = function() {
    const m = document.getElementById('product-modal');
    if (m) m.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scroll
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initCart();
    updateCartBadge();
    applyLang(currentLang);

    if (window.IS_COLLECTIONS_PAGE) {
        initCatTabs();
        loadCollectionsPage(1);
    } else {
        initCatTabsHome();
        loadFeaturedProducts();
    }

    // Handle Stripe Redirects
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success')) {
        storeCart = [];
        saveCart();
        updateCartBadge();
        const modal = document.getElementById('checkout-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.getElementById('checkout-form').style.display = 'none';
            document.getElementById('order-success-msg').style.display = 'block';
        }
        window.history.replaceState({}, document.title, "/");
    }
    if (urlParams.get('cancel')) {
        alert("Paiement annulé.");
        window.history.replaceState({}, document.title, "/");
    }
    // Check Auth State
    checkAuthState();
});

async function checkAuthState() {
    try {
        const res = await fetch('/api/customers/me');
        if (res.ok) {
            const customer = await res.json();
            currentCustomer = customer;
            updateAuthUI(customer);
        } else {
            localStorage.removeItem('malhfa_customer_v1');
            updateAuthUI(null);
        }
    } catch (e) {
        // Not logged in or network error
        const saved = localStorage.getItem('malhfa_customer_v1');
        if (saved) {
            currentCustomer = JSON.parse(saved);
            updateAuthUI(currentCustomer);
        }
    }
}

function updateAuthUI(customer) {
    const loggedInDiv = document.getElementById('customer-logged-in');
    const authBtn = document.getElementById('btn-open-auth');
    const nameDisplay = document.getElementById('customer-name-display');
    
    if (customer) {
        if (loggedInDiv) loggedInDiv.style.display = 'flex';
        if (authBtn) authBtn.style.display = 'none';
        if (nameDisplay) nameDisplay.textContent = customer.full_name;
        
        // Pre-fill checkout form
        const chkName = document.getElementById('chk_name');
        const chkPhone = document.getElementById('chk_phone');
        const chkAddress = document.getElementById('chk_address');
        if (chkName && !chkName.value) chkName.value = customer.full_name;
        if (chkPhone && !chkPhone.value) chkPhone.value = customer.phone || "";
        if (chkAddress && !chkAddress.value) chkAddress.value = customer.address || "";
    } else {
        if (loggedInDiv) loggedInDiv.style.display = 'none';
        if (authBtn) authBtn.style.display = 'block';
    }
}

function initNavbar() {
    const ham = document.getElementById('hamburger-btn');
    const mob = document.getElementById('mobile-nav');
    if (ham && mob) ham.onclick = () => { ham.classList.toggle('open'); mob.classList.toggle('open'); };

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.onclick = () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('malhfa_theme', isDark ? 'dark' : 'light');
            themeBtn.querySelector('i').className = isDark ? 'bx bx-sun' : 'bx bx-moon';
        };
        // Load saved theme
        if (localStorage.getItem('malhfa_theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeBtn.querySelector('i').className = 'bx bx-sun';
        }
    }

    // Auth Modal
    const authBtn = document.getElementById('btn-open-auth');
    const authModal = document.getElementById('auth-modal');
    if (authBtn && authModal) {
        authBtn.onclick = () => authModal.style.display = 'flex';
    }

    // Search Overlay
    const searchBtn = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearch = document.getElementById('close-search');
    if (searchBtn && searchOverlay) {
        searchBtn.onclick = () => {
            searchOverlay.style.display = 'flex';
            document.getElementById('search-input')?.focus();
        };
    }
    if (closeSearch && searchOverlay) {
        closeSearch.onclick = () => searchOverlay.style.display = 'none';
    }

    // Login Form
    const loginForm = document.getElementById('customer-login-form');
    if (loginForm) loginForm.onsubmit = handleLoginSubmit;

    // Register Form
    const registerForm = document.getElementById('customer-register-form');
    if (registerForm) registerForm.onsubmit = handleRegisterSubmit;

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.onsubmit = (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletter-email').value;
            alert(currentLang === 'ar' ? "سعداء بانضمامكم إلينا!" : "Nous sommes ravis de vous compter parmi nous !");
            newsletterForm.reset();
        };
    }
}

async function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('login_email').value;
    const pass = document.getElementById('login_pass').value;
    
    try {
        const res = await fetch('/api/customers/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json();
        if (res.ok) {
            currentCustomer = data.customer;
            localStorage.setItem('malhfa_customer_v1', JSON.stringify(data.customer));
            updateAuthUI(data.customer);
            document.getElementById('auth-modal').style.display = 'none';
            alert(currentLang === 'ar' ? "تم تسجيل الدخول بنجاح" : "Connexion réussie !");
        } else {
            alert(data.detail || "Erreur de connexion");
        }
    } catch (err) {
        alert("Erreur serveur");
    }
}

async function handleRegisterSubmit(e) {
    e.preventDefault();
    const payload = {
        full_name: document.getElementById('reg_name').value,
        email: document.getElementById('reg_email').value,
        phone: document.getElementById('reg_phone').value,
        password: document.getElementById('reg_pass').value,
        address: "" // Optional
    };
    
    try {
        const res = await fetch('/api/customers/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            alert(currentLang === 'ar' ? "تم إنشاء الحساب بنجاح، يمكنك الآن تسجيل الدخول" : "Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
            switchAuthTab('login');
        } else {
            alert(data.detail || "Erreur lors de l'inscription");
        }
    } catch (err) {
        alert("Erreur serveur");
    }
}

function initCart() {
    const btn = document.getElementById('open-cart-btn');
    const close = document.getElementById('close-cart-btn');
    if (btn) btn.onclick = openCart;
    if (close) close.onclick = closeCart;
    
    const proceedBtn = document.getElementById('btn-proceed-checkout');
    if (proceedBtn) {
        proceedBtn.onclick = () => {
            closeCart();
            const modal = document.getElementById('checkout-modal');
            if (modal) {
                modal.style.display = 'flex';
                updateCheckoutTotal();
            }
        };
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.onsubmit = handleCheckoutSubmit;
    }

    // Toggle card info
    const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
    paymentRadios.forEach(r => {
        r.onchange = () => {
            const cardInfo = document.getElementById('card-info-section');
            if (cardInfo) cardInfo.style.display = r.value === 'Carte' ? 'block' : 'none';
        };
    });

    renderCart();
}

function openCart() { document.getElementById('cart-sidebar')?.classList.add('open'); document.getElementById('cart-overlay')?.classList.add('visible'); }
function closeCart() { document.getElementById('cart-sidebar')?.classList.remove('open'); document.getElementById('cart-overlay')?.classList.remove('visible'); }
function updateCartBadge() { const b = document.getElementById('cart-badge'); if (b) { const n = storeCart.reduce((a,i)=>a+i.qty,0); b.textContent = n; b.style.display = n>0?'flex':'none'; } }

function renderCart() {
    const c = document.getElementById('cart-items-container');
    const proceedBtn = document.getElementById('btn-proceed-checkout');
    if (!c) return;
    
    if (storeCart.length === 0) {
        c.innerHTML = '<p class="empty-cart-msg" data-t="vide">Votre panier est vide.</p>';
        if (proceedBtn) proceedBtn.disabled = true;
        return;
    }
    
    if (proceedBtn) proceedBtn.disabled = false;
    
    c.innerHTML = storeCart.map((item, idx) => `
        <div class="cart-item-card">
            <img src="${item.image}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-name">${escHtml(item.name)}</div>
                <div class="cart-item-price">${item.price.toFixed(2)} DH</div>
                <div class="cart-item-controls">
                    <button onclick="changeQty(${idx},-1)">–</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${idx},1)">+</button>
                    <button onclick="removeFromCart(${idx})"><i class='bx bx-trash'></i></button>
                </div>
            </div>
        </div>`).join('');
    
    const total = storeCart.reduce((a,i)=>a+(i.price*i.qty),0);
    const tel = document.getElementById('cart-total-price');
    if (tel) tel.textContent = total.toFixed(2) + ' DH';
}

window.updateCheckoutTotal = function() {
    const sub = storeCart.reduce((a,i)=>a+(i.price*i.qty),0);
    const ship = parseFloat(document.getElementById('chk_shipping')?.value || 0);
    const total = sub + ship;
    
    if (document.getElementById('chk-subtotal-display')) document.getElementById('chk-subtotal-display').textContent = sub.toFixed(2) + ' DH';
    if (document.getElementById('chk-shipping-display')) document.getElementById('chk-shipping-display').textContent = '+ ' + ship.toFixed(2) + ' DH';
    if (document.getElementById('chk-total-display')) document.getElementById('chk-total-display').textContent = total.toFixed(2) + ' DH';
};

async function handleCheckoutSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-validate-order');
    const method = document.querySelector('input[name="payment_method"]:checked')?.value;
    
    if (method === 'Carte') {
        // Real Stripe Integration
        const stripePayload = {
            ...payload,
            success_url: window.location.origin + '/?success=true',
            cancel_url: window.location.origin + '/?cancel=true'
        };

        try {
            const res = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(stripePayload)
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe
                return;
            } else {
                throw new Error("Stripe session failed");
            }
        } catch (err) {
            alert("Erreur Stripe: " + err.message);
            return;
        }
    }

    const payload = {
        client_name: document.getElementById('chk_name').value,
        client_phone: document.getElementById('chk_phone').value,
        client_address: document.getElementById('chk_address').value,
        payment_method: method,
        shipping_fee: parseFloat(document.getElementById('chk_shipping').value),
        items: storeCart.map(i => ({ product_id: i.id, quantity: i.qty, unit_price: i.price }))
    };

    try {
        const res = await fetch('/api/checkout-store', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'ok') {
            // Success!
            document.getElementById('checkout-form').style.display = 'none';
            document.getElementById('order-success-msg').style.display = 'block';
            const invBtn = document.getElementById('download-invoice-btn');
            if (invBtn) invBtn.href = `/api/orders/${data.order_id}/pdf`;
            
            // Clear cart
            storeCart = [];
            saveCart();
            renderCart();
            updateCartBadge();
        }
    } catch (err) {
        alert("Erreur lors de la commande. Veuillez réessayer.");
    }
}

window.closeOrderSuccess = function() {
    document.getElementById('checkout-modal').style.display = 'none';
    // Reset form for next time
    document.getElementById('checkout-form').style.display = 'block';
    document.getElementById('order-success-msg').style.display = 'none';
};

window.changeQty = (idx,d) => { storeCart[idx].qty+=d; if (storeCart[idx].qty<=0) storeCart.splice(idx,1); saveCart(); renderCart(); updateCartBadge(); };
window.removeFromCart = (idx) => { storeCart.splice(idx,1); saveCart(); renderCart(); updateCartBadge(); };

async function loadFeaturedProducts() {
    const g = document.getElementById('product-grid');
    if (!g) return;
    const products = await fetchProducts('all', 1);
    allProducts = products;
    g.innerHTML = products.slice(0,6).map(p => renderProductCard(p)).join('');
}

async function loadCollectionsPage(page) {
    const g = document.getElementById('product-grid');
    const countEl = document.getElementById('product-count-text');
    if (!g) return;
    
    currentPage = page;
    g.innerHTML = '<div class="spinner"></div>';
    
    let products = await fetchProducts(currentCategory === 'favorites' ? 'all' : currentCategory, 1);
    allProducts = products;
    
    if (currentCategory === 'favorites') {
        products = products.filter(p => storeFavorites.includes(p.id));
    }
    
    // Apply Sort
    if (currentSort === 'price-asc') products.sort((a,b) => (a.discount_price || a.price) - (b.discount_price || b.price));
    else if (currentSort === 'price-desc') products.sort((a,b) => (b.discount_price || b.price) - (a.discount_price || a.price));
    else if (currentSort === 'name') products.sort((a,b) => a.name.localeCompare(b.name));
    
    // Pagination (Frontend)
    const total = products.length;
    const start = (page - 1) * PER_PAGE;
    const paginated = products.slice(start, start + PER_PAGE);
    
    // Update count text
    if (countEl) {
        let t = TRANSLATIONS[currentLang].found_products || "{n} produits trouvés";
        countEl.textContent = t.replace("{n}", total);
    }
    
    // Update Pagination Bar
    updatePagination(total, page);
    
    if (paginated.length === 0) {
        g.innerHTML = '<p style="text-align:center; padding:3rem; width:100%;" data-t="fav_empty">Aucun produit trouvé.</p>';
    } else {
        g.innerHTML = paginated.map(p => renderProductCard(p)).join('');
    }
}

window.sortProducts = function() {
    const sel = document.getElementById('sort-select');
    if (sel) currentSort = sel.value;
    loadCollectionsPage(1);
};

window.changePage = function(delta) {
    currentPage += delta;
    loadCollectionsPage(currentPage);
};

function updatePagination(total, page) {
    const prev = document.getElementById('prev-btn');
    const next = document.getElementById('next-btn');
    const indicators = document.getElementById('page-indicators');
    if (!prev || !next || !indicators) return;
    
    const maxPage = Math.ceil(total / PER_PAGE) || 1;
    prev.disabled = (page <= 1);
    next.disabled = (page >= maxPage);
    
    indicators.innerHTML = `<span>Page ${page} / ${maxPage}</span>`;
}

function initCatTabsHome() {
    const tabs = document.querySelectorAll('#cat-tabs .cat-tab');
    tabs.forEach(tab => tab.onclick = () => {
        tabs.forEach(t=>t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.category;
        currentCategory = cat;
        if (cat === 'favorites') filterFavorites();
        else {
            const filtered = cat === 'all' ? allProducts : allProducts.filter(p => p.category === cat);
            const g = document.getElementById('product-grid');
            if (g) g.innerHTML = filtered.slice(0,6).map(p => renderProductCard(p)).join('');
        }
    });
}

function initCatTabs() {
    const tabs = document.querySelectorAll('#cat-tabs .cat-tab');
    tabs.forEach(tab => tab.onclick = () => {
        tabs.forEach(t=>t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.dataset.category;
        loadCollectionsPage(1);
    });
}

window.filterFavorites = function() {
    const g = document.getElementById('product-grid');
    if (!g) return;
    const favs = allProducts.filter(p => storeFavorites.includes(p.id));
    if (favs.length === 0) g.innerHTML = '<p style="text-align:center; padding:3rem;">Aucun favori.</p>';
    else g.innerHTML = favs.map(p => renderProductCard(p)).join('');
};

function escHtml(s) { if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

window.switchAuthTab = function(type) {
    const loginForm = document.getElementById('customer-login-form');
    const registerForm = document.getElementById('customer-register-form');
    const loginBtn = document.getElementById('tab-login-btn');
    const registerBtn = document.getElementById('tab-register-btn');
    
    if (type === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginBtn.classList.remove('active');
        registerBtn.classList.add('active');
    }
};

window.handleSearch = function(query) {
    const resultsGrid = document.getElementById('search-results');
    if (!resultsGrid) return;
    if (!query || query.length < 2) { resultsGrid.innerHTML = ''; return; }
    
    const q = query.toLowerCase();
    const results = allProducts.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
    
    if (results.length === 0) {
        resultsGrid.innerHTML = '<p style="color:white; text-align:center; width:100%; padding:2rem;">Aucun résultat trouvé pour "' + escHtml(query) + '"</p>';
    } else {
        resultsGrid.innerHTML = results.map(p => renderProductCard(p)).join('');
    }
};

// Also handle the search bar directly in the catalogue page
document.addEventListener('input', (e) => {
    if (e.target.id === 'catalogue-search-input') {
        const query = e.target.value.toLowerCase();
        const g = document.getElementById('product-grid');
        if (!g) return;
        
        if (!query) { loadCollectionsPage(1); return; }
        
        const results = allProducts.filter(p => 
            (p.name && p.name.toLowerCase().includes(query)) || 
            (p.category && p.category.toLowerCase().includes(query))
        );
        
        if (results.length === 0) {
            g.innerHTML = '<p style="text-align:center; padding:3rem; width:100%;">Aucun produit ne correspond à votre recherche.</p>';
        } else {
            g.innerHTML = results.map(p => renderProductCard(p)).join('');
        }
    }
});
