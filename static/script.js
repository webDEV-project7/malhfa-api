// ============================================================
//  MALHAFTI DESIGN — Dashboard Script v2.0 (Fixed & Unified)
// ============================================================

// --- Tab Navigation ---
window.openTab = function(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    const el = document.getElementById(tabId);
    if (el) el.style.display = 'block';

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    // Dynamic data fetching per tab
    if (tabId === 'tab-clients'    && window.fetchCustomers) window.fetchCustomers();
    if (tabId === 'tab-catalog'    && window.fetchCatalog)   window.fetchCatalog();
    if (tabId === 'tab-orders-web' && window.fetchOrders)    window.fetchOrders();
    if (tabId === 'tab-stats'      && window.fetchDashboard) window.fetchDashboard();
    if (tabId === 'tab-produit'    && window.fetchHistoryFn) window.fetchHistoryFn();
    if (tabId === 'tab-charge'     && window.fetchHistoryFn) window.fetchHistoryFn();
};

// --- Edit Product Modal ---
window.openEditProductModal = function(id, name, price, stock, category) {
    document.getElementById('edit_product_id').value    = id;
    document.getElementById('edit_product_name').value  = name;
    document.getElementById('edit_product_price').value = price;
    document.getElementById('edit_product_stock').value = stock;
    const catEl = document.getElementById('edit_product_category');
    if (catEl) catEl.value = category || 'Collection';
    document.getElementById('edit-product-modal').style.display = 'block';
};

// --- Gallery Modal ---
window.openGalleryModal = function(id) {
    document.getElementById('gallery_product_id').value = id;
    document.getElementById('gallery-modal').style.display = 'block';
};

// --- Media Modal ---
window.openMediaModal = function(id) {
    document.getElementById('media_product_id').value = id;
    document.getElementById('media-modal').style.display = 'block';
};

// --- Delete Product ---
window.deleteProduct = async function(id) {
    if (!confirm('Supprimer cette Malhfa du Store ?')) return;
    const res = await window.fetchApi(`/api/products/${id}`, { method: 'DELETE' });
    if (res && res.ok) {
        if (window.fetchCatalog) window.fetchCatalog();
        else location.reload();
    }
};

