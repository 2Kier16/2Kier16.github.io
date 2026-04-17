﻿import os
import re

files = ['about.html', 'community.html', 'heritage.html', 'index.html', 'moodmix.html', 'music.html', 'resume.html', 'story.html']

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to find the nav-links block
    pattern = re.compile(r'<nav class="nav-links">.*?</nav>', re.DOTALL)
    
    def repl(match):
        nav_block = match.group(0)
        
        # Determine the base links by extracting them or we can just reconstruct based on what's there
        # Let's see what's currently in the nav
        has_home_hash = 'href="index.html#home"' in nav_block
        has_resume_prof = 'href="resume.html">Professional Profile' in nav_block
        has_contact = 'href="index.html#contact"' in nav_block
        has_download = 'href="moodmix.html#download"' in nav_block
        
        # Build the new block
        new_nav = '            <nav class="nav-links">\n'
        
        if has_home_hash:
            new_nav += '                <a href="index.html#home">Home</a>\n'
        else:
            new_nav += '                <a href="index.html">Home</a>\n'
            
        new_nav += '                <a href="moodmix.html">MoodMix</a>\n'
        new_nav += '                <a href="heritage.html">The Heritage Project</a>\n'
        
        arrow = '▾' if '▾' in nav_block else '▼'
        if '▼' not in nav_block and '▾' not in nav_block:
             arrow = '▼'
             
        new_nav += '                <div class="dropdown">\n'
        new_nav += f'                    <a href="#" onclick="event.preventDefault()">KVT Links {arrow}</a>\n'
        new_nav += '                    <div class="dropdown-content">\n'
        new_nav += '                        <a href="community.html">Community</a>\n'
        new_nav += '                        <a href="music.html">Music</a>\n'
        new_nav += '                        <a href="veteran-resources.html">Veteran Resources</a>\n'
        new_nav += '                    </div>\n'
        new_nav += '                </div>\n'
        
        if has_resume_prof:
            new_nav += '                <a href="resume.html">Professional Profile</a>\n'
        else:
            new_nav += '                <a href="resume.html">Resume</a>\n'
            
        new_nav += '                <a href="about.html">About</a>\n'
        
        if has_contact:
            new_nav += '                <a href="index.html#contact">Contact</a>\n'
            
        if has_download:
            new_nav += '                <a href="moodmix.html#download">Download</a>\n'
            
        new_nav += '            </nav>'
        return new_nav
        
    new_content = pattern.sub(repl, content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)
