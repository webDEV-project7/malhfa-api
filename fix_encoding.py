import re

def fix_encoding(filepath):
    with open(filepath, 'rb') as f:
        content = f.read()
    
    # Define mappings
    mapping = {
        b'\xc3\xa9': 'é'.encode('utf-8'),
        b'\xc3\xa0': 'à'.encode('utf-8'),
        b'\xc3\xa8': 'è'.encode('utf-8'),
        b'\xc3\xaa': 'ê'.encode('utf-8'),
        b'\xc3\xb4': 'ô'.encode('utf-8'),
        b'\xc3\xa7': 'ç'.encode('utf-8'),
        b'\xc3\xae': 'î'.encode('utf-8'),
        b'\xc3\xaf': 'ï'.encode('utf-8'),
        b'\xc3\xb9': 'ù'.encode('utf-8'),
        b'\xc3\xab': 'ë'.encode('utf-8'),
        b'\xc3\x89': 'É'.encode('utf-8'),
        b'\xc3\x80': 'À'.encode('utf-8'),
        # These are what they look like when interpreted as ISO-8859-1 but stored as UTF-8 double-encoded or mangled
        # Actually, Ã© is \xC3\x83\xC2\xA9 in double-encoded UTF-8, but here it seems like the file IS UTF-8 
        # but someone wrote the literal bytes as text? Or it's ISO-8859-1.
        # Looking at "MÃ©dia", Ã is \xC3, © is \xA9. So it's UTF-8 bytes viewed as ISO-8859-1 and then saved back as UTF-8.
        # So \xC3\xA9 (é) became \xC3\x83\xC2\xA9 if it was double encoded.
        # But if the file is UTF-8 and contains the literal bytes \xC3 \xA9, it should show as é.
        # If it shows MÃ©dia, it means the file contains \xC3\x83 \xC2\xA9 (the UTF-8 for Ã and ©).
    }
    
    # More direct way: replace common mangled sequences
    replacements = [
        (b'\xc3\x83\xc2\xa9', b'\xc3\xa9'), # é
        (b'\xc3\x83\xc2\xa0', b'\xc3\xa0'), # à
        (b'\xc3\x83\xc2\xa8', b'\xc3\xa8'), # è
        (b'\xc3\x83\xc2\xaa', b'\xc3\xaa'), # ê
        (b'\xc3\x83\xc2\xb4', b'\xc3\xb4'), # ô
        (b'\xc3\x83\xc2\xa7', b'\xc3\xa7'), # ç
        (b'\xc3\x83\xc2\x89', b'\xc3\x89'), # É
        (b'\xc3\x83\xc2\x8a', b'\xc3\x8a'), # Ê
    ]
    
    # Wait, grep showed "Ã©". In a UTF-8 terminal/viewer, "Ã©" is \xC3\x83 \xC2\xA9.
    # Let's just use string replacement on decoded text if possible, or byte-level.
    
    try:
        text = content.decode('utf-8')
        text = text.replace('Ã©', 'é')
        text = text.replace('Ã ', 'à')
        text = text.replace('Ã¨', 'è')
        text = text.replace('Ãª', 'ê')
        text = text.replace('Ã´', 'ô')
        text = text.replace('Ã§', 'ç')
        text = text.replace('Ã®', 'î')
        text = text.replace('Ã¯', 'ï')
        text = text.replace('Ã¹', 'ù')
        text = text.replace('Ã«', 'ë')
        text = text.replace('Ã‰', 'É')
        text = text.replace('Ã€', 'À')
        text = text.replace('Ã²', 'ò') # just in case
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Fixed encoding for {filepath}")
    except Exception as e:
        print(f"Error fixing {filepath}: {e}")

fix_encoding('templates/index.html')
