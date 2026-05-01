import json

def restore_js():
    with open('static/store.js', 'r', encoding='iso-8859-1') as f:
        content = f.read()
    
    parts = content.split('// ===== EXTENDED FEATURES')
    clean_base = parts[0]
    
    extended_features = '''
// ===== EXTENDED FEATURES (Dark Mode, Lang, Search) =====

// 1. Dark Mode Toggle
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

// 2. Translations
const TRANSLATIONS = {
    fr: {
        'home': 'Accueil',
        'collection': 'Collection',
        'catalogue': 'Catalogue',
        'history': 'Notre Histoire',
        'contact': 'Contact',
        'cart': 'Mon Panier',
        'checkout': 'Passer à la caisse',
        'login': 'Connexion',
        'register': 'Inscription',
        'search_placeholder': 'Rechercher une malhfa...'
    },
    en: {
        'home': 'Home',
        'collection': 'Collection',
        'catalogue': 'Catalogue',
        'history': 'Our Story',
        'contact': 'Contact',
        'cart': 'My Cart',
        'checkout': 'Checkout',
        'login': 'Login',
        'register': 'Register',
        'search_placeholder': 'Search for a malhfa...'
    },
    ar: {
        'home': 'الرئيسية',
        'collection': 'المجموعة',
        'catalogue': 'الكتالوج',
        'history': 'قصتنا',
        'contact': 'اتصل بنا',
        'cart': 'سلة التسوق',
        'checkout': 'الدفع',
        'login': 'دخول',
        'register': 'تسجيل',
        'search_placeholder': 'ابحث عن ملحفة...'
    }
};

window.setLang = function(lang) {
    localStorage.setItem('lang', lang);
    applyLang(lang);
};

function applyLang(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['fr'];
    
    if (lang === 'ar') {
        document.body.setAttribute('dir', 'rtl');
    } else {
        document.body.removeAttribute('dir');
    }
    
    const translateMap = {
        '.nav-links a:nth-child(1)': dict.home,
        '.nav-links a:nth-child(2)': dict.collection,
        '.nav-links a:nth-child(3)': dict.catalogue,
        '.nav-links a:nth-child(4)': dict.history,
        '.nav-links a:nth-child(5)': dict.contact,
        '#tab-login-btn': dict.login,
        '#tab-register-btn': dict.register,
    };

    for (let selector in translateMap) {
        const el = document.querySelector(selector);
        if (el) el.textContent = translateMap[selector];
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = dict.search_placeholder;

    const cartHeader = document.querySelector('.cart-header h2');
    if (cartHeader) {
        cartHeader.innerHTML = <i class='bx bx-shopping-bag'></i>  + dict.cart;
    }
    
    const checkoutBtn = document.getElementById('btn-proceed-checkout');
    if (checkoutBtn) {
        checkoutBtn.innerHTML = dict.checkout + (lang === 'ar' ?  <i class='bx bx-left-arrow-alt'></i> :  <i class='bx bx-right-arrow-alt'></i>);
    }
}

const savedLang = localStorage.getItem('lang') || 'fr';
applyLang(savedLang);

// 3. Search Bar
const searchBtn = document.getElementById('search-btn');
const searchOverlay = document.getElementById('search-overlay');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', async () => {
        searchOverlay.style.display = 'flex';
        searchInput.focus();
        if (allProducts.length === 0) {
            allProducts = await fetchProducts('all', 1, 0);
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.trim() === '') {
            searchResults.innerHTML = '';
            return;
        }

        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query) || (p.category && p.category.toLowerCase().includes(query)));
        
        if (filtered.length === 0) {
            searchResults.innerHTML = '<p style="color:white; grid-column:1/-1;">Aucun résultat trouvé.</p>';
        } else {
            searchResults.innerHTML = filtered.slice(0, 8).map(p => renderProductCard(p)).join('');
        }
    });
}
'''
    # We must write to file carefully handling encoding
    final_content = clean_base + extended_features
    # Some texts might be messed up because ISO-8859-1 conversion of base code. 
    # But wait, original JS was completely standard EXCEPT whatever I injected.
    # To be safer about French characters in base JS, let's open as utf-8, replace errors.
    
restore_js()
