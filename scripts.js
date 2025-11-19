// Load content from JSON file
async function loadContent() {
    try {
        const response = await fetch('content.json');
        const data = await response.json();

        // Populate all sections
        populateMetadata(data);
        populateNavigation(data);
        populateHero(data);
        populateExpertise(data);
        populateProjects(data);
        populateApplications(data);
        populateExperience(data);
        populateContact(data);
        populateFooter(data);

        // Initialize animations after content is loaded
        initializeAnimations();
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Populate page metadata
function populateMetadata(data) {
    document.title = `${data.personal.name} - ${data.personal.title}`;
}

// Populate navigation
function populateNavigation(data) {
    const logo = document.getElementById('logo');

    // If an <img> is already present (e.g., set in HTML), don't override it
    const hasImageLogo = !!logo.querySelector('img');

    if (!hasImageLogo) {
        // Prefer an image; default to VL.png; final fallback to text
        const imgSrc = (data && data.personal && (data.personal.logoImage || data.personal.logoUrl)) || 'VL.png';

        if (imgSrc) {
            // Replace any text with a linked image logo
            logo.innerHTML = '';
            const a = document.createElement('a');
            a.href = '#home';
            a.setAttribute('aria-label', 'Go to home');
            a.onclick = closeMenu;

            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = (data && data.personal && data.personal.name) ? `${data.personal.name} logo` : 'Logo';

            a.appendChild(img);
            logo.appendChild(a);
        } else if (data && data.personal && data.personal.logo) {
            // Fallback to text logo if no image available
            logo.textContent = data.personal.logo;
        }
    }

    // Build nav links (clear first to avoid duplicates if re-run)
    const navLinks = document.getElementById('navLinks');
    navLinks.innerHTML = '';
    data.navigation.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.label;
        a.onclick = closeMenu;
        li.appendChild(a);
        navLinks.appendChild(li);
    });
}

// Populate hero section
function populateHero(data) {
    // 1. Set Heading (Keep the name styling)
    const heroHeading = document.getElementById('heroHeading');
    // Note: We are splitting the greeting and name to style them
    heroHeading.innerHTML = `${data.hero.greeting} <br> <span class="name">${data.personal.name}</span>`;

    // 2. Buttons
    const ctaButtons = document.getElementById('ctaButtons');
    ctaButtons.innerHTML = ''; // Clear existing if any
    data.hero.cta.forEach(button => {
        const a = document.createElement('a');
        a.href = button.href;
        a.textContent = button.text;
        a.className = `btn btn-${button.type}`;
        ctaButtons.appendChild(a);
    });

    // 3. Typewriter Effect for Tagline
    const taglineText = data.personal.tagline;
    const taglineElement = document.getElementById('heroTagline');
    taglineElement.textContent = ''; // Clear initial text

    let i = 0;
    const typeSpeed = 50; // Milliseconds per char
    const startDelay = 1000; // Wait 1s before typing starts (after other animations)

    function typeWriter() {
        if (i < taglineText.length) {
            taglineElement.textContent += taglineText.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        }
    }

    // Start typing after delay
    setTimeout(typeWriter, startDelay);

    // 4. 3D Tilt Effect on Mouse Move (Micro-interaction)
    const heroSection = document.querySelector('.hero');
    const content = document.querySelector('.hero-content');

    heroSection.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 25;
        const y = (window.innerHeight / 2 - e.pageY) / 25;

        // Move content slightly opposite to mouse
        content.style.transform = `translate(${x}px, ${y}px)`;

        // Move blobs slightly with mouse for parallax
        const blobs = document.querySelectorAll('.blob');
        blobs.forEach(blob => {
            const speed = blob.classList.contains('blob-1') ? 2 : -2;
            blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}

// Populate expertise section with Spotlight Effect
function populateExpertise(data) {
    const expertiseTitle = document.getElementById('expertiseTitle');
    expertiseTitle.textContent = data.expertise.title;

    const expertiseGrid = document.getElementById('expertiseGrid');
    expertiseGrid.innerHTML = ''; // Clear existing content

    data.expertise.cards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'expertise-card';

        const h3 = document.createElement('h3');
        h3.textContent = card.title;

        const p = document.createElement('p');
        p.textContent = card.description;

        const techTags = document.createElement('div');
        techTags.className = 'tech-tags';

        card.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            techTags.appendChild(span);
        });

        cardDiv.appendChild(h3);
        cardDiv.appendChild(p);
        cardDiv.appendChild(techTags);

        // --- MOUSE MOVE SPOTLIGHT LOGIC ---
        cardDiv.addEventListener('mousemove', (e) => {
            const rect = cardDiv.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set CSS variables for the spotlight position
            cardDiv.style.setProperty('--mouse-x', `${x}px`);
            cardDiv.style.setProperty('--mouse-y', `${y}px`);
        });

        expertiseGrid.appendChild(cardDiv);
    });
}

