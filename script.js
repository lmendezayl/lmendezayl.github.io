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

    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form');
    const successMsg = document.getElementById('form-success-msg');
    const errorMsg = document.getElementById('form-error-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            // Re-translate via data-i18n logic later or just show simple loading text
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const data = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    successMsg.style.display = 'block';
                    errorMsg.style.display = 'none';
                    contactForm.reset();
                    submitBtn.classList.remove('primary');
                    submitBtn.classList.add('secondary'); // visual feedback
                    
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                        submitBtn.classList.remove('secondary');
                        submitBtn.classList.add('primary');
                    }, 5000);
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            errorMsg.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            errorMsg.style.display = 'block';
                            successMsg.style.display = 'none';
                        }
                    })
                }
            }).catch(error => {
                errorMsg.style.display = 'block';
                successMsg.style.display = 'none';
            }).finally(() => {
                submitBtn.innerHTML = originalBtnText; // Restores original innerHTML containing translations if needed
                submitBtn.disabled = false;
            });
        });
    }
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

    // State for visualization
    let visualMode = 'quiver'; // 'quiver' or 'lorentz'

    // Lorentz State
    let l_x = 0.1, l_y = 0, l_z = 0;
    const sigma = 10, rho = 28, beta = 8 / 3;
    const l_dt = 0.0045;
    let points = []; // Trail
    const maxPoints = 3500;

    // Trigger Easter Egg
    const trigger = document.getElementById('lorentz-trigger');
    if (trigger) {
        trigger.addEventListener('click', () => {
            visualMode = (visualMode === 'quiver') ? 'lorentz' : 'quiver';
            // Reset Lorentz if enabled
            if (visualMode === 'lorentz') {
                ctx.clearRect(0, 0, width, height);
                points = [];
                l_x = 0.1; l_y = 0; l_z = 0;
            }
        });
    }

    function drawQuiver() {
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
    }

    function drawLorentz() {
        // Fade effect for trail
        ctx.fillStyle = 'rgba(10, 25, 47, 0.05)'; // Fade out old points
        // Check light mode for fade color
        if (document.body.classList.contains('light-mode')) {
            ctx.fillStyle = 'rgba(249, 248, 244, 0.05)';
        }
        ctx.fillRect(0, 0, width, height);

        // Calculate Physics
        const dx = (sigma * (l_y - l_x)) * l_dt;
        const dy = (l_x * (rho - l_z) - l_y) * l_dt;
        const dz = (l_x * l_y - beta * l_z) * l_dt;

        l_x += dx;
        l_y += dy;
        l_z += dz;

        points.push({ x: l_x, y: l_y, z: l_z });
        if (points.length > maxPoints) points.shift();

        // Draw
        ctx.beginPath();
        ctx.strokeStyle = '#64ffda'; // Accent
        if (document.body.classList.contains('light-mode')) {
            ctx.strokeStyle = '#0056b3'; // Accent Dark
        }
        ctx.lineWidth = 2;

        // Scale and Center
        const scale = 15;
        const cx = width / 2;
        const cy = height / 2;

        points.forEach((p, i) => {
            // Simple projection: just X and Z for butterfly shape usually, or X/Y
            // Standard Front View: X vs Z
            // Let's rotate it a bit or just plot X,Y
            const px = cx + p.x * scale;
            const py = cy + p.y * scale; // Invert Y? Canvas Y is down.

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });

        ctx.stroke();

        // Speed up integration for visual effect?
        for (let i = 0; i < 5; i++) {
            const dx = (sigma * (l_y - l_x)) * l_dt;
            const dy = (l_x * (rho - l_z) - l_y) * l_dt;
            const dz = (l_x * l_y - beta * l_z) * l_dt;
            l_x += dx; l_y += dy; l_z += dz;
            points.push({ x: l_x, y: l_y, z: l_z });
            if (points.length > maxPoints) points.shift();
        }
    }

    function draw() {
        if (visualMode === 'quiver') {
            drawQuiver();
        } else {
            drawLorentz();
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

// --- Internationalization (i18n) ---
const translations = {
    en: {
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-stack': 'Stack',
        'nav-experience': 'Experience',
        'nav-projects': 'Projects',
        'nav-contact': 'Contact',

        'hero-overline': 'Hello, I\'m <span class="highlight">Lautaro Mendez</span>',
        'hero-title': 'Data ',
        'hero-suffix': '',
        'hero-rot-1': 'Engineer',
        'hero-rot-2': 'Scientist',
        'hero-rot-3': 'Engineer',
        'hero-subtitle': 'Building scalable pipelines, transforming raw data into insights, and deploying ML\n                models.',
        'hero-btn-work': 'View Work',
        'hero-btn-cv': 'View CV',

        'about-title': 'About Me',
        'about-p1': 'I am a Data Engineer and Scientist with experience in building robust data pipelines, process\n                            automation, and applied statistical analysis. ',
        'about-p2': 'Currently in my 5th year of a Data Science degree at the University of Buenos Aires. I have\n                            hands-on experience with <b>Python</b>, <b>SQL</b>, and <b>Cloud platforms (AWS, GCP)</b>,\n                            working on projects\n                            ranging from ETL automation to ML model deployment.',
        'about-p3': 'My goal is to continue growing in projects that integrate Data Engineering with operational\n                            analysis.',

        'skills-title': 'Tech Stack',
        'skills-languages': 'Languages',
        'skills-cloud': 'Cloud & DevOps',
        'skills-dataeng': 'Data Engineering',
        'skills-analytics': 'Analytics & Tools',

        'exp-title': 'Professional Experience',
        'exp-2-title': 'ETL Pipelines & Dockerization',
        'exp-2-desc': '<strong>Grupo Penna</strong>: Developed and deployed ETL pipelines between external APIs\n                                and SQL Server using Python (FastAPI). Implemented and dockerized projects on AWS EC2,\n                                automating daily ETL processes.',
        'exp-3-title': 'LLM Prompt Engineering',
        'exp-3-desc': '<strong>Scale AI</strong>: Developed prompts for LLaMA 3 based LLMs, systematically\n                                evaluating response quality using Python and data analysis techniques to improve model\n                                performance.',
        'exp-4-title': 'Billing Process Automation',
        'exp-4-desc': '<strong>GFPrint</strong>: Automated billing and order management processes in Google\n                                Sheets using Apps Script, reducing execution time from minutes to seconds and\n                                eliminating manual errors.',

        'proj-title': 'Personal Projects',
        'proj-1-title': 'TMDB Top 5000 Movies API',
        'proj-1-desc': 'End-to-End data engineering solution featuring a Medallion Architecture, automated ETL\n                                pipeline, and REST API. Includes full-text vector search with Typesense and Docker\n                                deployment.',
        'proj-2-title': '2022 Argentina Census Data Analysis',
        'proj-2-desc': 'Exploratory Data Analysis of the 2022 Census using Pandas and GeoJSON mapping. Applied\n                                linear models to uncover demographic trends.',

        'contact-title': 'Get In Touch',
        'contact-desc': 'I am currently looking for new opportunities, ideally in financial consulting or data\n                        engineering. Whether you have a question or just want to say hi, my inbox is always open.',
        'contact-name': 'Name',
        'contact-email-label': 'Email',
        'contact-message': 'Message',
        'contact-submit': 'Send Message',
        'contact-success': 'Message sent successfully!',
        'contact-error': 'Oops! There was a problem submitting your form.',

        'footer-text': 'Designed & Built by Lautaro Evaristo Mendez'
    },
    es: {
        'nav-home': 'Inicio',
        'nav-about': 'Sobre mí',
        'nav-stack': 'Stack',
        'nav-experience': 'Experiencia',
        'nav-projects': 'Proyectos',
        'nav-contact': 'Contacto',

        'hero-overline': 'Hola, soy <span class="highlight">Lautaro Mendez</span>',
        'hero-title': '',
        'hero-suffix': ' de Datos',
        'hero-rot-1': 'Ingeniero',
        'hero-rot-2': 'Científico',
        'hero-rot-3': 'Ingeniero',
        'hero-subtitle': 'Construyendo pipelines escalables, transformando datos en insights y desplegando modelos de ML.',
        'hero-btn-work': 'Ver Proyectos',
        'hero-btn-cv': 'Ver CV',

        'about-title': 'Sobre mí',
        'about-p1': 'Soy un Ingeniero y Científico de Datos con experiencia construyendo pipelines de datos robustos, automatizando procesos y aplicando análisis estadístico. ',
        'about-p2': 'Actualmente cursando el 5to año de la licenciatura en Ciencia de Datos en la Universidad de Buenos Aires. Tengo experiencia práctica con <b>Python</b>, <b>SQL</b> y <b>Plataformas Cloud (AWS, GCP)</b>, trabajando en proyectos que van desde la automatización de ETLs hasta el despliegue de modelos de ML.',
        'about-p3': 'Mi objetivo es continuar creciendo en proyectos que integren la Ingeniería de Datos con el análisis operativo.',

        'skills-title': 'Stack Tecnológico',
        'skills-languages': 'Lenguajes',
        'skills-cloud': 'Cloud y DevOps',
        'skills-dataeng': 'Ingeniería de Datos',
        'skills-analytics': 'Herramientas',

        'exp-title': 'Experiencia Profesional',
        'exp-2-title': 'Backend ETL y Automatización de Procesos',
        'exp-2-desc': '<strong>Grupo Penna</strong>: Desarrollo y despliegue de procesos ETL entre APIs externas y SQL Server usando Python (FastAPI). Implementación y dockerización del proyecto en instacia AWS.',
        'exp-3-title': 'Ingeniería de Prompts (LLM)',
        'exp-3-desc': '<strong>Scale AI</strong>: Desarrollo de prompts para LLMs basados en LLaMA 3, evaluando la calidad de respuestas usando Python y técnicas de análisis de datos para mejorar el rendimiento del modelo.',
        'exp-4-title': 'Automatización de Procesos de Facturación',
        'exp-4-desc': '<strong>GFPrint</strong>: Automatización de procesos de facturación y gestión de órdenes en Google Sheets usando Apps Script, reduciendo el tiempo de ejecución de minutos a segundos y eliminando errores manuales.',

        'proj-title': 'Proyectos Personales',
        'proj-1-title': 'API Top 5000 Películas de TMDB',
        'proj-1-desc': 'Solución integral de ingeniería de datos con Arquitectura Medallón, pipeline ETL automatizado y API REST. Incluye búsqueda vectorial full-text con Typesense y despliegue en Docker.',
        'proj-2-title': 'Análisis de Datos del Censo Argentino 2022',
        'proj-2-desc': 'Análisis de hipótesis demográficas usando Pandas y GeoJSON. Modelos lineales multivariados aplicados para descubrir tendencias demográficas.',

        'contact-title': 'Contacto',
        'contact-desc': 'Actualmente busco nuevas oportunidades, idealmente en finanzas, ciencia o ingeniería de datos. Ya sea que tengas una pregunta o solo quieras saludar, mi email siempre está disponible.',
        'contact-name': 'Nombre',
        'contact-email-label': 'Correo electrónico',
        'contact-message': 'Mensaje',
        'contact-submit': 'Enviar Mensaje',
        'contact-success': '¡Mensaje enviado con éxito!',
        'contact-error': '¡Ups! Hubo un problema al enviar tu formulario.',

        'footer-text': '© 2026. Diseñado y Construido por Lautaro Evaristo Mendez'
    }
};

const langSwitch = document.getElementById('lang-switch');
let currentLang = localStorage.getItem('lang') || 'en';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    const langFlag = document.getElementById('lang-flag');
    if (langFlag) {
        langFlag.src = lang === 'en' ? 'https://flagcdn.com/w40/us.png' : 'https://flagcdn.com/w40/ar.png';
        langFlag.alt = lang === 'en' ? 'English' : 'Español';
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && (translations[lang][key] !== undefined)) {
            el.innerHTML = translations[lang][key];
        }
    });

    const cvLink = document.getElementById('cv-link');
    if (cvLink) {
        cvLink.href = lang === 'en' ? 'CV_Lautaro_Mendez_2026_en.pdf' : 'CV_Lautaro_Mendez_2026_sp.pdf';
    }
}

if (langSwitch) {
    langSwitch.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'es' : 'en';
        setLanguage(newLang);
    });
}

// Initialize language on load
setLanguage(currentLang);
