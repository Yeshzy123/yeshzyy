// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const heroButtons = document.querySelectorAll('.hero .btn');
const serverCards = document.querySelectorAll('.server-card');
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
const serviceCards = document.querySelectorAll('.service-card');
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');
const scrollToTopBtn = document.querySelector('.scroll-indicator');

// State
let isScrolling = false;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initEventListeners();
    initScrollReveal();
    initCounterAnimation();
});

// Initialize Animations
function initAnimations() {
    // Add loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading';
    loadingScreen.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loadingScreen);
    
    // Remove loading screen after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(loadingScreen);
            }, 500);
        }, 1000);
    });
    
    // Button ripple effect
    initRippleEffect();
    
    // Floating animation for server cards
    initFloatingAnimation();
}

// Initialize Event Listeners
function initEventListeners() {
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Hero button animations
    heroButtons.forEach(button => {
        button.addEventListener('mouseenter', buttonHoverEffect);
        button.addEventListener('mouseleave', buttonLeaveEffect);
    });
    
    // Scroll to top indicator
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Contact form submission
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Modal close
    closeModal.addEventListener('click', () => {
        successModal.classList.remove('show');
    });
    
    // Close modal when clicking outside
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('show');
        }
    });
    
    // Window scroll events
    window.addEventListener('scroll', throttle(handleScroll, 16));
}

// Mobile Menu Functions
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// Smooth Scrolling
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70; // Account for navbar height
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Scroll Handling
function handleScroll() {
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    }
    
    // Scroll reveal animations
    revealOnScroll();
    
    // Parallax effect for background
    parallaxBackground();
}

// Parallax Background Effect
function parallaxBackground() {
    const scrolled = window.pageYOffset;
    const background = document.querySelector('.background-animation');
    background.style.transform = `translateY(${scrolled * 0.5}px)`;
}

// Scroll Reveal Animation System
function initScrollReveal() {
    // Add reveal class to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('reveal');
    });
}

function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('visible');
        }
    });
}

// Counter Animation
function initCounterAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateCounters() {
    statNumbers.forEach(element => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
                if (element.nextElementSibling && 
                    element.nextElementSibling.classList.contains('stat-plus')) {
                    element.innerHTML = `${target}<div class="stat-plus">+</div>`;
                }
            }
        };
        
        setTimeout(updateCounter, 200);
    });
}

// Button Hover Effects
function buttonHoverEffect() {
    this.style.transform = 'translateY(-8px) scale(1.05)';
    this.style.boxShadow = '0 15px 35px rgba(66, 153, 225, 0.4)';
}

function buttonLeaveEffect() {
    this.style.transform = 'translateY(0) scale(1)';
    this.style.boxShadow = '0 10px 30px rgba(66, 153, 225, 0.3)';
}

// Ripple Effect for Buttons
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.offsetLeft;
            const y = e.clientY - e.target.offsetTop;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Floating Animation for Server Cards
function initFloatingAnimation() {
    serverCards.forEach((card, index) => {
        // Add delay to each card for staggered animation
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    });
}

// Form Submission Handler
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        discord: formData.get('discord'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Send to Discord webhook
        await sendToWebhook(data);
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        contactForm.reset();
        
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Sorry, there was an error sending your message. Please try again.');
    } finally {
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Send to Discord Webhook
async function sendToWebhook(data) {
    const webhookUrl = 'https://discord.com/api/webhooks/1459762540476240015/HfhTWIOk1s0V9-TjxzYSfD_rfrdFTl5Jg_eitgdfW-Zwhru-F7bM72NIrlU4Pi1_TsUa';
    
    const embed = {
        title: 'New Portfolio Contact',
        color: 4299286, // Blue color
        fields: [
            {
                name: 'Name',
                value: data.name,
                inline: true
            },
            {
                name: 'Discord',
                value: data.discord,
                inline: true
            },
            {
                name: 'Message',
                value: data.message
            },
            {
                name: 'Timestamp',
                value: `<t:${Math.floor(new Date(data.timestamp).getTime() / 1000)}:F>`
            }
        ],
        footer: {
            text: 'Portfolio Contact Form'
        }
    };
    
    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ embeds: [embed] })
    });
    
    if (!response.ok) {
        throw new Error('Failed to send message to Discord');
    }
}

// Show Success Modal
function showSuccessModal() {
    successModal.classList.add('show');
    
    // Auto close after 5 seconds
    setTimeout(() => {
        successModal.classList.remove('show');
    }, 5000);
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Intersection Observer for Advanced Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe elements for animations
document.querySelectorAll('.server-card, .service-card, .stat-card').forEach(el => {
    observer.observe(el);
});

// Custom cursor effect (desktop only)
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        // Create trailing effect for cursor
        createCursorTrail(e);
    });
}

function createCursorTrail(e) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 500);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu and modals
    if (e.key === 'Escape') {
        closeMobileMenu();
        successModal.classList.remove('show');
    }
    
    // Tab navigation through sections
    if (e.key === 'Tab' && e.ctrlKey) {
        e.preventDefault();
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const currentIndex = sections.findIndex(section => 
            section.getBoundingClientRect().top >= 0
        );
        const nextIndex = (currentIndex + 1) % sections.length;
        sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
    }
});

// Performance optimizations
window.addEventListener('beforeunload', () => {
    // Clean up observers
    if (observer) observer.disconnect();
});

// Console message for developers
console.log('%c🚀 Professional Discord Server Manager Portfolio', 'color: #4299e1; font-size: 16px; font-weight: bold;');
console.log('%c✨ Built with modern web technologies and smooth animations', 'color: #718096; font-size: 14px;');