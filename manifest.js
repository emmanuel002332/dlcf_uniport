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

// Theme toggle + save
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

// Load saved theme
window.onload = function () {
    let savedTheme = localStorage.getItem("theme");
    let btn = document.querySelector(".theme-btn");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        btn.textContent = "☀️";
    }
};
let deferredPrompt;
let installBtn = document.getElementById("installBtn");

// Listen for install event
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // show button
    installBtn.style.display = "inline-block";
});

// When user clicks install button
installBtn.addEventListener("click", () => {
    installBtn.style.display = "none";

    if (deferredPrompt) {
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then((choiceResult) => {
            deferredPrompt = null;
        });
    }
});
