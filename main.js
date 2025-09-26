// Photography Portfolio JavaScript

class PhotographyPortfolio {
    constructor() {
        this.images = [];
        this.currentImageIndex = 0;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadImages();
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupMobileMenu();
    }

    // Load all images from the project
    loadImages() {
        // List of all your imported images
        const imageFiles = [
            'IMG_20230530_181024.jpg',
            'IMG20220724142553-01.jpeg.jpg',
            'IMG20230623180039-01-01.jpeg.jpg',
            'IMG20230515071249-01-01.jpeg.jpg',
            'IMG20231024174616.jpg',
            'IMG20240602061237_01.jpg',
            'IMG_20231115_113302.jpg',
            'LRM_EXPORT_54817198539231_20191023_161949188-01-01-01-02.jpg',
            'LRM_EXPORT_71900462174256_20191016_140752105-01.jpg',
            'Screenshot_2023-05-22-18-10-46-33_92460851df6f172a4592fca41cc2d2e6-01.jpeg.jpg',
            'Snapchat-2118487069-01.jpeg.jpg',
            'Snapchat-411105696.jpg',
            'Snapchat-567492601-01.jpeg.jpg',
            'Snapchat-753773215.jpg',
            'IMG_20231024_062240.jpg'
        ];

        // Create image objects with metadata
        this.images = imageFiles.map((filename, index) => {
            const category = this.categorizeImage(filename);
            const title = this.generateTitle(filename);
            const description = this.generateDescription(category);
            
            return {
                src: filename,
                title: title,
                description: description,
                category: category,
                index: index
            };
        });

        this.renderGallery();
    }

    // Categorize images based on filename patterns
    categorizeImage(filename) {
        const name = filename.toLowerCase();
        
        if (name.includes('snapchat') || name.includes('screenshot')) {
            return 'lifestyle';
        } else if (name.includes('lrm_export') || name.includes('img_')) {
            return 'portrait';
        } else {
            return 'landscape';
        }
    }

    // Generate titles from filenames
    generateTitle(filename) {
        const titles = {
            'lifestyle': [
                'Candid Moments', 'Life Unfiltered', 'Spontaneous Joy', 'Daily Stories',
                'Authentic Expressions', 'Natural Vibes', 'Casual Beauty', 'Real Life'
            ],
            'portrait': [
                'Portrait Study', 'Character Capture', 'Emotional Depth', 'Personal Story',
                'Human Connection', 'Intimate Moment', 'Soul Reflection', 'Inner Beauty'
            ],
            'landscape': [
                'Natural Wonder', 'Scenic Beauty', 'Peaceful Vista', 'Nature\'s Canvas',
                'Serene Landscape', 'Golden Hour', 'Tranquil Scene', 'Earth\'s Poetry'
            ]
        };

        const category = this.categorizeImage(filename);
        const categoryTitles = titles[category];
        const index = filename.charCodeAt(0) % categoryTitles.length;
        return categoryTitles[index];
    }

    // Generate descriptions based on category
    generateDescription(category) {
        const descriptions = {
            'lifestyle': 'Capturing the beauty of everyday moments and authentic human experiences.',
            'portrait': 'Exploring the depth and character that makes each person unique.',
            'landscape': 'Showcasing the natural world in all its magnificent glory.'
        };
        return descriptions[category];
    }

    // Render the gallery
    renderGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;

        galleryGrid.innerHTML = '';

        const filteredImages = this.currentFilter === 'all' 
            ? this.images 
            : this.images.filter(img => img.category === this.currentFilter);

        filteredImages.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item fade-in';
            galleryItem.dataset.category = image.category;
            galleryItem.dataset.index = image.index;

            galleryItem.innerHTML = `
                <img src="${image.src}" alt="${image.title}" loading="lazy">
                <div class="gallery-overlay">
                    <div class="gallery-info">
                        <h3>${image.title}</h3>
                        <p>${image.description}</p>
                    </div>
                </div>
            `;

            galleryItem.addEventListener('click', () => {
                this.openLightbox(image.index);
            });

            galleryGrid.appendChild(galleryItem);
        });

        // Trigger fade-in animation
        setTimeout(() => {
            document.querySelectorAll('.gallery-item').forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 100);
            });
        }, 100);
    }

    // Setup event listeners
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderGallery();
            });
        });

        // Lightbox controls
        const lightbox = document.getElementById('lightbox');
        const closeBtn = document.querySelector('.close-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLightbox());
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousImage());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextImage());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox && lightbox.style.display === 'block') {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });

        // Click outside to close lightbox
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    this.closeLightbox();
                }
            });
        }

        // Smooth scrolling for navigation links
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

        // Contact form
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(e.target);
            });
        }

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // Lightbox functionality
    openLightbox(imageIndex) {
        this.currentImageIndex = imageIndex;
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        
        if (lightbox && lightboxImg) {
            const image = this.images[imageIndex];
            lightboxImg.src = image.src;
            lightboxImg.alt = image.title;
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxImage();
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }

    updateLightboxImage() {
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightboxImg) {
            const image = this.images[this.currentImageIndex];
            lightboxImg.src = image.src;
            lightboxImg.alt = image.title;
        }
    }

    // Scroll animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Add fade-in class to sections
        document.querySelectorAll('.section-title, .section-subtitle, .about-text, .contact-content').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // Mobile menu
    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    // Handle contact form submission
    handleContactForm(form) {
        const formData = new FormData(form);
        const name = formData.get('name') || form.querySelector('input[type="text"]').value;
        const email = formData.get('email') || form.querySelector('input[type="email"]').value;
        const message = formData.get('message') || form.querySelector('textarea').value;

        // Simple form validation
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        // Simulate form submission
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Thank you for your message! I\'ll get back to you soon.');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }
}

// Initialize the portfolio when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PhotographyPortfolio();
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add loading animation for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });

    // Add hover sound effect (optional)
    document.querySelectorAll('.gallery-item, .cta-button, .filter-btn').forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = element.classList.contains('gallery-item') 
                ? 'translateY(-10px)' 
                : 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    });
});