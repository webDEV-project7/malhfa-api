try:
    with open('static/store.js', 'r', encoding='utf-8') as f:
        compile(f.read(), 'static/store.js', 'exec')
    print("store.js is syntactically valid (ignoring JS-specific but checking for general structure)")
except SyntaxError as e:
    print("Syntax Error in store.js:", e)
except Exception as e:
    # Compile for python might fail due to JS syntax, let's use a simple regex check for missing backticks or common issues
    pass

with open('static/store.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Check for unclosed templates or weird characters
if content.count('') % 2 != 0:
    print("Found unclosed backticks in store.js!")
else:
    print("Backticks are balanced.")

# Check for the specific functions
if 'loadCollectionsPage' in content:
    print("Found loadCollectionsPage")
else:
    print("MISSING loadCollectionsPage")