// --- Update Order Status ---
window.updateOrderStatus = async function(id, status) {
    try {
        const res = await window.fetchApi(`/api/orders/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (res && res.ok && window.fetchOrders) window.fetchOrders();
    } catch(e) { console.error(e); }
};

// --- Duplicate Entry helper ---
window.duplicateEntry = function(entryType, chargeType, des, qty, pu) {
    if (entryType === 'produit') {
        document.querySelectorAll('.tab-btn').forEach(b => {
            if (b.textContent.includes('Saisie') || b.textContent.includes('Produit'))
                window.openTab('tab-produit', b);
        });
        document.getElementById('p_des').value = des;
        document.getElementById('p_qte').value = qty;
        document.getElementById('p_pu').value  = pu;
        if (window.calcP) window.calcP();
    } else {
        document.querySelectorAll('.tab-btn').forEach(b => {
            if (b.textContent.includes('Charges')) window.openTab('tab-charge', b);
        });
        document.getElementById('c_type').value = chargeType;
        document.getElementById('c_des').value  = des;
        document.getElementById('c_qte').value  = qty;
        document.getElementById('c_pu').value   = pu;
        if (window.calcC) window.calcC();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ============================================================
//  MAIN DOMContentLoaded
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

    // --- Role from meta ---
    const metaRole = document.querySelector('meta[name="user-role"]');
    const userRole = metaRole ? metaRole.getAttribute('content') : 'admin';

    // --- Form element refs ---
    const formProduit        = document.getElementById('form-produit');
    const formCharge         = document.getElementById('form-charge');
    const formUser           = document.getElementById('form-user');
    const formCaisseAdd      = document.getElementById('form-caisse-add');
    const formCaisseCheckout = document.getElementById('form-caisse-checkout');
    const invoiceModal       = document.getElementById('invoice-modal');
    const invoiceForm        = document.getElementById('invoice-form');
    const mediaForm          = document.getElementById('media-form');
    const editForm           = document.getElementById('edit-product-form');
    const galleryForm        = document.getElementById('gallery-form');
    const addStoreForm       = document.getElementById('form-add-store-product');

    // --- Live calc helpers ---
    window.calcP = function() {
        const q = parseFloat(document.getElementById('p_qte')?.value) || 0;
        const p = parseFloat(document.getElementById('p_pu')?.value)  || 0;
        const el = document.getElementById('p_tot');
        if (el) el.textContent = (q * p).toFixed(2) + ' DH';
    };
    window.calcC = function() {
        const q = parseFloat(document.getElementById('c_qte')?.value) || 0;
        const p = parseFloat(document.getElementById('c_pu')?.value)  || 0;
        const el = document.getElementById('c_tot');
        if (el) el.textContent = (q * p).toFixed(2) + ' DH';
    };
    window.calcCartLine = function() {
        const q  = parseFloat(document.getElementById('cart_qte')?.value) || 0;
        const pu = parseFloat(document.getElementById('cart_pu')?.value)  || 0;
        const el = document.getElementById('cart_line_tot');
        if (el) el.textContent = (q * pu).toFixed(2) + ' DH';
    };

    // --- Invoice Modal close ---
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn && invoiceModal) closeBtn.onclick = () => invoiceModal.style.display = 'none';
    window.onclick = (e) => { if (e.target === invoiceModal) invoiceModal.style.display = 'none'; };

    // ============================================================
    //  Universal Fetch wrapper
    // ============================================================
    window.fetchApi = async function(url, options = {}) {
        try {
            const res = await fetch(url, options);
            if (res.status === 401) { window.location.href = '/admin-login'; return null; }
            if (res.status === 403) { alert("Accès refusé."); return null; }
            return res;
        } catch(e) { console.error(e); return null; }
    };

    // ============================================================
    //  Cart (Caisse)
    // ============================================================
    let currentCart = [];

    function renderCart() {
        const tbody = document.querySelector('#table-cart tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        let total = 0;
        currentCart.forEach((item, i) => {
            const t = item.quantite * item.prix_unitaire;
            total += t;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.designation}</td>
                <td>${item.quantite}</td>
                <td>${item.prix_unitaire.toFixed(2)}</td>
                <td><strong>${t.toFixed(2)} DH</strong></td>
                <td><button class="btn btn-danger" onclick="removeFromCart(${i})" style="padding:0.3rem;"><i class='bx bx-x'></i></button></td>
            `;
            tbody.appendChild(tr);
        });
        const disp = document.getElementById('cart_total_display');
        if (disp) disp.textContent = total.toFixed(2) + ' DH';
    }

    window.removeFromCart = function(i) { currentCart.splice(i, 1); renderCart(); };

    if (formCaisseAdd) {
        formCaisseAdd.addEventListener('submit', (e) => {
            e.preventDefault();
            currentCart.push({
                designation:   document.getElementById('cart_des').value,
                quantite:      parseFloat(document.getElementById('cart_qte').value),
                prix_unitaire: parseFloat(document.getElementById('cart_pu').value)
            });
            renderCart();
            document.getElementById('cart_des').value = '';
            document.getElementById('cart_des').focus();
            document.getElementById('cart_qte').value = '1';
            window.calcCartLine();
        });
    }

    if (formCaisseCheckout) {
        formCaisseCheckout.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentCart.length) { alert("Le panier est vide !"); return; }
            const payload = {
                client_name:    document.getElementById('chk_client_name').value,
                client_ice:     document.getElementById('chk_client_ice').value,
                client_phone:   document.getElementById('chk_client_phone').value,
                client_address: document.getElementById('chk_client_address').value,
                items: currentCart
            };
            const btn = formCaisseCheckout.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Traitement...";
            btn.disabled = true;
            const res = await window.fetchApi('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res && res.ok) {
                const blob = await res.blob();
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `Facture_${payload.client_name.replace(/ /g,'_')}.pdf`;
                document.body.appendChild(a); a.click(); a.remove();
                alert("Commande validée !");
                currentCart = []; renderCart(); formCaisseCheckout.reset();
                fetchData();
            } else if (res) {
                const err = await res.json();
                alert('Erreur: ' + (err.detail || ''));
            }
            btn.innerHTML = orig; btn.disabled = false;
        });
    }

    // ============================================================
    //  Submit: Produit (saisie manuelle)
    // ============================================================
    if (formProduit) {
        formProduit.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                entry_type:    'produit',
                designation:   document.getElementById('p_des').value,
                quantite:      parseFloat(document.getElementById('p_qte').value),
                prix_unitaire: parseFloat(document.getElementById('p_pu').value),
                type_charge:   null
            };
            const res = await window.fetchApi('/api/entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res && res.ok) { formProduit.reset(); window.calcP(); fetchData(); }
            else if (res) { const e2 = await res.json(); alert('Erreur: ' + (e2.detail||'')); }
        });
    }

    // ============================================================
    //  Submit: Charge
    // ============================================================
    if (formCharge) {
        formCharge.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                entry_type:    'charge',
                designation:   document.getElementById('c_des').value,
                quantite:      parseFloat(document.getElementById('c_qte').value),
                prix_unitaire: parseFloat(document.getElementById('c_pu').value),
                type_charge:   document.getElementById('c_type').value || null
            };
            const res = await window.fetchApi('/api/entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res && res.ok) { formCharge.reset(); window.calcC(); fetchData(); }
            else if (res) { const e2 = await res.json(); alert('Erreur: ' + (e2.detail||'')); }
        });
    }

    // ============================================================
    //  Submit: Create User
    // ============================================================
    if (formUser) {
        formUser.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                username: document.getElementById('u_name').value,
                password: document.getElementById('u_pass').value,
                role:     document.getElementById('u_role').value
            };
            const res = await window.fetchApi('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res && res.ok) { formUser.reset(); alert("Employé ajouté !"); fetchUsers(); }
            else if (res) { const e2 = await res.json(); alert('Erreur: ' + (e2.detail||'')); }
        });
    }

    // ============================================================
    //  Invoice PDF generation
    // ============================================================
    window.openInvoiceModal = function(entryId) {
        document.getElementById('inv_entry_id').value = entryId;
        if (invoiceModal) invoiceModal.style.display = 'block';
    };

    if (invoiceForm) {
        invoiceForm.onsubmit = async (e) => {
            e.preventDefault();
            const entryId = document.getElementById('inv_entry_id').value;
            const payload = {
                client_name:    document.getElementById('client_name').value,
                client_ice:     document.getElementById('client_ice').value,
                client_phone:   document.getElementById('client_phone').value,
                client_address: document.getElementById('client_address').value,
                items: []
            };
            const res = await window.fetchApi(`/api/invoice/${entryId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res && res.ok) {
                const blob = await res.blob();
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `Facture_${payload.client_name}.pdf`;
                document.body.appendChild(a); a.click(); a.remove();
                if (invoiceModal) invoiceModal.style.display = 'none';
                invoiceForm.reset();
            } else {
                alert("Erreur lors de la génération PDF.");
            }
        };
    }

    // ============================================================
    //  Delete Entry
    // ============================================================
    window.deleteEntry = async function(id) {
        if (!confirm("Supprimer cette entrée ?")) return;
        const res = await window.fetchApi(`/api/history/${id}`, { method: 'DELETE' });
        if (res && res.ok) fetchData();
    };

    window.deleteUser = async function(id) {
        if (!confirm("Désactiver ce compte ?")) return;
        const res = await window.fetchApi(`/api/users/${id}`, { method: 'DELETE' });
        if (res && res.ok) fetchUsers();
        else alert("Impossible de supprimer l'admin.");
    };

    // ============================================================
    //  Excel Upload
    // ============================================================
    window.handleFileUpload = async function(file) {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await window.fetchApi('/api/upload', { method: 'POST', body: formData });
            if (!res) return;
            const result = await res.json();
            if (res.ok) { alert(`Succès : ${result.inserted} entrées importées !`); fetchData(); }
            else alert(result.detail || "Erreur import");
        } catch { alert('Erreur réseau'); }
        const fp = document.getElementById('file-produit');
        const fc = document.getElementById('file-charge');
        if (fp) fp.value = '';
        if (fc) fc.value = '';
    };

    // ============================================================
    //  Media Upload form
    // ============================================================
    if (mediaForm) {
        mediaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const prodId = document.getElementById('media_product_id').value;
            const formData = new FormData();
            const img = document.getElementById('media_image').files[0];
            const vid = document.getElementById('media_video').files[0];
            if (img) formData.append('image', img);
            if (vid) formData.append('video', vid);
            const btn = mediaForm.querySelector('button');
            const og = btn.innerHTML;
            btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Upload...";
            btn.disabled = true;
            try {
                const res = await window.fetchApi(`/api/products/${prodId}/media`, { method: 'POST', body: formData });
                if (res && res.ok) {
                    alert('Médias mis à jour !');
                    document.getElementById('media-modal').style.display = 'none';
                    mediaForm.reset();
                    if (window.fetchCatalog) window.fetchCatalog();
                } else if (res) {
                    const err = await res.json();
                    alert('Erreur: ' + (err.detail||''));
                }
            } finally { btn.innerHTML = og; btn.disabled = false; }
        });
    }

    // ============================================================
    //  Gallery Upload form
    // ============================================================
    if (galleryForm) {
        galleryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const prodId = document.getElementById('gallery_product_id').value;
            const imgFile = document.getElementById('gallery_image').files[0];
            if (!imgFile) return;
            const formData = new FormData();
            formData.append('image', imgFile);
            const btn = galleryForm.querySelector('button');
            const og = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Upload...";
            try {
                const res = await window.fetchApi(`/api/products/${prodId}/gallery`, { method: 'POST', body: formData });
                if (res && res.ok) { alert('Image ajoutée à la galerie !'); galleryForm.reset(); }
            } finally { btn.disabled = false; btn.innerHTML = og; }
        });
    }

    // ============================================================
    //  Edit Product form (modal)
    // ============================================================
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('edit_product_id').value;
            const body = {
                name:        document.getElementById('edit_product_name').value,
                price:       parseFloat(document.getElementById('edit_product_price').value),
                stock:       parseInt(document.getElementById('edit_product_stock').value),
                category:    document.getElementById('edit_product_category')?.value || 'Collection',
                description: ''
            };
            const res = await window.fetchApi(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (res && res.ok) {
                document.getElementById('edit-product-modal').style.display = 'none';
                if (window.fetchCatalog) window.fetchCatalog();
            }
        });
    }

    // ============================================================
    //  Add Store Product form (Catalogue tab)
    // ============================================================
    if (addStoreForm) {
        addStoreForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const body = {
                name:        document.getElementById('store_p_name').value,
                price:       parseFloat(document.getElementById('store_p_price').value),
                stock:       parseInt(document.getElementById('store_p_stock').value),
                category:    document.getElementById('store_p_category').value,
                description: 'Nouveau modèle de collection'
            };
            const btn = addStoreForm.querySelector('button[type="submit"]');
            btn.disabled = true;
            try {
                const res = await window.fetchApi('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                if (res && res.ok) {
                    alert('Malhfa ajoutée avec succès !');
                    addStoreForm.reset();
                    if (window.fetchCatalog) window.fetchCatalog();
                }
            } finally { btn.disabled = false; }
        });
    }

    // ============================================================
    //  DATA FETCHING FUNCTIONS
    // ============================================================

    async function fetchHistory() {
        const res = await window.fetchApi('/api/history');
        if (!res || !res.ok) return;
        const data = await res.json();
        const tP = document.querySelector('#table-produit tbody');
        const tC = document.querySelector('#table-charge tbody');
        if (tP) tP.innerHTML = '';
        if (tC) tC.innerHTML = '';
        data.forEach(entry => {
            const date = new Date(entry.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
            const tr = document.createElement('tr');
            if (entry.entry_type === 'produit' && tP) {
                tr.innerHTML = `
                    <td>${date}</td>
                    <td>${entry.designation}</td>
                    <td>${entry.quantite}</td>
                    <td>${entry.prix_unitaire.toFixed(2)} DH</td>
                    <td><strong>${entry.prix_total.toFixed(2)} DH</strong></td>
                    <td>
                        <button class="btn btn-outline" style="padding:0.2rem 0.5rem;" onclick="duplicateEntry('produit','','${entry.designation.replace(/'/g,"\\'")}',${entry.quantite},${entry.prix_unitaire})" title="Dupliquer"><i class='bx bx-copy'></i></button>
                        <button class="btn btn-outline" onclick="openInvoiceModal(${entry.id})" title="PDF" style="padding:0.2rem 0.5rem; color:var(--primary); border-color:var(--primary);"><i class='bx bxs-file-pdf'></i></button>
                        <button class="btn btn-danger" onclick="deleteEntry(${entry.id})" title="Supprimer" style="padding:0.2rem 0.5rem;"><i class='bx bx-trash'></i></button>
                    </td>`;
                tP.appendChild(tr);
            } else if (entry.entry_type === 'charge' && tC) {
                tr.innerHTML = `
                    <td>${date}</td>
                    <td>${entry.designation}</td>
                    <td><span class="badge badge-charge">${entry.type_charge || '-'}</span></td>
                    <td>${entry.quantite}</td>
                    <td>${entry.prix_unitaire.toFixed(2)} DH</td>
                    <td><strong>${entry.prix_total.toFixed(2)} DH</strong></td>
                    <td>
                        <button class="btn btn-outline" style="padding:0.2rem 0.5rem;" onclick="duplicateEntry('charge','${entry.type_charge||''}','${entry.designation.replace(/'/g,"\\'")}',${entry.quantite},${entry.prix_unitaire})" title="Dupliquer"><i class='bx bx-copy'></i></button>
                        <button class="btn btn-danger" onclick="deleteEntry(${entry.id})" title="Supprimer" style="padding:0.2rem 0.5rem;"><i class='bx bx-trash'></i></button>
                    </td>`;
                tC.appendChild(tr);
            }
        });
    }
    window.fetchHistoryFn = fetchHistory;

    async function fetchCatalog() {
        const res = await window.fetchApi('/api/products');
        if (!res || !res.ok) return;
        const products = await res.json();
        const tbody = document.querySelector('#table-catalog tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        products.forEach(p => {
            const tr = document.createElement('tr');
            let stockClass = 'badge-produit';
            if (p.stock <= 5)  stockClass = 'badge-charge';
            if (p.stock === 0) stockClass = 'badge-danger';
            tr.innerHTML = `
                <td><img src="${p.image_url || '/static/placeholder.jpg'}" style="width:50px;height:60px;object-fit:cover;border-radius:8px;"></td>
                <td>
                    <div style="font-weight:700; font-family:var(--font-title); font-size:1.05rem;">${p.name}</div>
                    <small style="color:var(--muted); text-transform:uppercase; letter-spacing:1px;">${p.category||'Collection'}</small>
                </td>
                <td style="font-weight:600;">${p.price.toFixed(2)} DH</td>
                <td><span class="badge ${stockClass}" style="padding:0.3rem 0.7rem;">${p.stock} en stock</span></td>
                <td>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="btn btn-outline" onclick="openMediaModal(${p.id})" title="Image principale"><i class='bx bx-camera'></i></button>
                        <button class="btn btn-outline" onclick="openGalleryModal(${p.id})" title="Galerie"><i class='bx bx-images'></i></button>
                        <button class="btn btn-outline" style="color:var(--gold);border-color:var(--gold);" onclick="openEditProductModal(${p.id},'${p.name.replace(/'/g,"\\'")}',${p.price},${p.stock},'${p.category}')"><i class='bx bx-edit-alt'></i></button>
                        <button class="btn btn-danger" onclick="deleteProduct(${p.id})"><i class='bx bx-trash'></i></button>
                    </div>
                </td>`;
            tbody.appendChild(tr);
        });
    }
    window.fetchCatalog = fetchCatalog;

    async function fetchOrders() {
        const res = await window.fetchApi('/api/orders');
        if (!res || !res.ok) return;
        const orders = await res.json();
        const tbody = document.querySelector('#table-orders tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        const badge = document.getElementById('order-count-badge');
        if (badge) badge.textContent = orders.length + ' Commandes';
        orders.forEach(o => {
            const date = new Date(o.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
            const tr = document.createElement('tr');
            let statusStyle = 'background:#fef3c7;color:#92400e;';
            if (o.status === 'Payée')     statusStyle = 'background:#dcfce7;color:#166534;';
            if (o.status === 'Expédiée')  statusStyle = 'background:#dbeafe;color:#1e40af;';
            if (o.status === 'Livrée')    statusStyle = 'background:#f3f4f6;color:#374151;';
            tr.innerHTML = `
                <td><small>${date}</small></td>
                <td><strong>${o.client_name}</strong></td>
                <td><small>${o.client_phone||'-'}<br>${o.client_address||'-'}</small></td>
                <td><strong>${o.total.toFixed(2)} DH</strong></td>
                <td>
                    <select onchange="updateOrderStatus(${o.id}, this.value)" style="${statusStyle} border:none;padding:4px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;cursor:pointer;">
                        <option value="En attente" ${o.status==='En attente'?'selected':''}>En attente</option>
                        <option value="Payée"      ${o.status==='Payée'?'selected':''}>Payée</option>
                        <option value="Expédiée"   ${o.status==='Expédiée'?'selected':''}>Expédiée</option>
                        <option value="Livrée"     ${o.status==='Livrée'?'selected':''}>Livrée</option>
                    </select>
                </td>
                <td>—</td>`;
            tbody.appendChild(tr);
        });
    }
    window.fetchOrders = fetchOrders;

    async function fetchUsers() {
        const res = await window.fetchApi('/api/users');
        if (!res || !res.ok) return;
        const data = await res.json();
        const tbody = document.querySelector('#table-user tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        data.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${u.id}</td>
                <td><strong>${u.username}</strong></td>
                <td><span class="badge ${u.role==='admin'?'badge-produit':'badge-charge'}">${u.role.toUpperCase()}</span></td>
                <td>${u.username!=='admin' ? `<button class="btn btn-danger" onclick="deleteUser(${u.id})"><i class='bx bx-user-x'></i></button>` : '-'}</td>`;
            tbody.appendChild(tr);
        });
    }

    window.fetchCustomers = async function() {
        const res = await window.fetchApi('/api/admin/customers');
        if (!res || !res.ok) return;
        const data = await res.json();
        const tbody = document.querySelector('#table-clients tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        const kpi = document.getElementById('kpi-total-clients');
        if (kpi) kpi.textContent = data.length;
        data.forEach(c => {
            const date = new Date(c.created_at).toLocaleDateString('fr-FR');
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:600;">${c.full_name}</td>
                <td>${c.email}</td>
                <td>${c.phone||'-'}</td>
                <td>${c.address||'-'}</td>
                <td><span class="badge" style="background:rgba(196,98,45,0.1);color:var(--terracotta);padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">${c.order_count} commande(s)</span></td>
                <td>${date}</td>`;
            tbody.appendChild(tr);
        });
    };

    // --- Charts ---
    let financeChart = null, productsChart = null, chargesChart = null;

    window.fetchDashboard = async function() {
        const res = await window.fetchApi('/api/dashboard');
        if (!res || !res.ok) return;
        const data = await res.json();
        const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
        set('kpi-ca',       data.ca_total.toFixed(2)       + ' DH');
        set('kpi-ca-web',   data.ca_ecommerce.toFixed(2)   + ' DH');
        set('kpi-charges',  data.charges_cumulees.toFixed(2)+ ' DH');
        set('kpi-benefice', data.benefice_brut.toFixed(2)  + ' DH');
        set('kpi-marge',    data.marge_moyenne              + ' %');
        updateChart(data.trends, data.breakdown);
    };

    function updateChart(trends, breakdown) {
        const ctxEl = document.getElementById('financeChart');
        if (!ctxEl) return;
        const allDates = [...new Set([...trends.sales_dates, ...trends.charges_dates, ...(trends.ecom_dates||[])])].sort();
        const pick = (dates, vals, d) => { const i = dates.indexOf(d); return i !== -1 ? vals[i] : 0; };
        const salesData   = allDates.map(d => pick(trends.sales_dates,   trends.sales_totals,   d));
        const chargesData = allDates.map(d => pick(trends.charges_dates, trends.charges_totals, d));
        const ecomData    = allDates.map(d => pick(trends.ecom_dates||[], trends.ecom_totals||[], d));
        if (financeChart) financeChart.destroy();
        const datasets = [
            { label: 'C.A Manuel', data: salesData, borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.1)', borderWidth:2, tension:0.4, fill:true },
            { label: 'C.A E-Commerce', data: ecomData, borderColor:'#10b981', backgroundColor:'rgba(16,185,129,0.1)', borderWidth:2, tension:0.4, fill:true }
        ];
        if (userRole === 'admin' || userRole === 'charge')
            datasets.push({ label:'Charges', data:chargesData, borderColor:'#ef4444', backgroundColor:'rgba(239,68,68,0.1)', borderWidth:2, tension:0.4, fill:true });
        financeChart = new Chart(ctxEl.getContext('2d'), {
            type: 'line',
            data: { labels: allDates, datasets },
            options: { responsive:true, maintainAspectRatio:false }
        });
        const pEl = document.getElementById('productsChart');
        if (pEl) {
            if (productsChart) productsChart.destroy();
            const labels = [...new Set([...breakdown.products_labels, ...(breakdown.ecom_labels||[])])];
            const totals = labels.map(l => {
                let s = 0;
                const i1 = breakdown.products_labels.indexOf(l);
                if (i1 !== -1) s += breakdown.products_totals[i1];
                const i2 = (breakdown.ecom_labels||[]).indexOf(l);
                if (i2 !== -1) s += breakdown.ecom_totals[i2];
                return s;
            });
            productsChart = new Chart(pEl.getContext('2d'), {
                type: 'doughnut',
                data: { labels, datasets: [{ data: totals, backgroundColor: ['#10b981','#34d399','#3b82f6','#6ee7b7','#a7f3d0'] }] },
                options: { responsive:true, maintainAspectRatio:false }
            });
        }
        const cEl = document.getElementById('chargesChart');
        if (cEl) {
            if (chargesChart) chargesChart.destroy();
            chargesChart = new Chart(cEl.getContext('2d'), {
                type: 'doughnut',
                data: { labels: breakdown.charges_labels, datasets: [{ data: breakdown.charges_totals, backgroundColor: ['#ef4444','#f87171','#dc2626','#fca5a5','#b91c1c'] }] },
                options: { responsive:true, maintainAspectRatio:false }
            });
        }
    }

    // ============================================================
    //  Initial Load
    // ============================================================
    async function fetchData() {
        await fetchHistory();
        await fetchCatalog();
        await fetchOrders();
        if (userRole === 'admin' || userRole === 'produit') await window.fetchDashboard();
        if (userRole === 'admin') await fetchUsers();
    }
    fetchData();
});


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
    
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        if(tab.innerHTML.includes('bx-chart-bar')) tab.innerHTML = `<i class='bx bx-chart-bar'></i> ` + d.stats;
        if(tab.innerHTML.includes('bx-edit')) tab.innerHTML = `<i class='bx bx-edit'></i> ` + d.manual;
        if(tab.innerHTML.includes('bx-store-alt')) tab.innerHTML = `<i class='bx bx-store-alt'></i> ` + d.catalog;
        if(tab.innerHTML.includes('bx-shopping-bag')) tab.innerHTML = `<i class='bx bx-shopping-bag'></i> ` + d.web_orders;
        if(tab.innerHTML.includes('bx-basket')) tab.innerHTML = `<i class='bx bx-basket'></i> ` + d.caisse;
        if(tab.innerHTML.includes('bxs-user-detail')) tab.innerHTML = `<i class='bx bxs-user-detail'></i> ` + d.clients;
        if(tab.innerHTML.includes('bx-money')) tab.innerHTML = `<i class='bx bx-money'></i> ` + d.charges;
    });
}
const initialAdminLang = localStorage.getItem('admin_lang') || 'fr';
setTimeout(() => applyAdminLang(initialAdminLang), 100);
