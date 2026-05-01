def append_admin_css():
    with open('static/style.css', 'r', encoding='utf-8') as f:
        content = f.read()

    css = '''
body.dark-mode {
    --bg-color: #121212;
    --text-color: #e0e0e0;
    --card-bg: rgba(30, 30, 30, 0.8);
    --border-color: rgba(255, 255, 255, 0.1);
}
body.dark-mode.glass { background: rgba(30, 30, 30, 0.8); }
'''
    if 'body.dark-mode' not in content:
        content += css
        with open('static/style.css', 'w', encoding='utf-8') as f:
            f.write(content)

append_admin_css()