function populateProjects(data) {
    const projectsTitle = document.getElementById('projectsTitle');
    projectsTitle.textContent = data.projects.title;

    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';

    data.projects.items.forEach(project => {
        // 1. Create Card Wrapper
        const cardDiv = document.createElement('div');
        cardDiv.className = 'project-card';

        // Make the whole card clickable if there is a URL
        if (project.url) {
            cardDiv.style.cursor = "pointer";
            cardDiv.onclick = (e) => {
                // Prevent conflict if we add other buttons later
                e.preventDefault();
                window.open(project.url, '_blank');
            };
        }

        // 2. Image Section
        const imageDiv = document.createElement('div');
        imageDiv.className = 'project-image';

        if (project.image) {
            const img = document.createElement('img');
            img.src = project.image;
            img.alt = project.title;
            img.loading = "lazy";
            imageDiv.appendChild(img);
        } else {
            // Nice fallback gradient if image is missing
            imageDiv.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)';
            imageDiv.style.display = 'flex';
            imageDiv.style.alignItems = 'center';
            imageDiv.style.justifyContent = 'center';
            imageDiv.innerHTML = '<span style="font-size:40px; opacity:0.3">✨</span>';
        }

        // 3. Content Section
        const contentDiv = document.createElement('div');
        contentDiv.className = 'project-content';

        const h3 = document.createElement('h3');
        h3.textContent = project.title;

        const p = document.createElement('p');
        p.textContent = project.description;

        // Tags
        const techTags = document.createElement('div');
        techTags.className = 'tech-tags';
        project.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            techTags.appendChild(span);
        });

        // 4. Assemble
        contentDiv.appendChild(h3);
        contentDiv.appendChild(p);
        contentDiv.appendChild(techTags);

        cardDiv.appendChild(imageDiv);
        cardDiv.appendChild(contentDiv);

        projectsGrid.appendChild(cardDiv);
    });
}

