function toggleMenu() {
    let sidebar = document.getElementById("sidebar");
    let overlay = document.getElementById("overlay");

    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-260px";
        overlay.style.display = "none";
    } else {
        sidebar.style.left = "0px";
        overlay.style.display = "block";
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

window.onload = function () {
    let savedTheme = localStorage.getItem("theme");
    let btn = document.querySelector(".theme-btn");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        btn.textContent = "☀️";
    }
};

// ===== PWA INSTALL BUTTON =====
let deferredPrompt;
let installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    installBtn.style.display = "inline-block";
});

installBtn.addEventListener("click", () => {
    installBtn.style.display = "none";

    if (deferredPrompt) {
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
        });
    }
});
