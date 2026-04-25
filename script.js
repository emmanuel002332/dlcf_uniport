// SIDEBAR TOGGLE
function toggleMenu() {
    let sidebar = document.getElementById("sidebar");
    let overlay = document.getElementById("overlay");

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

// ✅ Moved outside — so it's always ready
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    let installBtn = document.getElementById("installBtn");
    if (installBtn) installBtn.style.display = "inline-block";
});

// PERSIST THEME ON LOAD
window.addEventListener("DOMContentLoaded", () => {
    let savedTheme = localStorage.getItem("theme");
    let btn = document.querySelector(".theme-btn");

    // ✅ Always set the button emoji
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        if (btn) btn.textContent = "☀️";
    } else {
        if (btn) btn.textContent = "🌙";
    }

    // PWA INSTALL BUTTON
    let installBtn = document.getElementById("installBtn");

    if (installBtn) {
        installBtn.addEventListener("click", () => {
            installBtn.style.display = "none";
            if (deferredPrompt) {
                deferredPrompt.prompt();
                // ✅ Now checks what the user chose
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome !== "accepted") {
                        installBtn.style.display = "inline-block";
                    }
                    deferredPrompt = null;
                });
            }
        });
    }
});