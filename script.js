// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple reveal animation on scroll
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
});

// Theme Toggle
const themeSwitch = document.querySelector('.theme-switch');
const body = document.body;

// Check for saved user preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    body.classList.add('light-mode');
}

if (themeSwitch) {
    themeSwitch.addEventListener('click', () => {
        body.classList.toggle('light-mode');


        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });
}



// Math Canvas (Quiver Plot)
const canvas = document.getElementById('math-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX = 0, mouseY = 0;
    let time = 0;

    // Grid configuration
    const spacing = 40; // Space between arrows
    const length = 15; // Length of arrow

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    // Track mouse
    document.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    function draw() {
        ctx.clearRect(0, 0, width, height);

        time += 0.005;
        const colorOffset = Math.sin(time) * 50;
        const baseHue = 170;

        for (let x = 0; x < width; x += spacing) {
            for (let y = 0; y < height; y += spacing) {

                const noiseAngle = (Math.sin(x * 0.002 + time * 0.5) + Math.cos(y * 0.002 + time * 0.5)) * Math.PI;
                let angle = noiseAngle;

                const dx = x - mouseX;
                const dy = y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const interactionRadius = 1000;

                if (dist < interactionRadius) {
                    const factor = (interactionRadius - dist) / interactionRadius;
                    const angleToMouse = Math.atan2(dy, dx);
                    const diff = angleToMouse - angle;

                    angle += Math.sin(diff) * factor * 0.8;
                }

                const hue = (baseHue + x * 0.1 + y * 0.1 + colorOffset) % 360;

                ctx.beginPath();
                ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.4)`;
                ctx.lineWidth = 1;

                const x1 = x + Math.cos(angle) * length * 0.9;
                const y1 = y + Math.sin(angle) * length * 0.9;

                ctx.moveTo(x, y);
                ctx.lineTo(x1, y1);

                ctx.stroke();
            }
        }
        requestAnimationFrame(draw);
    }

    draw();
}

// Mobile Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    // Auto-close menu when clicking a link
    document.querySelectorAll('.nav-links li').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });
}
