import re

with open('templates/index.html', 'rb') as f:
    content = f.read()

target = b'''                <div class="header-actions" style="align-items: center;">
                    <span style="font-weight: 500; margin-right: 1rem;"><i class='bx bxs-user-circle'></i> {{
                        user.username }} ({{ user.role }})</span>
                    <a href="/logout" class="btn btn-outline"
                        style="padding: 0.4rem 0.8rem; border-color: var(--danger); color: var(--danger);"><i
                            class='bx bx-log-out'></i> D\xc3\xa9connexion</a>
                </div>'''

replacement = b'''                <div class="header-actions" style="align-items: center; display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline" id="admin-lang-btn" onclick="toggleAdminLang(event)" title="Langue" style="padding: 0.4rem; border: none; font-size: 1.2rem; cursor: pointer;">
                        <i class='bx bx-globe'></i>
                    </button>
                    <div id="admin-lang-menu" style="display:none; position:absolute; top:50px; background:white; border:1px solid #ddd; padding:0.5rem; border-radius:8px; z-index:100; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <a href="#" onclick="setAdminLang('fr'); return false;" style="display:block; padding:0.3rem 1rem; color:#333; text-decoration:none;">FR</a>
                        <a href="#" onclick="setAdminLang('en'); return false;" style="display:block; padding:0.3rem 1rem; color:#333; text-decoration:none;">EN</a>
                        <a href="#" onclick="setAdminLang('ar'); return false;" style="display:block; padding:0.3rem 1rem; color:#333; text-decoration:none;">AR</a>
                    </div>
                    
                    <button class="btn btn-outline" id="admin-theme-toggle" title="Mode Sombre" style="padding: 0.4rem; border: none; font-size: 1.2rem; cursor: pointer;">
                        <i class='bx bx-moon'></i>
                    </button>
                    
                    <span style="font-weight: 500; margin-left: 0.5rem; margin-right: 0.5rem;"><i class='bx bxs-user-circle'></i> {{
                        user.username }} ({{ user.role }})</span>
                    <a href="/logout" class="btn btn-outline"
                        style="padding: 0.4rem 0.8rem; border-color: var(--danger); color: var(--danger);"><i
                            class='bx bx-log-out'></i> D\xc3\xa9connexion</a>
                </div>'''

# Windows might have injected \r\n, so let's smartly replace by just finding header-actions
# Since we know the file is windows or unix lines, byte replace is safest if we allow flexible regex
# Using regex on bytes
pattern = b'<div class="header-actions" style="align-items: center;">.*?D\xc3\xa9connexion</a>\r?\n\s*</div>'
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('templates/index.html', 'wb') as f:
    f.write(content)
