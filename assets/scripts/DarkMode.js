
    const toggleButton = document.getElementById("dark-mode-toggle");
    const body = document.body;

    // Comprobar si ya existe una preferencia guardada en el almacenamiento local
    const savedMode = localStorage.getItem("theme");

    // Si no hay preferencia guardada, configurar el modo oscuro por defecto
    if (savedMode === "light") {
        body.classList.add("light-mode");
        toggleButton.textContent = "☀️"; // Actualizar icono para modo claro
    } else {
        // Por defecto, el modo oscuro
        body.classList.remove("light-mode");
        toggleButton.textContent = "🌙"; // Icono para modo oscuro
    }

    // Alternar entre modo oscuro y claro al hacer clic en el botón
    toggleButton.addEventListener("click", () => {
        body.classList.toggle("light-mode");
        const isLightMode = body.classList.contains("light-mode");
        localStorage.setItem("theme", isLightMode ? "light" : "dark");
        toggleButton.textContent = isLightMode ? "☀️" : "🌙";
    });