// Populate applications section
function populateApplications(data) {
    if (!data.applications) return;

    const applicationsTitle = document.getElementById('applicationsTitle');
    applicationsTitle.textContent = data.applications.title;

    const applicationsSubtitle = document.getElementById('applicationsSubtitle');
    if (applicationsSubtitle && data.applications.subtitle) {
        applicationsSubtitle.textContent = data.applications.subtitle;
    }

    const applicationsGrid = document.getElementById('applicationsGrid');
    applicationsGrid.innerHTML = '';

    data.applications.items.forEach(app => {
        // LOGIC: Check if URL exists
        const isLive = !!app.url;

        // 1. Create Container
        // If Live: make it an anchor (<a>). If Coming Soon: make it a div (<div>)
        const slate = document.createElement(isLive ? 'a' : 'div');
        slate.className = `app-slate ${isLive ? '' : 'no-link'}`;

        if (isLive) {
            slate.href = app.url;
            slate.target = '_blank';
        }

        // --- LEFT SIDE: IMAGE ---
        const imageBox = document.createElement('div');
        imageBox.className = 'slate-image-box';

        if (app.image) {
            // 1. Create the Blurred Background Layer
            const bgBlur = document.createElement('div');
            bgBlur.className = 'slate-bg-blur';
            // Set background image via CSS
            bgBlur.style.backgroundImage = `url('${app.image}')`;

            // 2. Create the Sharp Foreground Layer
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'slate-img-wrapper';

            const img = document.createElement('img');
            img.src = app.image;
            img.alt = app.title;
            img.loading = "lazy";

            imgWrapper.appendChild(img);

            // Append both layers
            imageBox.appendChild(bgBlur);
            imageBox.appendChild(imgWrapper);
        } else {
            // Elegant Fallback
            imageBox.style.background = 'linear-gradient(135deg, #111 0%, #222 100%)';
            imageBox.style.display = 'flex';
            imageBox.style.alignItems = 'center';
            imageBox.style.justifyContent = 'center';
            imageBox.innerHTML = '<span style="font-size:50px; opacity:0.5">⚡</span>';
        }

        // --- RIGHT SIDE: CONTENT ---
        const content = document.createElement('div');
        content.className = 'slate-content';

        // 1. Meta Row (Type + Status)
        const metaRow = document.createElement('div');
        metaRow.className = 'slate-meta';

        const typeBadge = document.createElement('span');
        typeBadge.className = 'app-type-badge';
        typeBadge.setAttribute('data-type', (app.type || 'app').toLowerCase());
        typeBadge.textContent = app.type || 'Application';

        // STATUS LOGIC
        const liveIndicator = document.createElement('div');
        if (isLive) {
            liveIndicator.className = 'live-indicator';
            liveIndicator.innerHTML = '<span class="blink-dot"></span> Live';
        } else {
            liveIndicator.className = 'live-indicator coming-soon';
            liveIndicator.innerHTML = '<span class="wait-dot"></span> Coming Soon';
        }

        metaRow.appendChild(typeBadge);
        metaRow.appendChild(liveIndicator);

        // 2. Text Content
        const h3 = document.createElement('h3');
        h3.textContent = app.title;

        const p = document.createElement('p');
        p.textContent = app.description;

        // 3. Footer (Tags + Button)
        const footer = document.createElement('div');
        footer.className = 'slate-footer';

        const tagContainer = document.createElement('div');
        tagContainer.className = 'app-tags';
        if (app.tags) {
            app.tags.forEach(tag => {
                const t = document.createElement('span');
                t.className = 'mini-tag';
                t.textContent = tag;
                tagContainer.appendChild(t);
            });
        }

        footer.appendChild(tagContainer);

        // BUTTON LOGIC: Only show if URL exists
        if (isLive) {
            const visitBtn = document.createElement('div');
            visitBtn.className = 'visit-btn';
            visitBtn.innerHTML = 'Visit Project <span>→</span>';
            footer.appendChild(visitBtn);
        }

        // Assemble
        content.appendChild(metaRow);
        content.appendChild(h3);
        content.appendChild(p);
        content.appendChild(footer);

        slate.appendChild(imageBox);
        slate.appendChild(content);

        applicationsGrid.appendChild(slate);
    });
}

// Populate experience section
function populateExperience(data) {
    const experienceTitle = document.getElementById('experienceTitle');
    experienceTitle.textContent = data.experience.title;

    const timeline = document.getElementById('timeline');
    data.experience.timeline.forEach(exp => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'timeline-item';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'timeline-content';

        const h3 = document.createElement('h3');
        h3.textContent = exp.position;

        const company = document.createElement('div');
        company.className = 'company';
        company.textContent = exp.company;

        const date = document.createElement('div');
        date.className = 'date';
        date.textContent = exp.period;

        const p = document.createElement('p');
        p.textContent = exp.description;

        contentDiv.appendChild(h3);
        contentDiv.appendChild(company);
        contentDiv.appendChild(date);
        contentDiv.appendChild(p);

        itemDiv.appendChild(contentDiv);
        timeline.appendChild(itemDiv);
    });
}

