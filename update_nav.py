﻿import re
import os

files = [
    'about.html', 'advocacy.html', 'art-gallery.html', 'books-n-books.html', 
    'brew-tech.html', 'coffee-origins.html', 'coffee-shop.html', 'community.html', 
    'heritage.html', 'hobbiest.html', 'index.html', 'latte-art.html', 
    'moodmix.html', 'music.html', 'resume.html', 'story.html', 'veteran-resources.html'
]

# Regex patterns
nav_pattern = re.compile(r'<nav class="nav-links">.*?</nav>', re.DOTALL)
footer_pattern = re.compile(r'<div class="footer-links-style">.*?</div>', re.DOTALL)

def repl_nav(match):
    nav_block = match.group(0)
    has_home_hash = 'index.html#home' in nav_block
    has_contact = 'index.html#contact' in nav_block
    arrow = '▾' if '▾' in nav_block else '▼'

    new_nav = '            <nav class="nav-links">\n'
    home_url = "index.html#home" if has_home_hash else "index.html"
    new_nav += f'                <a href="{home_url}">Home</a>\n'
    new_nav += '                <a href="moodmix.html">MoodMix</a>\n'
    new_nav += '                <a href="heritage.html">Heritage Project</a>\n'
    new_nav += '                <a href="community.html">Community</a>\n'
    new_nav += (
        '                <div class="dropdown">\n'
        f'                    <a href="#" onclick="event.preventDefault()">About Me {arrow}</a>\n'
        '                    <div class="dropdown-content">\n'
        '                        <a href="about.html">My Story</a>\n'
        '                        <a href="resume.html">Resume</a>\n'
        '                    </div>\n'
        '                </div>\n'
    )
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
    if has_contact:
        new_nav += '                <a href="index.html#contact">Contact</a>\n'
    new_nav += '            </nav>'
    return new_nav

def repl_footer(match):
    return (
        '<div class="footer-links-style">\n'
        '                <a href="index.html#home">Home</a> |\n'
        '                <a href="index.html#moodmix">MoodMix</a> |\n'
        '                <a href="music.html">Music</a> |\n'
        '                <a href="heritage.html">The Heritage Project</a> |\n'
        '                <a href="community.html">Community</a> |\n'
        '                <a href="resume.html">Professional Profile</a> |\n'
        '                <a href="about.html">About</a> |\n'
        '                <a href="moodmix-privacy.html">Privacy Policy</a>\n'
        '            </div>'
    )

for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        content = nav_pattern.sub(repl_nav, content)
        content = footer_pattern.sub(repl_footer, content)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Updated {file}")
    else:
        print(f"⚠️ Skipping {file} (File not found)")