def restore_css():
    with open('static/store.css', 'rb') as f:
        content_bytes = f.read()
    
    parts = content_bytes.split(b'/* ===== EXTENDED FEATURES ===== */')
    clean_base = parts[0]
    base_str = clean_base.decode('utf-8', errors='replace')
    
    extended_features = '''
/* ===== EXTENDED FEATURES ===== */
/* Dark Mode Variables */
body.dark-mode {
    --bg: #121212;
    --surface: #1E1E1E;
    --dark: #FDFBF7;
    --text: #E0E0E0;
    --muted: #A0A0A0;
    --border-col: #333333;
}
body.dark-mode .navbar {
    background: rgba(18, 18, 18, 0.92);
}
body.dark-mode .product-card, body.dark-mode .cart-item-img {
    background: #1E1E1E;
}

/* Lang Dropdown */
.lang-dropdown {
    position: relative;
    display: inline-block;
}
.lang-menu {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--bg);
    min-width: 60px;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-col);
    z-index: 1000;
}
.lang-dropdown:hover .lang-menu { display: block; }
.lang-menu a {
    color: var(--text);
    padding: 10px 15px;
    text-decoration: none;
    display: block;
    text-align: center;
    font-size: 0.8rem;
    transition: background 0.3s;
}
.lang-menu a:hover { background: var(--surface); color: var(--accent); }

/* Search Overlay */
.search-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26,26,26,0.95);
    backdrop-filter: blur(10px);
    z-index: 4000;
    display: flex;
    justify-content: center;
    padding-top: 15vh;
}
.search-container {
    width: 80%;
    max-width: 800px;
    position: relative;
}
.search-container input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 2px solid var(--accent);
    color: white;
    font-size: 2.5rem;
    font-family: var(--font-title);
    outline: none;
    padding: 1rem 0;
    margin-bottom: 2rem;
}
.close-search {
    position: absolute;
    top: 0; right: 0;
    width: 50px; height: 50px;
    color: white;
    font-size: 2.5rem;
}
.search-results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    max-height: 50vh;
    overflow-y: auto;
}
.search-results-grid .product-card { background: white; color: black; }

/* WhatsApp Float */
.wa-float {
    position: fixed;
    width: 60px;
    height: 60px;
    bottom: 30px;
    left: 30px;
    background-color: #25d366;
    color: #FFF;
    border-radius: 50px;
    text-align: center;
    font-size: 35px;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s;
}
.wa-float:hover { transform: scale(1.1); color: #FFF; }

/* Payment & RTL */
.payment-shipping-section { margin-top: 1rem; border-top: 1px solid var(--border-col); padding-top: 1rem; }
.payment-options { display: flex; flex-direction: column; gap: 0.5rem; }
.payment-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer; }
body[dir="rtl"] { direction: rtl; text-align: right; }
body[dir="rtl"] .cart-sidebar { right: auto; left: 0; transform: translateX(-100%); }
body[dir="rtl"] .cart-sidebar.open { transform: translateX(0); }
body[dir="rtl"] .modal-close-btn { right: auto; left: 1rem; }
'''
    final_content = base_str + extended_features
    with open('static/store.css', 'w', encoding='utf-8') as f:
        f.write(final_content)
        
restore_css()
