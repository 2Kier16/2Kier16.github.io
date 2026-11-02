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
            const title = row.c[1] ? row.c[1].v : ''; // Column B (Title)
            // Check if Column K (Selector) has a value
            const selector = row.c[10] ? row.c[10].v : null; 
            const mediaUrl = cleanDriveLink(row.c[4] ? row.c[4].v : null); 

            // 1. GLOBAL LOGO OVERRIDE: Automatically apply the K.V.T. logo to header and footer
            if ((title.toLowerCase().includes('kvtlogowb') || title.toLowerCase().includes('k.v.t logo') || title.toLowerCase().includes('site logo')) && mediaUrl) {
                let finalLogoUrl = mediaUrl.replace('drive.google.com/uc?export=view&id=', 'lh3.googleusercontent.com/d/');
                document.querySelectorAll('.logo-img, .signature-logo').forEach(img => {
                    img.setAttribute('referrerpolicy', 'no-referrer');
                    img.src = finalLogoUrl;
                });
            }

            // 2. MASTER CREST OVERRIDE: Guarantee the master crest is always applied to the home hero AND heritage page image
            if (title.toLowerCase().includes('mastercrest') && mediaUrl) {
                  // Use Google's direct image serving domain for backgrounds (more reliable for CSS)
                let finalCrestUrlForBackground = mediaUrl.replace('drive.google.com/uc?export=view&id=', 'lh3.googleusercontent.com/d/');
                // Use the original cleaned Google Drive URL for <img> src (sometimes more compatible)
                let finalCrestUrlForImg = mediaUrl; 
                  // Apply to hero backgrounds
                document.querySelectorAll('.hero-index, .hero-heritage, .hero-advocacy').forEach(element => {
                                        element.style.setProperty('--hero-bg', `url('${finalCrestUrlForBackground}')`);
                });

                // Apply to the specific <img> tag on the heritage page
                const heritageCrestImg = document.getElementById('heritage-mastercrest-image');
                if (heritageCrestImg) {
                    heritageCrestImg.setAttribute('referrerpolicy', 'no-referrer');
                    heritageCrestImg.src = finalCrestUrlForImg;
                }
            }

            // 3. COMMUNITY CREST VIDEO OVERRIDE: Play video once before showing overlay and text
            if (title.toLowerCase().includes('comcrestanimated') && mediaUrl) {
                const comVid = document.getElementById('community-hero-vid');
                const comHero = document.querySelector('.community-hero-exclusive');
                
                if (comVid && comHero) {
                    comVid.setAttribute('referrerpolicy', 'no-referrer');
                    
                    let finalVideoUrl = mediaUrl;
                    if (finalVideoUrl.includes('drive.google.com/uc?export=view&id=')) {
                        finalVideoUrl = finalVideoUrl.replace('export=view', 'export=download');
                    }
                    
                    // Use a source element for better mobile browser compatibility
                    let source = comVid.querySelector('source');
                    if (!source) {
                        source = document.createElement('source');
                        source.type = 'video/mp4';
                        comVid.appendChild(source);
                    }
                    source.src = finalVideoUrl;
                    
                    comVid.load();
                    comVid.muted = true;
                    comVid.playsInline = true;
                    comVid.loop = false; // Initially false so 'ended' fires
                    
                    comVid.addEventListener('ended', function onFirstEnd() {
                        comHero.classList.add('content-revealed');
                        comVid.loop = true; // Set to loop continuously
                        comVid.play().catch(err => console.log("Autoplay prevented:", err));
                        comVid.removeEventListener('ended', onFirstEnd);
                    });

                    comHero.classList.add('has-video');
                    comVid.play().catch(err => console.log("Autoplay prevented:", err));
                }
            }

            // HARDCODE LOCK: Protect artists and ALL hero background images from being overwritten by the API.
            // Exception: Allow '#hero-community' specifically so the static crest image on the community page can load.
            const isHardcoded = selector ? (selector.includes('#artist-') || (selector.includes('hero') && selector !== '#hero-community')) : false;
            
            // ENABLE ALL IMAGES: Allow everything except specifically hardcoded sections
            if (selector && selector !== 'none' && mediaUrl && !isHardcoded) {
                // Prevent Google Sheet errors (like #N/A or #REF!) from crashing the query selector
                if (selector.includes('#N/A') || selector.includes('#REF!')) return;

                try {
                    const targetElements = document.querySelectorAll(selector);
                    
                    targetElements.forEach(targetElement => {
                        let finalUrl = mediaUrl;
                        
                        // If it's an image or background, swap to Google's reliable image delivery network to bypass 403 blocks
                        if (finalUrl.includes('drive.google.com/uc?export=view&id=')) {
                            if (targetElement.tagName === 'IMG' || targetElement.tagName !== 'VIDEO') {
                                finalUrl = finalUrl.replace('drive.google.com/uc?export=view&id=', 'lh3.googleusercontent.com/d/');
                            }
                        }

                        if (targetElement.tagName === 'IMG') {
                            targetElement.setAttribute('referrerpolicy', 'no-referrer');
                            targetElement.src = finalUrl;
                        } else if (targetElement.tagName === 'VIDEO') {
                            if (finalUrl.includes('drive.google.com/uc?export=view&id=')) {
                                finalUrl = finalUrl.replace('export=view', 'export=download');
                            }
                            source.src = finalUrl;
                            targetElement.load();
                            // Guarantee the video auto-plays after fetching from Drive
                            targetElement.muted = true; // Fixes strict browser autoplay policies
                            targetElement.play().catch(err => console.log("Autoplay prevented:", err));
                        } else {
                            // For Hero backgrounds or sections
                            targetElement.style.backgroundImage = `url('${finalUrl}')`;
                            // Pass the image URL to CSS variables so pseudo-elements (like ::after) can use it!
                            targetElement.style.setProperty('--hero-bg', `url('${finalUrl}')`);
                        }
                    });
                } catch (error) {
                    console.warn(`Skipping invalid database selector: ${selector}`, error);
                }
            }
        });

        // --- PAGE-SPECIFIC FILTERS ---
        // Only run these if the specific container exists on the current page
        
        
        // 1. COMMUNITY PAGE: Only load rows labeled 'community' in Column J
        const spotlightContainer = document.getElementById('dynamic-spotlights');
        if (spotlightContainer) {
            spotlightContainer.innerHTML = '';
            let hasSpotlights = false;
            rows.forEach(row => {
                const target = row.c[9] ? row.c[9].v : ''; // Column J
                const selector = row.c[10] ? row.c[10].v : ''; // Column K
                
                // Filter out the hero background video and crest from showing up as spotlights
                if (target.includes('community') && row.c[1] && !selector.includes('hero')) {
                    const img = cleanDriveLink(row.c[4]?.v);
                    spotlightContainer.innerHTML += `
                        <div class="feature-card">
                            ${img ? `<img src="${img}" alt="Project" style="width:100%; border-radius:8px; margin-bottom:1rem;">` : ''}
                            <h3>${row.c[1].v}</h3>
                            <p>${row.c[3] ? row.c[3].v : ''}</p>
                        </div>`;
                    hasSpotlights = true;
                }
            });
            if (!hasSpotlights) {
                spotlightContainer.innerHTML = '<p class="text-center" style="width:100%; grid-column: 1 / -1; color: var(--text-light);">No community projects submitted yet. Be the first!</p>';
            }
        }

        // 2. VETERAN RESOURCES: Only load rows labeled 'veteran-resource' in Column J
        const resourceContainer = document.getElementById('resource-container');
        if (resourceContainer) {
            resourceContainer.innerHTML = '';
            rows.forEach(row => {
                const target = row.c[9] ? row.c[9].v : ''; // Column J
                const selector = row.c[10] ? row.c[10].v : ''; // Column K
                
                // Filter out the veteran hero background from the resources list
                if (target.includes('veteran-resource') && row.c[1] && !selector.includes('hero')) {
                    const img = cleanDriveLink(row.c[4]?.v);
                    const link = row.c[5] ? row.c[5].v : '#';
                    resourceContainer.innerHTML += `
                        <div class="resource-card">
                            <div class="resource-img-container">
                                ${img ? `<img src="${img}" alt="Resource">` : ''}
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