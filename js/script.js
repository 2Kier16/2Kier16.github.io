// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-in forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe feature cards and steps
document.querySelectorAll('.feature-card, .step, .source').forEach(element => {
    element.style.opacity = '0';
    observer.observe(element);
});

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Typewriter Effect for Hero Title
const heroTitle = document.querySelector('.hero-content h1');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    const span = document.createElement('span');
    span.classList.add('typing-cursor');
    heroTitle.appendChild(span);
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            span.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 75); // Typing speed in ms
        } else {
            const subtext = document.querySelector('.hero-subtext');
            if (subtext) subtext.classList.add('visible');
        }
    }
    
    setTimeout(typeWriter, 500); // 500ms start delay
}

// Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Log when page loads
console.log('MoodMix webpage loaded successfully!');
