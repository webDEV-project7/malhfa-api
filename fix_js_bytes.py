def fix_mixed_encoding(file_path):
    with open(file_path, 'rb') as f:
        content_bytes = f.read()
    
    # Try decode first part as utf-8 and second part as cp1252 or handle it
    # Easiest way in python is to decode with errors='replace' but we don't want to lose accents.
    # Let's decode with cp1252. The utf-8 chars will look weird, let's fix the specific script tag:
    try:
        content_str = content_bytes.decode('utf-8')
    except UnicodeDecodeError:
        # Decode as cp1252, write back
        # Wait, if the first part is utf-8, decoding as cp1252 will corrupt the french accents in the first half!
        # The first part was fine. I appended using Powershell Add-Content which appended ANSI.
        
        # Let's just do a byte-level replace for the exact bad strings which are ASCII
        pass
        
    # Byte level replacement for the syntax error
    # "cartHeader.innerHTML = <i class='bx bx-shopping-bag'></i>  + dict.cart;"
    target1 = b"cartHeader.innerHTML = <i class='bx bx-shopping-bag'></i>  + dict.cart;"
    replace1 = b"cartHeader.innerHTML = <i class='bx bx-shopping-bag'></i>  + dict.cart;"
    
    target2 = b"checkoutBtn.innerHTML = dict.checkout + (lang === 'ar' ?  <i class='bx bx-left-arrow-alt'></i> :  <i class='bx bx-right-arrow-alt'></i>);"
    replace2 = b"checkoutBtn.innerHTML = dict.checkout + (lang === 'ar' ?  <i class='bx bx-left-arrow-alt'></i> :  <i class='bx bx-right-arrow-alt'></i>);"
    
    new_content = content_bytes.replace(target1, replace1).replace(target2, replace2)
    
    # Also fix the weird "├" character if applicable or let the browser handle it.
    
    with open(file_path, 'wb') as f:
        f.write(new_content)

fix_mixed_encoding('static/store.js')
