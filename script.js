// SIDEBAR TOGGLE
function toggleMenu() {
    let sidebar = document.getElementById("sidebar");
    let overlay = document.getElementById("overlay");

    // Fix: We check the class or computed style instead of just .style.left
    if (sidebar.classList.contains("active")) {
        sidebar.style.left = "-260px";
        overlay.style.display = "none";
        sidebar.classList.remove("active");
    } else {
        sidebar.style.left = "0px";
        overlay.style.display = "block";
        sidebar.classList.add("active");
    }
}

// DARK MODE
function toggleTheme() {
    document.body.classList.toggle("dark");
    let btn = document.querySelector(".theme-btn");

    if (document.body.classList.contains("dark")) {
        btn.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        btn.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
}

// PERSIST THEME ON LOAD
window.addEventListener("DOMContentLoaded", () => {
    let savedTheme = localStorage.getItem("theme");
    let btn = document.querySelector(".theme-btn");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        if(btn) btn.textContent = "☀️";
    }

    // ===== PWA INSTALL BUTTON LOGIC =====
    let deferredPrompt;
    let installBtn = document.getElementById("installBtn");

    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installBtn) installBtn.style.display = "inline-block";
    });

    if (installBtn) {
        installBtn.addEventListener("click", () => {
            installBtn.style.display = "none";
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(() => {
                    deferredPrompt = null;
                });
            }
        });
    }
});
