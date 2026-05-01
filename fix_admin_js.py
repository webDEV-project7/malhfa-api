import json

def append_admin_js():
    with open('static/script.js', 'rb') as f:
        content = f.read()
        
    extended_logic = b'''

// ===== ADMIN DARK MODE & TRANSLATION =====
document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('admin-theme-toggle');
    if (themeBtn) {
        if (localStorage.getItem('admin_theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeBtn.innerHTML = "<i class='bx bx-sun'></i>";
        }
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('admin_theme', 'dark');
                themeBtn.innerHTML = "<i class='bx bx-sun'></i>";
            } else {
                localStorage.setItem('admin_theme', 'light');
                themeBtn.innerHTML = "<i class='bx bx-moon'></i>";
            }
        });
    }
});

function toggleAdminLang(e) {
    const menu = document.getElementById('admin-lang-menu');
    if(menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function setAdminLang(lang) {
    localStorage.setItem('admin_lang', lang);
    applyAdminLang(lang);
    const menu = document.getElementById('admin-lang-menu');
    if(menu) menu.style.display = 'none';
}

const ADMIN_TRANS = {
    'fr': {
        'stats': 'Statistiques',
        'manual': 'Saisie Manuelle',
        'catalog': 'Catalogue Store',
        'web_orders': 'Commandes Web',
        'caisse': 'Caisse & Ventes',
        'clients': 'Clients',
        'charges': 'Charges',
        'logout': 'Déconnexion'
    },
    'en': {
        'stats': 'Statistics',
        'manual': 'Manual Entry',
        'catalog': 'Store Catalog',
        'web_orders': 'Web Orders',
        'caisse': 'Sales & Register',
        'clients': 'Customers',
        'charges': 'Expenses',
        'logout': 'Logout'
    },
    'ar': {
        'stats': 'إحصائيات',
        'manual': 'إدخال يدوي',
        'catalog': 'كتالوج المتجر',
        'web_orders': 'طلبات الويب',
        'caisse': 'المبيعات والصندوق',
        'clients': 'العملاء',
        'charges': 'المصاريف',
        'logout': 'تسجيل خروج'
    }
};

function applyAdminLang(lang) {
    const d = ADMIN_TRANS[lang] || ADMIN_TRANS['fr'];
    if (lang === 'ar') document.body.setAttribute('dir', 'rtl');
    else document.body.removeAttribute('dir');
    
    // Only replacing specific text so we don't break icons
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        if(tab.innerHTML.includes('bx-chart-bar')) tab.innerHTML = <i class='bx bx-chart-bar'></i>  + d.stats;
        if(tab.innerHTML.includes('bx-edit')) tab.innerHTML = <i class='bx bx-edit'></i>  + d.manual;
        if(tab.innerHTML.includes('bx-store-alt')) tab.innerHTML = <i class='bx bx-store-alt'></i>  + d.catalog;
        if(tab.innerHTML.includes('bx-shopping-bag')) tab.innerHTML = <i class='bx bx-shopping-bag'></i>  + d.web_orders;
        if(tab.innerHTML.includes('bx-basket')) tab.innerHTML = <i class='bx bx-basket'></i>  + d.caisse;
        if(tab.innerHTML.includes('bxs-user-detail')) tab.innerHTML = <i class='bx bxs-user-detail'></i>  + d.clients;
        if(tab.innerHTML.includes('bx-money')) tab.innerHTML = <i class='bx bx-money'></i>  + d.charges;
    });
}
const initialAdminLang = localStorage.getItem('admin_lang') || 'fr';
setTimeout(() => applyAdminLang(initialAdminLang), 100);
'''
    if b'ADMIN DARK MODE' not in content:
        content += extended_logic
        with open('static/script.js', 'wb') as f:
            f.write(content)

append_admin_js()
