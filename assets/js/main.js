document.addEventListener('DOMContentLoaded', async () => {
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touchViewportQuery = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    const shouldReduceMotion = reduceMotionQuery.matches;
    const shouldDisableHeavyMotion = shouldReduceMotion || touchViewportQuery.matches;

    document.querySelectorAll('[data-tilt]').forEach((card) => {
        card.setAttribute('data-tilt-max', '4');
        card.setAttribute('data-tilt-speed', '450');
        card.setAttribute('data-tilt-scale', '1.005');
        card.setAttribute('data-tilt-perspective', '1400');
    });

    if (shouldDisableHeavyMotion) {
        document.documentElement.classList.add('reduce-motion');
        document.querySelectorAll('[data-tilt]').forEach((card) => {
            if (card.vanillaTilt) {
                card.vanillaTilt.destroy();
            }
            card.removeAttribute('style');
            card.querySelectorAll('.js-tilt-glare').forEach((glare) => glare.remove());
            card.removeAttribute('data-tilt');
            card.removeAttribute('data-tilt-glare');
            card.removeAttribute('data-tilt-max-glare');
            card.removeAttribute('data-tilt-max');
            card.removeAttribute('data-tilt-speed');
            card.removeAttribute('data-tilt-scale');
            card.removeAttribute('data-tilt-perspective');
        });
    } else if (window.VanillaTilt) {
        document.querySelectorAll('[data-tilt]').forEach((card) => {
            if (card.vanillaTilt) {
                card.vanillaTilt.destroy();
            }

            VanillaTilt.init(card, {
                max: 4,
                speed: 450,
                scale: 1.005,
                perspective: 1400,
                glare: card.hasAttribute('data-tilt-glare'),
                'max-glare': Math.min(Number(card.getAttribute('data-tilt-max-glare')) || 0.06, 0.06),
            });
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

    const translations = {
        es: {
            common: {
                titleIndex: 'Ángel GF | Full Stack Developer',
                titleAbout: 'Sobre mí | Ángel GF',
                titleProjects: 'Proyectos | Ángel GF',
                cvPath: 'assets/descargas/Angel-Cv.pdf',
                cvName: 'Angel-Cv.pdf',
            },
            nav: {
                home: 'Inicio',
                projects: 'Proyectos',
                about: 'Sobre mí',
                contact: 'Contacto',
            },
            commonLabels: {
                cv: 'CV',
                repo: 'Visitar Repositorio',
                web: 'Visitar Web',
                rights: '© 2026 Ángel Guiberteau. Todos los derechos reservados.',
            },
            index: {
                status: 'Disponible para trabajar',
                heroTitle: 'Construyo Productos<br>Donde la <span class="text-gradient">Lógica se encuentra con el Código.</span>',
                heroDescription: 'Desarrollador full stack centrado en Laravel, frontend moderno, UI funcional e integración de APIs para soluciones web prácticas y escalables.<br>Experiencia real en proyectos colaborativos, liderazgo técnico y aprendizaje aplicado en IA, datos y automatización.<br><br><strong>Construir. Aprender. Optimizar. Repetir.</strong>',
                aboutBtn: 'Conóceme más',
                sectionKicker: 'Destacados',
                sectionTitle: 'Trabajo <span class="text-gradient">seleccionado</span>',
                sectionDesc: 'Desarrollo freelance, corporativo y proyectos web full stack.',
                thbBadge: '<i class="fas fa-lock"></i> Privado',
                thbMeta: 'Corporativo actual · Frontend & Full Stack',
                thbTitle: 'Experiencia en THB Hotels',
                thbText: 'Actualmente trabajo como <strong>Responsable de Frontend & Full Stack Developer</strong> en <strong>THB Hotels</strong>, desarrollando aplicaciones internas, webs públicas y soluciones corporativas con foco en <strong>Laravel</strong>, <strong>UI/UX</strong>, arquitectura frontend y experiencia de usuario. También participo en backend, diseño de APIs, optimización y evolución de un paquete interno que unifica componentes, patrones visuales y criterios técnicos entre proyectos.',
                thbList: ['Arquitectura frontend y componentes compartidos para proyectos corporativos.', 'Participación en backend, APIs, optimización y evolución técnica.', 'Trabajo sobre herramientas internas, intranet y presencia web pública.'],
                rivoMeta: 'Proyecto Fin de Grado · Full Stack',
                rivoText: 'Aplicación web de finanzas personales centrada en dashboard, lógica de negocio, autenticación y experiencia de usuario.',
                cityMeta: 'Juego web · Frontend',
                cityText: 'Juego multijugador en navegador donde las decisiones de los jugadores impactan en indicadores clave de la ciudad.',
                freelanceMeta: 'Cliente real · Diseño, SEO y desarrollo',
                freelanceText: 'Web para la compraventa y tasación de vehículos de lujo, clásicos y de segunda mano. Diseño premium orientado a conversión, SEO y presencia profesional.',
            },
            about: {
                kicker: '<i class="fas fa-user-circle me-1"></i> Perfil Profesional',
                title: 'Hola 👋, soy <span class="text-gradient">Ángel Guiberteau</span>',
                subtitle: 'Desarrollador Full Stack · Frontend & Backend · UI/UX · IA, BigData y automatización',
                focusTitle: 'Mi Enfoque',
                focus1: '<strong>Desarrollador de Aplicaciones Web</strong> y actualmente <strong>Responsable de Frontend</strong> en <strong>THB Hotels</strong>. Mi enfoque se basa en crear soluciones digitales claras, eficientes y orientadas a la experiencia del usuario, combinando diseño, lógica y arquitectura.',
                focus2: 'Trabajo como <strong>desarrollador full stack especializado en Laravel</strong>, integrando diseño <strong>UI/UX</strong>, desarrollo frontend y contribuciones en backend. También estoy ampliando mi perfil hacia <strong>IA aplicada</strong>, <strong>IA APIs</strong>, automatización y análisis de datos para construir soluciones más inteligentes, escalables y útiles.',
                journeyTitle: 'Trayectoria',
                inProgress: 'En curso',
                present: 'Actualidad',
                aiRole: 'Especialización en IA y Big Data',
                aiCompany: 'Formación Superior',
                aiText: 'Formación avanzada en <strong>inteligencia artificial</strong>, <strong>machine learning</strong>, automatización, análisis de datos e integración de <strong>IA APIs</strong>. Trabajo con Python, TensorFlow, notebooks, Google Colab, Anaconda y herramientas orientadas a programación de modelos y experimentación.',
                freelanceText: 'Desarrollo de soluciones a medida con enfoque en <strong>rendimiento</strong>, <strong>conversión</strong> y experiencia de usuario. Diseño UI/UX, SEO, arquitectura escalable y aplicaciones orientadas al negocio.',
                thbRole: 'Responsable de Frontend & Full Stack Developer',
                thbText: '<strong>Desarrollador Full Stack especializado en Laravel</strong> y <strong>Responsable del área de frontend</strong> en <strong>THB Hotels</strong>. Trabajo tanto en <strong>aplicaciones internas</strong> como en <strong>webs públicas</strong>, combinando desarrollo frontend con diseño <strong>UI/UX</strong>.<br><br>También trabajo en el desarrollo y evolución de un <strong>paquete interno corporativo</strong> que unifica la experiencia visual y técnica de los proyectos, incorporando componentes propios y patrones comunes.<br><br>Además participo en tareas backend —<strong>diseño de APIs</strong>, <strong>optimización</strong> y <strong>arquitectura</strong>— realizando implementaciones clave dentro de la estrategia tecnológica de la empresa.',
                educationRole: 'Técnico Superior en Desarrollo de Aplicaciones Web',
                educationText: 'Formación completa en <strong>programación</strong> y <strong>desarrollo web</strong>.<br><br>Durante el periodo de dual y prácticas fui seleccionado por <strong>THB Hotels</strong>, donde asumí responsabilidades reales desde el primer momento.<br><br>Lideré módulos de proyectos internos —como plataformas educativas y herramientas corporativas— coordinando tareas, revisando código y defendiendo soluciones técnicas en reuniones con responsables.<br><br>Reconocimientos: <strong>Mención Honorífica</strong> en Desarrollo Web en Entorno Cliente y <strong>Premio a la Dedicación y Esfuerzo Personal</strong>.',
                databases: 'Bases de datos',
                aiStack: 'IA, datos & automatización',
                tools: 'Herramientas & Workflow',
                languages: 'Idiomas',
                spanish: 'Español · Nativo',
                english: 'Inglés · Fluido',
                french: 'Francés · Básico',
                contactTitle: 'Contacto',
                contactText: 'Abierto a oportunidades donde pueda aportar en frontend, Laravel, UI/UX, producto digital e integración de IA aplicada.',
                contactBtn: 'Contactar',
            },
            projects: {
                kicker: '<i class="fas fa-code-branch"></i> Trabajo seleccionado',
                title: 'Proyectos, producto y <span class="text-gradient">experiencia técnica</span>',
                desc: 'Una selección de trabajo corporativo, freelance y proyectos full stack donde combino Laravel, frontend, UI/UX y criterio de producto para construir interfaces claras y soluciones web mantenibles.',
                panelTitle: 'Enfoque',
                panelText: 'Priorizo aplicaciones útiles, interfaces consistentes y decisiones técnicas que puedan evolucionar sin perder claridad.',
                contact: 'Contactar',
                featured: 'Destacados',
                sectionTitle: 'Trabajo con más peso profesional',
                sectionDesc: 'Casos donde el diseño, la arquitectura y la ejecución técnica tienen un papel central.',
                thbBadge: '<i class="fas fa-lock"></i> Privado',
                thbMeta: 'Corporativo actual · Frontend & Full Stack',
                thbText1: 'Actualmente trabajo como <strong>Full Stack Developer</strong> y <strong>Responsable del área de Frontend</strong>, participando en aplicaciones internas, webs públicas y soluciones corporativas. Mi día a día combina <strong>Laravel</strong>, APIs REST, frontend, UI/UX, optimización y construcción de componentes reutilizables.',
                thbText2: 'También trabajo en la evolución de un paquete interno corporativo que unifica la experiencia visual y técnica de los proyectos, incorporando componentes propios, patrones comunes y criterios de interfaz mantenibles.',
                thbPoints: ['Desarrollo de herramientas internas, intranet, webs públicas y flujos corporativos.', 'Diseño frontend con foco en consistencia visual, accesibilidad práctica y experiencia de usuario.', 'Participación en backend: diseño de APIs, optimización, arquitectura e integraciones clave.', 'Construcción de componentes reutilizables para acelerar y ordenar nuevos desarrollos.'],
                thbInfo: ['Responsabilidad', 'Responsable de frontend, desarrollo full stack y definición de criterios visuales compartidos.', 'Tipo de producto', 'Aplicaciones internas, intranet, webs públicas, componentes corporativos y sistemas operativos.', 'Forma de trabajo', 'Laravel, APIs REST, UI/UX, optimización, componentes reutilizables y colaboración con backend.'],
                rivoMeta: 'Proyecto Fin de Grado · Full Stack',
                rivoText: 'Gestor financiero personal centrado en dashboard, autenticación, lógica de negocio y una experiencia de usuario pensada para consultar y organizar datos con rapidez.',
                freelanceMeta: 'Cliente real · Diseño, SEO y desarrollo',
                freelanceText: 'Marketplace para vehículos clásicos y de lujo con una experiencia visual premium, enfoque comercial y estructura orientada a presencia de marca.',
                moreKicker: 'Más proyectos',
                moreTitle: 'Full stack, formación y experimentación',
                moreDesc: 'Proyectos útiles para mostrar base técnica, arquitectura MVC, CRUD, consumo de datos y lógica frontend.',
                code: 'Ver código',
                web: 'Visitar web',
                compact: [
                    ['Formación dual · Laravel MVC', 'Concesionario', 'Sistema de gestión de stock, ventas y clientes para consolidar arquitectura MVC, Eloquent, Blade y flujos CRUD completos.'],
                    ['Full stack · Auth y CRUD', 'Task Manager', 'Aplicación de gestión de tareas con autenticación, categorías, estados y una interfaz directa para organizar flujos de trabajo.'],
                    ['Frontend · Datos y juego web', 'Democratic City', 'Proyecto multijugador en navegador basado en decisiones colectivas que afectan a indicadores de ciudad mediante lógica JavaScript y datos JSON.'],
                ],
            },
        },
        en: {
            common: {
                titleIndex: 'Ángel GF | Full Stack Developer',
                titleAbout: 'About | Ángel GF',
                titleProjects: 'Projects | Ángel GF',
                cvPath: 'assets/descargas/Angel-Cv-EN.pdf',
                cvName: 'Angel-Cv-EN.pdf',
            },
            nav: {
                home: 'Home',
                projects: 'Projects',
                about: 'About',
                contact: 'Contact',
            },
            commonLabels: {
                cv: 'CV',
                repo: 'Visit Repository',
                web: 'Visit Website',
                rights: '© 2026 Ángel Guiberteau. All rights reserved.',
            },
            index: {
                status: 'Available for work',
                heroTitle: 'I Build Products<br>Where <span class="text-gradient">Logic Meets Code.</span>',
                heroDescription: 'Full stack developer focused on Laravel, modern frontend, functional UI and API integration for practical, scalable web solutions.<br>Real experience in collaborative projects, technical leadership and applied learning in AI, data and automation.<br><br><strong>Build. Learn. Optimize. Repeat.</strong>',
                aboutBtn: 'Learn more',
                sectionKicker: 'Featured',
                sectionTitle: '<span class="text-gradient">Selected</span> work',
                sectionDesc: 'Freelance, corporate and full stack web projects.',
                thbBadge: '<i class="fas fa-lock"></i> Private',
                thbMeta: 'Current corporate role · Frontend & Full Stack',
                thbTitle: 'Experience at THB Hotels',
                thbText: 'I currently work as <strong>Frontend Lead & Full Stack Developer</strong> at <strong>THB Hotels</strong>, building internal applications, public websites and corporate solutions focused on <strong>Laravel</strong>, <strong>UI/UX</strong>, frontend architecture and user experience. I also contribute to backend work, API design, optimization and the evolution of an internal package that unifies components, visual patterns and technical standards across projects.',
                thbList: ['Frontend architecture and shared components for corporate projects.', 'Backend contributions, APIs, optimization and technical evolution.', 'Work on internal tools, intranet and public web presence.'],
                rivoMeta: 'Final Degree Project · Full Stack',
                rivoText: 'Personal finance web app focused on dashboard, business logic, authentication and user experience.',
                cityMeta: 'Web game · Frontend',
                cityText: 'Browser multiplayer game where player decisions affect key city indicators.',
                freelanceMeta: 'Real client · Design, SEO and development',
                freelanceText: 'Website for buying, selling and valuing luxury, classic and used vehicles. Premium design focused on conversion, SEO and professional presence.',
            },
            about: {
                kicker: '<i class="fas fa-user-circle me-1"></i> Professional Profile',
                title: 'Hi 👋, I am <span class="text-gradient">Ángel Guiberteau</span>',
                subtitle: 'Full Stack Developer · Frontend & Backend · UI/UX · AI, BigData and automation',
                focusTitle: 'My Approach',
                focus1: '<strong>Web Application Developer</strong> and currently <strong>Frontend Lead</strong> at <strong>THB Hotels</strong>. My approach is based on creating clear, efficient digital solutions focused on user experience, combining design, logic and architecture.',
                focus2: 'I work as a <strong>full stack developer specialized in Laravel</strong>, integrating <strong>UI/UX</strong> design, frontend development and backend contributions. I am also expanding my profile into <strong>applied AI</strong>, <strong>AI APIs</strong>, automation and data analysis to build smarter, scalable and useful solutions.',
                journeyTitle: 'Timeline',
                inProgress: 'In progress',
                present: 'Present',
                aiRole: 'AI and Big Data Specialization',
                aiCompany: 'Advanced Training',
                aiText: 'Advanced training in <strong>artificial intelligence</strong>, <strong>machine learning</strong>, automation, data analysis and <strong>AI APIs</strong> integration. I work with Python, TensorFlow, notebooks, Google Colab, Anaconda and tools focused on model programming and experimentation.',
                freelanceText: 'Custom solutions focused on <strong>performance</strong>, <strong>conversion</strong> and user experience. UI/UX design, SEO, scalable architecture and business-oriented applications.',
                thbRole: 'Frontend Lead & Full Stack Developer',
                thbText: '<strong>Full Stack Developer specialized in Laravel</strong> and <strong>Frontend Lead</strong> at <strong>THB Hotels</strong>. I work on both <strong>internal applications</strong> and <strong>public websites</strong>, combining frontend development with <strong>UI/UX</strong> design.<br><br>I also work on the development and evolution of an <strong>internal corporate package</strong> that unifies the visual and technical experience of projects through custom components and shared patterns.<br><br>I also contribute to backend tasks —<strong>API design</strong>, <strong>optimization</strong> and <strong>architecture</strong>— delivering key implementations within the company technology strategy.',
                educationRole: 'Higher Technician in Web Application Development',
                educationText: 'Complete training in <strong>programming</strong> and <strong>web development</strong>.<br><br>During the dual training and internship period I was selected by <strong>THB Hotels</strong>, where I took on real responsibilities from the beginning.<br><br>I led modules for internal projects, such as educational platforms and corporate tools, coordinating tasks, reviewing code and defending technical solutions in meetings with stakeholders.<br><br>Recognitions: <strong>Honorable Mention</strong> in Client-Side Web Development and <strong>Dedication and Personal Effort Award</strong>.',
                databases: 'Databases',
                aiStack: 'AI, data & automation',
                tools: 'Tools & Workflow',
                languages: 'Languages',
                spanish: 'Spanish · Native',
                english: 'English · Fluent',
                french: 'French · Basic',
                contactTitle: 'Contact',
                contactText: 'Open to opportunities where I can contribute in frontend, Laravel, UI/UX, digital product and applied AI integration.',
                contactBtn: 'Contact',
            },
            projects: {
                kicker: '<i class="fas fa-code-branch"></i> Selected work',
                title: 'Projects, product and <span class="text-gradient">technical experience</span>',
                desc: 'A selection of corporate, freelance and full stack projects where I combine Laravel, frontend, UI/UX and product thinking to build clear interfaces and maintainable web solutions.',
                panelTitle: 'Focus',
                panelText: 'I prioritize useful applications, consistent interfaces and technical decisions that can evolve without losing clarity.',
                contact: 'Contact',
                featured: 'Featured',
                sectionTitle: 'Work with stronger professional weight',
                sectionDesc: 'Cases where design, architecture and technical execution play a central role.',
                thbBadge: '<i class="fas fa-lock"></i> Private',
                thbMeta: 'Current corporate role · Frontend & Full Stack',
                thbText1: 'I currently work as a <strong>Full Stack Developer</strong> and <strong>Frontend Lead</strong>, contributing to internal applications, public websites and corporate solutions. My day-to-day combines <strong>Laravel</strong>, REST APIs, frontend, UI/UX, optimization and reusable component development.',
                thbText2: 'I also work on the evolution of an internal corporate package that unifies the visual and technical experience of projects through custom components, shared patterns and maintainable interface criteria.',
                thbPoints: ['Development of internal tools, intranet, public websites and corporate flows.', 'Frontend design focused on visual consistency, practical accessibility and user experience.', 'Backend contributions: API design, optimization, architecture and key integrations.', 'Reusable component development to speed up and organize new implementations.'],
                thbInfo: ['Responsibility', 'Frontend lead, full stack development and shared visual criteria definition.', 'Product type', 'Internal applications, intranet, public websites, corporate components and operational systems.', 'Working style', 'Laravel, REST APIs, UI/UX, optimization, reusable components and backend collaboration.'],
                rivoMeta: 'Final Degree Project · Full Stack',
                rivoText: 'Personal finance manager focused on dashboard, authentication, business logic and a user experience designed to check and organize data quickly.',
                freelanceMeta: 'Real client · Design, SEO and development',
                freelanceText: 'Marketplace for classic and luxury vehicles with a premium visual experience, commercial focus and brand presence structure.',
                moreKicker: 'More projects',
                moreTitle: 'Full stack, training and experimentation',
                moreDesc: 'Useful projects that show technical foundations, MVC architecture, CRUD, data consumption and frontend logic.',
                code: 'View code',
                web: 'Visit website',
                compact: [
                    ['Dual training · Laravel MVC', 'CarDealership', 'Stock, sales and customer management system to consolidate MVC architecture, Eloquent, Blade and complete CRUD flows.'],
                    ['Full stack · Auth and CRUD', 'Task Manager', 'Task management application with authentication, categories, statuses and a direct interface to organize workflows.'],
                    ['Frontend · Data and web game', 'Democratic City', 'Browser multiplayer project based on collective decisions that affect city indicators through JavaScript logic and JSON data.'],
                ],
            },
        },
    };

    const pageName = (() => {
        const path = window.location.pathname;
        if (path.includes('about')) return 'about';
        if (path.includes('projects')) return 'projects';
        return 'index';
    })();

    const getInitialLanguage = () => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage === 'es' || savedLanguage === 'en') return savedLanguage;
        return navigator.language && navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
    };

    const setHtml = (selector, value) => {
        document.querySelectorAll(selector).forEach((el) => {
            el.innerHTML = value;
        });
    };

    const setText = (selector, value) => {
        document.querySelectorAll(selector).forEach((el) => {
            el.textContent = value;
        });
    };

    const updateCvLinks = (lang) => {
        const t = translations[lang].common;
        document.querySelectorAll('[data-cv-download]').forEach((link) => {
            link.setAttribute('href', t.cvPath);
            link.setAttribute('download', t.cvName);
        });
    };

    const runLanguageTransition = (callback) => {
        if (shouldReduceMotion) {
            callback();
            return;
        }

        html.classList.add('is-language-changing');
        window.setTimeout(() => {
            callback();
            window.requestAnimationFrame(() => {
                html.classList.remove('is-language-changing');
            });
        }, 110);
    };

    const applyLanguage = (lang, saveToStorage = false) => {
        const t = translations[lang];
        const termTranslations = {
            es: {
                'AI Automation': 'Automatización con IA',
                Architecture: 'Arquitectura',
                'Corporate Tools': 'Herramientas corporativas',
            },
            en: {
                'Automatización con IA': 'AI Automation',
                Arquitectura: 'Architecture',
                'Herramientas corporativas': 'Corporate Tools',
                'Corporate Tools': 'Corporate Tools',
            },
        };

        document.documentElement.lang = lang;
        html.dataset.language = lang;
        if (saveToStorage) localStorage.setItem('language', lang);

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.dataset.i18n;
            const value = key.split('.').reduce((acc, part) => acc && acc[part], {
                nav: t.nav,
                common: t.commonLabels,
            });
            if (value) el.innerHTML = value;
        });

        document.querySelectorAll('[data-lang-option]').forEach((button) => {
            const active = button.dataset.langOption === lang;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });

        updateCvLinks(lang);

        document.querySelectorAll('.tag, .marquee-group span').forEach((el) => {
            const replacement = termTranslations[lang][el.textContent.trim()];
            if (replacement) el.textContent = replacement;
        });

        if (pageName === 'index') {
            document.title = t.common.titleIndex;
            setHtml('.hero-status', `<span class="status-dot"></span> ${t.index.status}`);
            setHtml('.hero-title', t.index.heroTitle);
            setHtml('.hero-description', t.index.heroDescription);
            setText('.hero-buttons .btn-primary', t.index.aboutBtn);
            setText('#work .section-kicker', t.index.sectionKicker);
            setHtml('#work .section-header h2', t.index.sectionTitle);
            setText('#work .section-header p', t.index.sectionDesc);
            setHtml('.item-thb .card-badge', t.index.thbBadge);
            setText('.item-thb .project-meta', t.index.thbMeta);
            setText('.item-thb h3', t.index.thbTitle);
            setHtml('.item-thb p', t.index.thbText);
            document.querySelectorAll('.item-thb .impact-list li').forEach((li, index) => {
                if (t.index.thbList[index]) li.textContent = t.index.thbList[index];
            });
            setText('.item-rivo .project-meta', t.index.rivoMeta);
            setText('.item-rivo p', t.index.rivoText);
            setText('.item-rivo .link-action', `${t.commonLabels.repo} `);
            document.querySelectorAll('.item-rivo .link-action, .project-card:not(.item-thb):not(.item-rivo):not(.item-freelance) .link-action').forEach((link) => {
                if (link.href && link.href.includes('github.com')) link.innerHTML = `<i class="fab fa-github"></i> ${t.commonLabels.repo} <i class="fas fa-arrow-right"></i>`;
            });
            const cityCard = document.querySelector('.project-card:not(.item-thb):not(.item-rivo):not(.item-freelance)');
            if (cityCard) {
                const meta = cityCard.querySelector('.project-meta');
                const p = cityCard.querySelector('p');
                if (meta) meta.textContent = t.index.cityMeta;
                if (p) p.textContent = t.index.cityText;
            }
            setText('.item-freelance .project-meta', t.index.freelanceMeta);
            setText('.item-freelance p', t.index.freelanceText);
            setHtml('.item-freelance .link-action', `${t.commonLabels.web} <i class="fas fa-arrow-right"></i>`);
            setText('.footer p', t.commonLabels.rights);
        }

        if (pageName === 'about') {
            document.title = t.common.titleAbout;
            setHtml('.hero-kicker', t.about.kicker);
            setHtml('.hero-title', t.about.title);
            setText('.hero-subtitle', t.about.subtitle);
            const cards = document.querySelectorAll('.bento-card');
            if (cards[0]) {
                cards[0].querySelector('.card-title').textContent = t.about.focusTitle;
                const paragraphs = cards[0].querySelectorAll('.card-text p');
                if (paragraphs[0]) paragraphs[0].innerHTML = t.about.focus1;
                if (paragraphs[1]) paragraphs[1].innerHTML = t.about.focus2;
            }
            if (cards[1]) cards[1].querySelector('.card-title').textContent = t.about.journeyTitle;
            const items = document.querySelectorAll('.timeline-item');
            if (items[0]) {
                items[0].querySelector('.timeline-date').textContent = t.about.inProgress;
                items[0].querySelector('.timeline-role').textContent = t.about.aiRole;
                items[0].querySelector('.timeline-company').textContent = t.about.aiCompany;
                items[0].querySelector('p').innerHTML = t.about.aiText;
            }
            if (items[1]) {
                items[1].querySelector('.timeline-date').textContent = t.about.present;
                items[1].querySelector('p').innerHTML = t.about.freelanceText;
            }
            if (items[2]) {
                items[2].querySelector('.timeline-date').textContent = t.about.present;
                items[2].querySelector('.timeline-role').textContent = t.about.thbRole;
                items[2].querySelector('p').innerHTML = t.about.thbText;
            }
            if (items[3]) {
                items[3].querySelector('.timeline-role').textContent = t.about.educationRole;
                items[3].querySelector('p').innerHTML = t.about.educationText;
            }
            const stackLabels = document.querySelectorAll('.bento-card:nth-of-type(1) .text-muted.small');
            if (stackLabels[2]) stackLabels[2].textContent = t.about.databases;
            if (stackLabels[3]) stackLabels[3].textContent = t.about.aiStack;
            if (stackLabels[4]) stackLabels[4].textContent = t.about.tools;
            const sideCards = document.querySelectorAll('.col-lg-4 .bento-card');
            if (sideCards[1]) {
                sideCards[1].querySelector('.card-title').textContent = t.about.languages;
                const badges = sideCards[1].querySelectorAll('.t-badge');
                if (badges[0]) badges[0].textContent = t.about.spanish;
                if (badges[1]) badges[1].textContent = t.about.english;
                if (badges[2]) badges[2].textContent = t.about.french;
            }
            if (sideCards[2]) {
                sideCards[2].querySelector('.card-title').textContent = t.about.contactTitle;
                sideCards[2].querySelector('.card-text').textContent = t.about.contactText;
                sideCards[2].querySelector('.contact-btn').textContent = t.about.contactBtn;
            }
            setText('.footer p', t.commonLabels.rights);
        }

        if (pageName === 'projects') {
            document.title = t.common.titleProjects;
            setHtml('.projects-hero-copy .section-kicker', t.projects.kicker);
            setHtml('.projects-hero-copy h1', t.projects.title);
            setText('.projects-hero-copy p', t.projects.desc);
            setText('.projects-hero-panel span', t.projects.panelTitle);
            setText('.projects-hero-panel p', t.projects.panelText);
            setText('.projects-hero-panel .btn-primary', t.projects.contact);
            setText('.project-section-heading .section-kicker', t.projects.featured);
            setText('.project-section-heading h2', t.projects.sectionTitle);
            setText('.project-section-heading p', t.projects.sectionDesc);
            setHtml('.item-thb .card-badge', t.projects.thbBadge);
            setText('.item-thb .project-meta', t.projects.thbMeta);
            const thbParagraphs = document.querySelectorAll('.item-thb .thb-card-main p');
            if (thbParagraphs[0]) thbParagraphs[0].innerHTML = t.projects.thbText1;
            if (thbParagraphs[1]) thbParagraphs[1].innerHTML = t.projects.thbText2;
            document.querySelectorAll('.item-thb .project-points li').forEach((li, index) => {
                if (t.projects.thbPoints[index]) li.textContent = t.projects.thbPoints[index];
            });
            document.querySelectorAll('.item-thb .thb-info-block').forEach((block, index) => {
                const label = block.querySelector('span');
                const text = block.querySelector('p');
                if (label) label.textContent = t.projects.thbInfo[index * 2];
                if (text) text.textContent = t.projects.thbInfo[index * 2 + 1];
            });
            setText('.item-rivo .project-meta', t.projects.rivoMeta);
            setText('.item-rivo p', t.projects.rivoText);
            setText('.item-freelance .project-meta', t.projects.freelanceMeta);
            setText('.item-freelance p', t.projects.freelanceText);
            setHtml('.item-freelance .link-action', `${t.projects.web} <i class="fas fa-arrow-right"></i>`);
            document.querySelectorAll('.item-rivo .link-action, .project-card-compact .link-action').forEach((link) => {
                link.innerHTML = `<i class="fab fa-github"></i> ${t.projects.code} <i class="fas fa-arrow-right"></i>`;
            });

            const sections = document.querySelectorAll('.project-section-heading');
            if (sections[1]) {
                sections[1].querySelector('.section-kicker').textContent = t.projects.moreKicker;
                sections[1].querySelector('h2').textContent = t.projects.moreTitle;
                sections[1].querySelector('p').textContent = t.projects.moreDesc;
            }
            document.querySelectorAll('.project-card-compact').forEach((card, index) => {
                const data = t.projects.compact[index];
                if (!data) return;
                card.querySelector('.project-meta').textContent = data[0];
                card.querySelector('h3').textContent = data[1];
                card.querySelector('p').textContent = data[2];
            });
        }
    };

    const initialLanguage = getInitialLanguage();
    applyLanguage(initialLanguage, false);
    let currentLanguage = initialLanguage;

    document.querySelectorAll('[data-lang-option]').forEach((button) => {
        button.addEventListener('click', () => {
            const nextLanguage = button.dataset.langOption;
            if (!translations[nextLanguage] || nextLanguage === currentLanguage) return;

            runLanguageTransition(() => {
                applyLanguage(nextLanguage, true);
                currentLanguage = nextLanguage;
            });
        });
    });

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
