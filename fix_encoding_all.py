import os

def fix_encoding(filepath):
    if not os.path.isfile(filepath):
        return
    with open(filepath, 'rb') as f:
        content = f.read()
    
    try:
        text = content.decode('utf-8')
        replacements = {
            'Ã©': 'é', 'Ã ': 'à', 'Ã¨': 'è', 'Ãª': 'ê', 'Ã´': 'ô', 
            'Ã§': 'ç', 'Ã®': 'î', 'Ã¯': 'ï', 'Ã¹': 'ù', 'Ã«': 'ë', 
            'Ã‰': 'É', 'Ã€': 'À', 'Ã‹': 'Ë', 'Ãˆ': 'È', 'ÃŽ': 'Î',
            'Ã ': 'à', 'Ã‚': 'Â', 'Ã¢': 'â', 'Ã†': 'Æ', 'Ã¦': 'æ'
        }
        
        changed = False
        for k, v in replacements.items():
            if k in text:
                text = text.replace(k, v)
                changed = True
        
        if changed:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(text)
            print(f"Fixed encoding for {filepath}")
    except Exception as e:
        # print(f"Skipping {filepath}: {e}")
        pass

for root, dirs, files in os.walk('templates'):
    for file in files:
        if file.endswith('.html'):
            fix_encoding(os.path.join(root, file))

for root, dirs, files in os.walk('static'):
    for file in files:
        if file.endswith(('.js', '.css')):
            fix_encoding(os.path.join(root, file))
