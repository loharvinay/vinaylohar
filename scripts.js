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

// Populate projects section
function populateProjects(data) {
    const projectsTitle = document.getElementById('projectsTitle');
    projectsTitle.textContent = data.projects.title;

    const projectsGrid = document.getElementById('projectsGrid');
    data.projects.items.forEach(project => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'project-card';

        const imageDiv = document.createElement('div');
        imageDiv.className = 'project-image';

        if (project.image) {
            const img = document.createElement('img');
            img.src = project.image;
            img.alt = project.title;
            imageDiv.appendChild(img);
        } else {
            imageDiv.textContent = project.icon;
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'project-content';

        const h3 = document.createElement('h3');
        h3.textContent = project.title;

        const p = document.createElement('p');
        p.textContent = project.description;

        const techTags = document.createElement('div');
        techTags.className = 'tech-tags';
        project.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            techTags.appendChild(span);
        });

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
    data.applications.items.forEach(application => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'creation-card';

        const previewDiv = document.createElement('div');
        previewDiv.className = 'creation-preview';

        if (application.image) {
            const img = document.createElement('img');
            img.src = application.image;
            img.alt = application.title;
            previewDiv.appendChild(img);
        } else {
            previewDiv.textContent = application.icon;
        }

        const badge = document.createElement('span');
        badge.className = `creation-badge ${application.type}`;
        badge.textContent = application.type;
        previewDiv.appendChild(badge);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'creation-content';

        const h3 = document.createElement('h3');
        h3.textContent = application.title;

        const p = document.createElement('p');
        p.textContent = application.description;

        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'creation-tags';
        application.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'creation-tag';
            tagSpan.textContent = tag;
            tagsDiv.appendChild(tagSpan);
        });



        contentDiv.appendChild(h3);
        contentDiv.appendChild(p);
        contentDiv.appendChild(tagsDiv);

        if (application.url) {
            const link = document.createElement('a');
            link.href = application.url;
            link.className = 'creation-link';
            link.textContent = 'Visit Now';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            contentDiv.appendChild(link);
        }

        cardDiv.appendChild(previewDiv);
        cardDiv.appendChild(contentDiv);
        applicationsGrid.appendChild(cardDiv);
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
    data.contact.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'contact-item';

        const h3 = document.createElement('h3');
        h3.textContent = item.label;

        itemDiv.appendChild(h3);

        if (item.type === 'email') {
            const a = document.createElement('a');
            a.href = `mailto:${item.value}`;
            a.textContent = item.value;
            itemDiv.appendChild(a);
        } else if (item.type === 'phone') {
            const a = document.createElement('a');
            a.href = `tel:${item.value.replace(/\s/g, '')}`;
            a.textContent = item.value;
            itemDiv.appendChild(a);
        } else if (item.type === 'link') {
            const a = document.createElement('a');
            a.href = item.url;
            a.textContent = item.value;
            a.target = '_blank';
            itemDiv.appendChild(a);
        } else {
            const p = document.createElement('p');
            p.textContent = item.value;
            itemDiv.appendChild(p);
        }

        contactInfo.appendChild(itemDiv);
    });

    // Add GitHub button
    const githubButtonContainer = document.getElementById('githubButtonContainer');
    const a = document.createElement('a');
    a.href = data.personal.contact.github;
    a.className = 'btn btn-primary';
    a.target = '_blank';
    a.textContent = data.contact.githubButton.text;
    githubButtonContainer.appendChild(a);
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
