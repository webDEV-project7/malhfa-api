import sys

def clean_file(filepath, separator):
    with open(filepath, 'rb') as f:
        content = f.read()
    
    # separator expected to be bytes
    parts = content.split(separator)
    if len(parts) > 1:
        # Keep base until first separator, then add separator and the LAST instance of the extended features
        base = parts[0]
        extended = parts[-1] 
        # But wait, parts[-1] might have the same syntax errors if I didn't fix them properly.
        # Let's clean the extended part.
        
        # Actually in JS the separator is b"// ===== EXTENDED FEATURES"
        # Let's fix the syntaxes inside parts[-1]
        
        target1 = b"cartHeader.innerHTML = <i class='bx bx-shopping-bag'></i>  + dict.cart;"
        replace1 = b"cartHeader.innerHTML = <i class='bx bx-shopping-bag'></i>  + dict.cart;"
        
        target2 = b"checkoutBtn.innerHTML = dict.checkout + (lang === 'ar' ?  <i class='bx bx-left-arrow-alt'></i> :  <i class='bx bx-right-arrow-alt'></i>);"
        replace2 = b"checkoutBtn.innerHTML = dict.checkout + (lang === 'ar' ?  <i class='bx bx-left-arrow-alt'></i> :  <i class='bx bx-right-arrow-alt'></i>);"

        extended = extended.replace(target1, replace1).replace(target2, replace2)
        
        new_content = base + separator + extended
        
        with open(filepath, 'wb') as f:
            f.write(new_content)
        print(f"Cleaned {filepath}. Removed {len(parts) - 2} duplicate blocks.")

clean_file('static/store.js', b'// ===== EXTENDED FEATURES')
clean_file('static/store.css', b'/* ===== EXTENDED FEATURES ===== */')
