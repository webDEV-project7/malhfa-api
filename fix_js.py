import re

with open('static/store.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the stripped quotes
content = content.replace("cartHeader.innerHTML = <i class='bx bx-shopping-bag'></i>  + dict.cart;", "cartHeader.innerHTML = <i class='bx bx-shopping-bag'></i>  + dict.cart;")
content = content.replace("checkoutBtn.innerHTML = dict.checkout + (lang === 'ar' ?  <i class='bx bx-left-arrow-alt'></i> :  <i class='bx bx-right-arrow-alt'></i>);", "checkoutBtn.innerHTML = dict.checkout + (lang === 'ar' ?  <i class='bx bx-left-arrow-alt'></i> :  <i class='bx bx-right-arrow-alt'></i>);")

with open('static/store.js', 'w', encoding='utf-8') as f:
    f.write(content)
