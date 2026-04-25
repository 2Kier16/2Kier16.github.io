// 1. Navigation & Animations
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-in forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .step, .source').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// 2. Mobile Menu
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// 3. Google Drive Image Translator
function cleanDriveLink(link) {
    if (!link || link === "") return 'assets/gen.jpg'; 
    const regex = /\/d\/([^\/]+)/;
    const match = link.match(regex);
    if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return link; 
}

// 4. Data Loading Logic (Community Spotlights & Vet Resources)
async function loadSheetData() {
    // UPDATE THIS ID with your 1hO0apm... ID
    const sheetID = '1hO0apmZIVnENyl6Mlh8AtCX5vS9Amp6Jn9k9L0Eu7T0';
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        const data = JSON.parse(text.substr(47).slice(0, -2));
        const rows = data.table.rows;

        // Logic for Community Page Spotlights
        const spotlightContainer = document.getElementById('dynamic-spotlights');
        if (spotlightContainer) {
            spotlightContainer.innerHTML = '';
            rows.forEach(row => {
                const img = cleanDriveLink(row.c[4] ? row.c[4].v : null);
                spotlightContainer.innerHTML += `
                    <div class="feature-card">
                        <img src="${img}" alt="Project" style="width:100%; border-radius:8px;" onerror="this.src='assets/gen.jpg';">
                        <h3>${row.c[1] ? row.c[1].v : 'Untitled'}</h3>
                        <p>${row.c[3] ? row.c[3].v : ''}</p>
                    </div>`;
            });
        }

        // Logic for Veteran Resources Page
        const resourceContainer = document.getElementById('resource-container');
        if (resourceContainer) {
            resourceContainer.innerHTML = '';
            rows.forEach(row => {
                const img = cleanDriveLink(row.c[4] ? row.c[4].v : null);
                resourceContainer.innerHTML += `
                    <div class="resource-card">
                        <div class="resource-img-container">
                            <img src="${img}" alt="Resource" onerror="this.src='assets/gen.jpg';">
                        </div>
                        <div class="resource-content">
                            <h3><a href="${row.c[5] ? row.c[5].v : '#'}" target="_blank">${row.c[1] ? row.c[1].v : 'Untitled'}</a></h3>
                            <p>${row.c[3] ? row.c[3].v : ''}</p>
                            <a href="${row.c[5] ? row.c[5].v : '#'}" target="_blank" class="read-more-btn">View Resource &rarr;</a>
                        </div>
                    </div>`;
            });
        }
    } catch (e) { console.error("Sheet Load Error:", e); }
}

// 5. Community Form Submission (The Gatekeeper)
const communityForm = document.getElementById('community-form');
if (communityForm) {
    communityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('.submit-btn');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        fetch('https://script.google.com/macros/s/AKfycbz_1xpdxHC0nm-W0rpK_qsjMP1r4YyxOqQ-_BB2h97kH7C_gvlZTLXTWwMaA6TUO7hm/exec', {
            method: 'POST',
            body: new FormData(this),
            mode: 'no-cors'
        }).then(() => {
            alert('Success! Your creation has been sent to K.V.T. for approval.');
            this.reset();
            btn.textContent = 'Send to K.V.T.';
            btn.disabled = false;
        }).catch(err => {
            alert('Error sending. Please try again.');
            btn.disabled = false;
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSheetData();
});