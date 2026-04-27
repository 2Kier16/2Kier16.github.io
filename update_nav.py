﻿import re
import os

files = [
    'about.html', 'advocacy.html', 'art-gallery.html', 'books-n-books.html', 
    'coffee-shop.html', 'community.html', 'heritage.html', 'hobbiest.html', 
    'index.html', 'moodmix.html', 'music.html', 'resume.html', 'story.html', 'veteran-resources.html'
]

# regex to find the nav-links block
pattern = re.compile(r'<nav class="nav-links">.*?</nav>', re.DOTALL)

def repl(match):
    nav_block = match.group(0)
    
    # Logic: If we are on index.html, we use hashes. If on subpages, we link back to index.html#section
    # Or keep your original logic if you prefer:
    has_home_hash = 'index.html#home' in nav_block
    has_contact = 'index.html#contact' in nav_block
    
    # Check which arrow style was used previously
    arrow = '▾' if '▾' in nav_block else '▼'

    new_nav = '            <nav class="nav-links">\n'
    
    # Home Link
    home_url = "index.html#home" if has_home_hash else "index.html"
    new_nav += f'                <a href="{home_url}">Home</a>\n'
    
    # Main Links
    new_nav += '                <a href="moodmix.html">MoodMix</a>\n'
    new_nav += '                <a href="heritage.html">Heritage Project</a>\n'
    new_nav += '                <a href="community.html">Community</a>\n'
    
    # About Me Dropdown
    new_nav += (
        '                <div class="dropdown">\n'
        f'                    <a href="#" onclick="event.preventDefault()">About Me {arrow}</a>\n'
        '                    <div class="dropdown-content">\n'
        '                        <a href="about.html">My Story</a>\n'
        '                        <a href="resume.html">Resume</a>\n'
        '                    </div>\n'
        '                </div>\n'
    )

    # Pathways Dropdown
    new_nav += (
        '                <div class="dropdown">\n'
        f'                    <a href="#" onclick="event.preventDefault()">Pathways {arrow}</a>\n'
        '                    <div class="dropdown-content">\n'
        '                        <a href="music.html">Music</a>\n'
        '                        <a href="veteran-resources.html">Vet Resources</a>\n'
        '                        <a href="advocacy.html">Advocacy</a>\n'
        '                        <a href="art-gallery.html">Art Gallery</a>\n'
        '                        <a href="coffee-shop.html">Coffee Shop</a>\n'
        '                        <a href="books-n-books.html">Books n Books</a>\n'
        '                        <a href="hobbiest.html">Hobbiest</a>\n'
        '                    </div>\n'
        '                </div>\n'
    )
    
    # Contact Link
    if has_contact:
        new_nav += '                <a href="index.html#contact">Contact</a>\n'
        
    new_nav += '            </nav>'
    return new_nav

for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = pattern.sub(repl, content)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ Updated {file}")
    else:
        print(f"⚠️ Skipping {file} (File not found)")