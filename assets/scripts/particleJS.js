const particlesConfig = {
    "particles": {
        "number": { 
            "value": 130, 
            "density": { "enable": true, "value_area": 1600 }
        },
        "color": { "value": ["#0dddc8"] },
        "shape": { "type": ["circle"], "stroke": { "width": 0, "color": "#000" } },
        "opacity": {
            "value": 0.7,
            "random": true
        },
        "size": {
            "value": 5,
            "random": true
        },
        "line_linked": {
            "enable": true,
            "distance": 160,
            "color": "#1cc9b7",
            "opacity": 0.6,
            "width": 2
        },
        "move": {
            "enable": true,
            "speed": 1,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false
        }
    },
    "interactivity": {
        "detect_on": "window", 
        "events": {
            "onhover": { "enable": true, "mode": ["grab", "repulse"] },
            "onclick": { "enable": true, "mode": "push" },
            "resize": true
        },
        "modes": {
            "grab": { "distance": 140, "line_linked": { "opacity": 0.4 } },
            "repulse": { "distance": 70, "duration": 1.2 },
            "push": { "particles_nb": 4 }
        }
    },
    "retina_detect": true
};

function initParticles() {
    particlesJS("particles-js", particlesConfig);
}

window.addEventListener('load', () => {
    initParticles();

    const checkParticlesReady = () => {
        if (window.pJSDom && window.pJSDom.length > 0) {
            const pJS = window.pJSDom[0].pJS;

            window.addEventListener('mousemove', (e) => {
                const rect = pJS.canvas.el.getBoundingClientRect();
                const posX = e.clientX - rect.left;
                const posY = e.clientY - rect.top;

                pJS.interactivity.mouse.pos_x = posX;
                pJS.interactivity.mouse.pos_y = posY;
                pJS.interactivity.status = "mousemove";
            });

            clearInterval(checker);
        }
    };

    const checker = setInterval(checkParticlesReady, 100);
});

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.pJSDom && window.pJSDom.length) {
            window.pJSDom[0].pJS.fn.vendors.destroypJS();
            window.pJSDom = [];
        }
        initParticles();
    }, 300);
});