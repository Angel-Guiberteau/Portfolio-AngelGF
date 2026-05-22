document.addEventListener('DOMContentLoaded', async () => {
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touchViewportQuery = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    const shouldReduceMotion = reduceMotionQuery.matches;
    const shouldDisableHeavyMotion = shouldReduceMotion || touchViewportQuery.matches;

    if (shouldDisableHeavyMotion) {
        document.documentElement.classList.add('reduce-motion');
        document.querySelectorAll('[data-tilt]').forEach((card) => {
            card.removeAttribute('data-tilt');
            card.removeAttribute('data-tilt-glare');
            card.removeAttribute('data-tilt-max-glare');
        });
    }

    if (!shouldReduceMotion && !touchViewportQuery.matches && window.Lenis) {
        const lenis = new Lenis({
            duration: 0.65,
            easing: (t) => 1 - Math.pow(1 - t, 3),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.15,
            touchMultiplier: 1.35,
            smoothTouch: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const icon = toggleBtn ? toggleBtn.querySelector('i') : null;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function setTheme(mode, saveToStorage = false) {
        html.setAttribute('data-theme', mode);
        if (saveToStorage) localStorage.setItem('theme', mode);

        if (icon) {
            if (mode === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
        loadNetworkParticles(mode).catch(() => {});
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

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme, true);
        });
    }

    async function loadNetworkParticles(theme) {
        if (shouldDisableHeavyMotion || !window.tsParticles || !document.getElementById('tsparticles')) {
            return;
        }

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
    let ticking = false;

    if (navbar) {
        const updateNavbarOnScroll = () => {
            const currentScrollY = window.scrollY;
            const isScrollingDown = currentScrollY > lastScrollY;
            const isPastHeroOffset = currentScrollY > 96;
            const hasMeaningfulDelta = Math.abs(currentScrollY - lastScrollY) > 6;

            navbar.classList.toggle('nav-scrolled', currentScrollY > 8);

            if (isScrollingDown && isPastHeroOffset && hasMeaningfulDelta) {
                navbar.classList.add('nav-hidden');
            } else if (!isScrollingDown || currentScrollY < 24) {
                navbar.classList.remove('nav-hidden');
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateNavbarOnScroll);
                ticking = true;
            }
        }, { passive: true });
    }

    const spotlightGrids = document.querySelectorAll('#spotlight-grid, .project-compact-grid');
    if (spotlightGrids.length) {
        const spotlightRule = (() => {
            for (const sheet of document.styleSheets) {
                if (!sheet.href || !sheet.href.includes('/assets/styles/')) {
                    continue;
                }

                try {
                    const ruleIndex = sheet.insertRule(':root { --mouse-x: 50%; --mouse-y: 50%; }', sheet.cssRules.length);
                    return sheet.cssRules[ruleIndex];
                } catch {
                    continue;
                }
            }

            return null;
        })();

        const updateCardSpotlight = (e) => {
            if (!spotlightRule) {
                return;
            }

            const card = e.target.closest('.bento-item, .bento-card, .project-card');
            if (!card || !e.currentTarget.contains(card)) {
                return;
            }

            const rect = card.getBoundingClientRect();
            spotlightRule.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            spotlightRule.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        };

        spotlightGrids.forEach((grid) => {
            grid.addEventListener('mousemove', updateCardSpotlight);
        });
    }

    const fabBtn = document.getElementById('mobileNavToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (fabBtn && mobileMenu) {
        const toggleMenu = (e) => {
            if (e) e.stopPropagation();
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
