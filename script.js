/*
 * Transfers the active state between tabs so the user
 * can easily identify the currently selected section.
 */
const tabs = document.querySelectorAll(".tab");
let activeTab = document.querySelector(".tab.active");
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        activeTab.classList.remove("active");
        tab.classList.add("active");
        activeTab = tab;
    });
});