// Populate contact section
function populateContact(data) {
    const contactTitle = document.getElementById('contactTitle');
    contactTitle.textContent = data.contact.title;

    const contactInfo = document.getElementById('contactInfo');
    contactInfo.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'contact-wrapper';

    // Find data
    const emailItem = data.contact.items.find(item => item.type === 'email');
    const otherItems = data.contact.items.filter(item => item.type !== 'email');

    // 1. THE MAGNETIC BUTTON (The Centerpiece)
    if (emailItem) {
        const container = document.createElement('div');
        container.className = 'magnetic-container';

        // The Ring
        const ring = document.createElement('div');
        ring.className = 'spinning-ring';

        // The Button
        const btn = document.createElement('div');
        btn.className = 'magnetic-btn';
        btn.id = 'magneticBtn';

        btn.innerHTML = `
            <div class="btn-icon">✉️</div>
            <span class="btn-label">Drop me a line</span>
            <span class="btn-value">Click to Copy</span>
        `;

        // --- CLICK ANIMATION (Copy) ---
        btn.onclick = () => {
            navigator.clipboard.writeText(emailItem.value);
            btn.classList.add('copied');
            const originalHtml = btn.innerHTML;

            btn.innerHTML = `
                <div class="btn-icon">✅</div>
                <span class="btn-label">Email Copied!</span>
            `;

            setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = originalHtml;
            }, 2000);
        };

        // --- MAGNETIC PHYSICS LOGIC ---
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse X inside container
            const y = e.clientY - rect.top;  // Mouse Y inside container

            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate distance from center (Max movement = 40px)
            const moveX = (x - centerX) / 3;
            const moveY = (y - centerY) / 3;

            // Apply transform to button (Move it towards mouse)
            btn.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
            // Text parallax (Text moves slightly more for depth)
            btn.children[0].style.transform = `translate(${moveX / 2}px, ${moveY / 2}px) scale(1.2)`;
        });

        // Reset on leave
        container.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px) scale(1)';
            if (btn.children[0]) {
                btn.children[0].style.transform = 'translate(0px, 0px) scale(1)';
            }
        });

        container.appendChild(ring);
        container.appendChild(btn);
        wrapper.appendChild(container);
    }

    // 2. THE FLOATING DOCK (Socials with Real SVGs)
    if (otherItems.length > 0) {
        const dock = document.createElement('div');
        dock.className = 'social-dock';

        // Define SVG Paths (Lightweight, no external library needed)
        const icons = {
            linkedin: '<svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>',
            github: '<svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
            twitter: '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
            x: '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
            instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
            phone: '<svg viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.17 15.17 0 01-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1.01A11.36 11.36 0 018.59 3.99c0-.55-.45-1-1-1H4.01c-.55 0-1 .45-1 1 0 9.39 7.61 17.01 17.01 17.01.55 0 1-.45 1-1v-3.58c0-.55-.45-1-1-1z"/></svg>',
            default: '<svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>'
        };

        otherItems.forEach(item => {
            const a = document.createElement('a');
            a.className = 'dock-item';
            a.setAttribute('data-label', item.label);

            // Determine Link Type (Phone vs URL)
            if (item.type === 'phone') {
                a.href = `tel:${item.value.replace(/\s/g, '')}`;
            } else {
                a.href = item.url || '#';
                a.target = '_blank'; // Open URL in new tab
            }

            // Match Icon
            const key = item.label.toLowerCase();
            let svgContent = icons.default;

            if (key.includes('linkedin')) svgContent = icons.linkedin;
            else if (key.includes('github')) svgContent = icons.github;
            else if (key.includes('twitter') || key.includes('x')) svgContent = icons.x;
            else if (key.includes('instagram')) svgContent = icons.instagram;
            else if (key.includes('phone')) svgContent = icons.phone;

            a.innerHTML = svgContent;
            dock.appendChild(a);
        });

        wrapper.appendChild(dock);
    }

    contactInfo.appendChild(wrapper);

    // 3. Footer Button
    const githubButtonContainer = document.getElementById('githubButtonContainer');
    githubButtonContainer.innerHTML = '';

    const ghBtn = document.createElement('a');
    ghBtn.href = data.personal.contact.github;
    ghBtn.className = 'github-footer-btn';
    ghBtn.target = '_blank';
    ghBtn.innerHTML = `<span>${data.contact.githubButton.text} on GitHub</span> <span>→</span>`;

    githubButtonContainer.appendChild(ghBtn);
}

// Populate footer
function populateFooter(data) {
    const footerText = document.getElementById('footerText');
    footerText.textContent = data.footer.copyright;
}

// Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.remove('active');
}

// Smooth Scrolling for Anchor Links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 1s ease forwards';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.expertise-card, .project-card, .creation-card, .timeline-item').forEach(el => {
        observer.observe(el);
    });

    // Initialize smooth scrolling
    initializeSmoothScroll();
}

// Load content when DOM is ready
document.addEventListener('DOMContentLoaded', loadContent);
