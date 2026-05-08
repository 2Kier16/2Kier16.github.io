// --- 1. Helper Function: Clean Google Drive Links ---
function cleanDriveLink(img) {
    if (!img) return '';
    // Fix: Ensures we return 'img' and replace the link parts correctly
    return img.replace('file/d/', 'uc?export=view&id=').replace('/view?usp=sharing', '').replace('/view', '');
}

// --- 2. Main Data Loading Logic ---
async function loadSheetData() {
    const sheetID = '1hO0apmZIVnENyl6Mlh8AtCX5vS9Amp6Jn9k9L0Eu7T0';
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        const data = JSON.parse(text.substr(47).slice(0, -2));
        const rows = data.table.rows;

        // --- GLOBAL ELEMENT OVERRIDE  ---
        rows.forEach(row => {
            const selector = row.c[10] ? row.c[10].v : null; // Column K
            const mediaUrl = cleanDriveLink(row.c[4] ? row.c[4].v : null); // Column E

            if (selector && selector !== 'none' && mediaUrl) {
                const targetElements = document.querySelectorAll(selector);
                
                targetElements.forEach(targetElement => {
                    if (targetElement.tagName === 'IMG') {
                        targetElement.src = mediaUrl;
                    } else if (targetElement.tagName === 'VIDEO') {
                        const source = targetElement.querySelector('source') || targetElement;
                        source.src = mediaUrl;
                        targetElement.load();
                    } else {
                        // For Hero backgrounds or div sections
                        targetElement.style.backgroundImage = `url('${mediaUrl}')`;
                        targetElement.style.backgroundSize = 'cover';
                        targetElement.style.backgroundPosition = 'center';
                    }
                });
            }
        });

        // --- COMMUNITY PAGE: Dynamic Spotlights ---
        const spotlightContainer = document.getElementById('dynamic-spotlights');
        if (spotlightContainer) {
            spotlightContainer.innerHTML = '';
            rows.forEach(row => {
                if(row.c[1] && row.c[1].v) { // Column B: Title
                    const img = cleanDriveLink(row.c[4] ? row.c[4].v : null);
                    spotlightContainer.innerHTML += `
                        <div class="feature-card">
                            <img src="${img}" alt="Project" style="width:100%; border-radius:8px;" onerror="this.src='assets/kvtlogowb.png';">
                            <h3>${row.c[1].v}</h3>
                            <p>${row.c[3] ? row.c[3].v : ''}</p>
                        </div>`;
                }
            });
        }

        // --- VETERAN RESOURCES PAGE: Resource Cards ---
        const resourceContainer = document.getElementById('resource-container');
        if (resourceContainer) {
            resourceContainer.innerHTML = '';
            rows.forEach(row => {
                if(row.c[1] && row.c[1].v) { // Column B: Title
                    const img = cleanDriveLink(row.c[4] ? row.c[4].v : null);
                    const link = row.c[5] ? row.c[5].v : '#'; // Column F: Link
                    resourceContainer.innerHTML += `
                        <div class="resource-card">
                            <div class="resource-img-container">
                                <img src="${img}" alt="Resource" onerror="this.src='assets/kvtlogowb.png';">
                            </div>
                            <div class="resource-content">
                                <h3><a href="${link}" target="_blank">${row.c[1].v}</a></h3>
                                <p>${row.c[3] ? row.c[3].v : ''}</p>
                                <a href="${link}" target="_blank" class="read-more-btn">View Resource &rarr;</a>
                            </div>
                        </div>`;
                }
            });
        }

    } catch (e) { 
        console.error("Sheet Load Error:", e); 
    }
}

// --- 3. Initialize & Mobile Menu ---
document.addEventListener('DOMContentLoaded', () => {
    loadSheetData();

    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});