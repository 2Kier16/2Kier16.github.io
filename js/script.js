// --- 1. Helper Function: Clean Google Drive Links ---
function cleanDriveLink(url) {
    if (!url || typeof url !== 'string') return '';
    // This fix handles both the full sharing link and just the ID
    if (url.includes('id=')) return url; // Already a clean link
    const idMatch = url.match(/[-\w]{25,}/);
    return idMatch ? `https://drive.google.com/uc?export=view&id=${idMatch[0]}` : url;
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

        // --- GLOBAL ELEMENT OVERRIDE ---
        rows.forEach(row => {
            // Check if Column K (Selector) has a value
            const selector = row.c[10] ? row.c[10].v : null; 
            const mediaUrl = cleanDriveLink(row.c[4] ? row.c[4].v : null); 

            // ONLY run this if there is a specific CSS selector and a URL
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
                        // For Hero backgrounds or sections
                        targetElement.style.backgroundImage = `url('${mediaUrl}')`;
                    }
                });
            }
        });

        // --- PAGE-SPECIFIC FILTERS ---
        // Only run these if the specific container exists on the current page
        
        // 1. COMMUNITY PAGE: Only load rows labeled 'community' in Column J
        const spotlightContainer = document.getElementById('dynamic-spotlights');
        if (spotlightContainer) {
            spotlightContainer.innerHTML = '';
            rows.forEach(row => {
                const target = row.c[9] ? row.c[9].v : ''; // Column J
                if (target.includes('community') && row.c[1]) {
                    const img = cleanDriveLink(row.c[4]?.v);
                    spotlightContainer.innerHTML += `
                        <div class="feature-card">
                            <img src="${img}" alt="Project" style="width:100%; border-radius:8px;">
                            <h3>${row.c[1].v}</h3>
                            <p>${row.c[3] ? row.c[3].v : ''}</p>
                        </div>`;
                }
            });
        }

        // 2. VETERAN RESOURCES: Only load rows labeled 'veteran-resource' in Column J
        const resourceContainer = document.getElementById('resource-container');
        if (resourceContainer) {
            resourceContainer.innerHTML = '';
            rows.forEach(row => {
                const target = row.c[9] ? row.c[9].v : ''; // Column J
                if (target.includes('veteran-resource') && row.c[1]) {
                    const img = cleanDriveLink(row.c[4]?.v);
                    const link = row.c[5] ? row.c[5].v : '#';
                    resourceContainer.innerHTML += `
                        <div class="resource-card">
                            <div class="resource-img-container">
                                <img src="${img}" alt="Resource">
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

// Initialize data load when the DOM is ready
document.addEventListener('DOMContentLoaded', loadSheetData);