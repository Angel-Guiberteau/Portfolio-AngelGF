document.addEventListener('DOMContentLoaded', async () => {
    
    const lenis = new Lenis({
        duration: 0.6, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false, 
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const icon = toggleBtn.querySelector('i');
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function setTheme(mode, saveToStorage = false) {
        html.setAttribute('data-theme', mode);
        if (saveToStorage) localStorage.setItem('theme', mode);

        if (mode === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
        loadNetworkParticles(mode);
    }

    const savedTheme = localStorage.getItem('theme');
    const systemTheme = mediaQuery.matches ? 'dark' : 'light';
    setTheme(savedTheme || systemTheme, false);

    mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newSystemTheme = e.matches ? 'dark' : 'light';
            setTheme(newSystemTheme, false);
        }
    });

    toggleBtn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme, true);
    });

    async function loadNetworkParticles(theme) {
        const isDark = theme === 'dark';
        const particleColor = isDark ? "#ffffff" : "#000000";
        const accentColor = "#ff3b30";

        const oldContainer = tsParticles.domItem(0);
        if (oldContainer) {
            oldContainer.destroy();
        }

        await tsParticles.load("tsparticles", {
            fpsLimit: 60,
            fullScreen: { enable: true, zIndex: -1 },
            interactivity: {
                events: {
                    onHover: { enable: true, mode: ["grab", "bubble"] },
                    onClick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 200, links: { opacity: 0.8, color: accentColor } },
                    bubble: { distance: 200, size: 6, duration: 2, opacity: 0.8, color: { value: accentColor } }
                }
            },
            particles: {
                number: { value: 60, density: { enable: true, area: 800 } },
                color: { value: particleColor },
                shape: { type: "polygon", polygon: { nb_sides: 6 } },
                opacity: { value: 0.1, random: true },
                size: { value: { min: 1, max: 3 }, random: true },
                links: {
                    enable: true, distance: 150, color: particleColor, opacity: 0.05, width: 1,
                    triangles: { enable: true, opacity: 0.02, color: particleColor }
                },
                move: { enable: true, speed: 1, direction: "none", random: false, straight: false, outModes: "bounce" }
            },
            background: { color: "transparent" }
        });
    }

    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }
        lastScrollY = currentScrollY;
    });

    const grid = document.getElementById('spotlight-grid');
    if (grid) {
        grid.addEventListener('mousemove', (e) => {
            document.querySelectorAll('.bento-item, .bento-card').forEach((card) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    const fabBtn = document.getElementById('mobileNavToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (fabBtn && mobileMenu) {
        const toggleMenu = (e) => {
            if(e) e.stopPropagation();
            fabBtn.classList.toggle('active');
            mobileMenu.classList.toggle('open');
        };

        fabBtn.addEventListener('click', toggleMenu);

        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !fabBtn.contains(e.target)) {
                toggleMenu();
            }
        });

        let isScrolling;
        window.addEventListener('scroll', () => {
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(() => {
                if (mobileMenu.classList.contains('open')) {
                    fabBtn.classList.remove('active');
                    mobileMenu.classList.remove('open');
                }
            }, 200);
        });
    }
});