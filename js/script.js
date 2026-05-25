// --- 1. Helper Function: Clean Google Drive Links ---
function cleanDriveLink(url) {
    if (!url || typeof url !== 'string') return '';
    // Handle both full sharing URLs and direct file IDs
    if (url.includes('id=')) return url;
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
            const title = row.c[1] ? row.c[1].v : ''; // Column B: Title
            const selector = row.c[10] ? row.c[10].v : null; // Column K: CSS Selector
            const mediaUrl = cleanDriveLink(row.c[4] ? row.c[4].v : null); // Column E: Media URL

            // 1. GLOBAL LOGO OVERRIDE: Applies the K.V.T. logo to site-wide header and footer
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
                
                // Apply to hero backgrounds
                document.querySelectorAll('.hero-index, .hero-heritage, .hero-advocacy').forEach(element => {
                    element.style.setProperty('--hero-bg', `url('${finalCrestUrlForBackground}')`);
                });

                // Apply to the specific <img> tag on the heritage page
                const heritageCrestImg = document.getElementById('heritage-mastercrest-image');
                if (heritageCrestImg) {
                    heritageCrestImg.setAttribute('referrerpolicy', 'no-referrer');
                    heritageCrestImg.src = finalCrestUrlForBackground;
                }
            }

            // 3. COMMUNITY CREST VIDEO OVERRIDE: Play video once before showing overlay and text
            if (title.toLowerCase().includes('comcrestanimated')) {
                const comVid = document.getElementById('community-hero-vid');
                const comHero = document.querySelector('.community-hero-exclusive');
                
                if (comVid && comHero) {
                    // Hardcoded local source to guarantee reliability and prevent network delays
                    const finalVideoUrl = 'assets/videos/ComCrestAnimated.mp4';
                    
                    // Create <source> element for better mobile browser compatibility
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
                    comVid.loop = false; // Disable initial loop to detect when the first playthrough ends
                    
                    comVid.addEventListener('ended', function onFirstEnd() {
                        comHero.classList.add('content-revealed');
                        comVid.loop = true; // Loop continuously after initial reveal
                        comVid.play().catch(err => console.log("Autoplay prevented:", err));
                        comVid.removeEventListener('ended', onFirstEnd);
                    });

                    comHero.classList.add('has-video');
                    comVid.play().catch(err => console.log("Autoplay prevented:", err));
                }
            }

            // HARDCODE LOCK: Protect artists and ALL hero background images from being overwritten by the API.
            // Exception: '#hero-community' is allowed so the static crest image can load as a fallback.
            const isHardcoded = selector ? (selector.includes('#artist-') || (selector.includes('hero') && selector !== '#hero-community')) : false;
            
            // ENABLE ALL IMAGES: Process entries that map to valid selectors
            if (selector && selector !== 'none' && mediaUrl && !isHardcoded) {
                // Ignore broken sheet references
                if (selector.includes('#N/A') || selector.includes('#REF!')) return;

                try {
                    const targetElements = document.querySelectorAll(selector);
                    
                    targetElements.forEach(targetElement => {
                        let finalUrl = mediaUrl;
                        
                        // Swap to Google's reliable image delivery network to bypass 403 blocks for images
                        if (finalUrl.includes('drive.google.com/uc?export=view&id=')) {
                            if (targetElement.tagName === 'IMG' || targetElement.tagName !== 'VIDEO') {
                                finalUrl = finalUrl.replace('drive.google.com/uc?export=view&id=', 'lh3.googleusercontent.com/d/');
                            }
                        }

                        if (targetElement.tagName === 'IMG') {
                            targetElement.setAttribute('referrerpolicy', 'no-referrer');
                            targetElement.src = finalUrl;
                            
                            // Append dynamic titles under MoodMix gallery screenshots
                            if (targetElement.closest('.gallery-grid') && row.c[3] && row.c[3].v) {
                                let titleElement = document.createElement('p');
                                titleElement.textContent = row.c[3].v; // Column D: description
                                titleElement.classList.add('screenshot-title');
                                targetElement.parentNode.appendChild(titleElement);
                            }
                        } else if (targetElement.tagName === 'VIDEO') {
                            // Demo video logic: map to local asset and increase speed
                            if (selector === '#moodmix-demo-video') {
                                finalUrl = 'assets/videos/demovid.mp4';
                                targetElement.playbackRate = 1.25;
                            } else {
                                // Switch view links to download links to ensure video streamability
                                if (finalUrl.includes('drive.google.com/uc?export=view&id=')) {
                                    finalUrl = finalUrl.replace('export=view', 'export=download');
                                }
                            }
                            targetElement.setAttribute('referrerpolicy', 'no-referrer');
                            const source = targetElement.querySelector('source');
                            if (source) {
                                source.src = finalUrl;
                            } else {
                                targetElement.src = finalUrl;
                            }
                            targetElement.load();
                            targetElement.muted = true; // Required to bypass strict browser autoplay policies
                            targetElement.play().catch(err => console.log("Autoplay prevented:", err));
                        } else { 
                            // Handle non-media tags (like divs) by applying the image as a background
                            targetElement.style.backgroundImage = `url('${finalUrl}')`;
                            targetElement.style.setProperty('--hero-bg', `url('${finalUrl}')`);
                        }
                    });
                } catch (error) {
                    console.warn(`Skipping invalid database selector: ${selector}`, error);
                }
            }
        });

        // --- PAGE-SPECIFIC FILTERS ---
        // Render content only if the target container exists in the current DOM
        
        // 1. COMMUNITY PAGE
        const spotlightContainer = document.getElementById('dynamic-spotlights');
        if (spotlightContainer) {
            spotlightContainer.innerHTML = '';
            let hasSpotlights = false;
            rows.forEach(row => {
                const target = row.c[9] ? row.c[9].v : ''; // Column J: Page Target
                const selector = row.c[10] ? row.c[10].v : ''; // Column K: CSS Selector
                
                // Exclude hero elements from the community spotlight list
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

        // 2. VETERAN RESOURCES
        const resourceContainer = document.getElementById('resource-container');
        if (resourceContainer) {
            resourceContainer.innerHTML = '';
            rows.forEach(row => {
                const target = row.c[9] ? row.c[9].v : ''; // Column J: Page Target
                const selector = row.c[10] ? row.c[10].v : ''; // Column K: CSS Selector
                
                // Exclude the hero background from the resources list
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

// Bootstrap the data loading flow once the document is ready
document.addEventListener('DOMContentLoaded', loadSheetData);