import re

with open('static/store.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace populateCheckoutSummary
new_populate = '''function populateCheckoutSummary() {
    const summary = document.getElementById('chk-summary');
    const subtotalEl = document.getElementById('chk-subtotal-display');
    if (!summary) return;

    let subtotal = 0;
    summary.innerHTML = storeCart.map(item => {
        const lineTotal = item.price * item.qty;
        subtotal += lineTotal;
        return <div class="chk-order-line">
            <span> × </span>
            <span> DH</span>
        </div>;
    }).join('');

    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2) + ' DH';
    updateCheckoutTotal(subtotal);
}

window.updateCheckoutTotal = function(sub = null) {
    let subtotal = sub;
    if (subtotal === null) {
        subtotal = storeCart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    }
    const shippingEl = document.getElementById('chk_shipping');
    const shippingFee = shippingEl ? parseFloat(shippingEl.value) || 0 : 0;
    const finalTotal = subtotal + shippingFee;
    
    const totalEl = document.getElementById('chk-total-display');
    const shippingDisplay = document.getElementById('chk-shipping-display');
    
    if (shippingDisplay) shippingDisplay.textContent = '+ ' + shippingFee.toFixed(2) + ' DH';
    if (totalEl) totalEl.textContent = finalTotal.toFixed(2) + ' DH';
};
'''
content = re.sub(r'function populateCheckoutSummary\(\) \{.*?(?=async function submitOrder)', new_populate + '\n', content, flags=re.DOTALL)

# 2. Replace submitOrder
new_submit = '''async function submitOrder(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-validate-order');
    const origText = btn.innerHTML;
    btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Traitement...';
    btn.disabled = true;

    const shippingEl = document.getElementById('chk_shipping');
    const shippingFee = shippingEl ? parseFloat(shippingEl.value) || 0 : 0;
    
    const paymentMethodEl = document.querySelector('input[name="payment_method"]:checked');
    const paymentMethod = paymentMethodEl ? paymentMethodEl.value : 'Cash';

    const payload = {
        client_name:    document.getElementById('chk_name')?.value || '',
        client_phone:   document.getElementById('chk_phone')?.value || '',
        client_address: ${document.getElementById('chk_city')?.value || ''} — ,
        payment_method: paymentMethod,
        shipping_fee:   shippingFee,
        items: storeCart.map(i => ({
            product_id: i.id,
            quantity:   i.qty,
            unit_price: i.price
        }))
    };

    try {
        const res = await fetch('/api/checkout-store', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const data = await res.json();
            document.getElementById('checkout-form').style.display = 'none';
            document.getElementById('order-success-msg').style.display = 'block';
            
            const pdfBtn = document.getElementById('download-invoice-btn');
            if (pdfBtn && data.order_id) {
                pdfBtn.href = /api/orders//pdf;
            }
            
            storeCart = [];
            saveCart();
            renderCart();
            updateCartBadge();
        } else {
            const err = await res.json();
            alert('Erreur : ' + (err.detail || 'impossible de traiter la commande.'));
        }
    } catch {
        alert('Erreur de connexion. Veuillez réessayer.');
    } finally {
        btn.innerHTML = origText;
        btn.disabled = false;
    }
}
'''
content = re.sub(r'async function submitOrder\(e\) \{.*?(?=window\.closeOrderSuccess)', new_submit + '\n', content, flags=re.DOTALL)

with open('static/store.js', 'w', encoding='utf-8') as f:
    f.write(content)
