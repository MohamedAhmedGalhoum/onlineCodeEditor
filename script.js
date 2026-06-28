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

// =========  Utilities  ========= //
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const out = $("#output");
const preview = $("preview"); 
const STORAGE_KEY = "galhoum-code-editor";

const escapeHtml = s => 
    String(s).replace(/[&<>"]/g, c => ({
        '&': "&amp;",
        '<': "&lt;",
        '>': "&gt;",
        '"': "&quot;"
    }[c]
));

function log(msg, type = 'info'){
    const color = type === "error" ? 'var(--err)' : type === "warn" ? 'var(--warn)' : 'var(--brand)';
    const time = new Date().toLocaleTimeString();
    const line = document.createElement("div"); 
    line.innerHTML = `<span style="color: ${color}">[${time}]</span> ${escapeHtml(msg)}`;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
}

function clearOut() {
    out.innerHTML = "";
}

$("clearOut")?.addEventListener("click", clearOut);

function makeEditor(id, mode){
    const ed = ace.edit(id, {
        theme: "ace/theme/monokai",
        mode, tabSize: 2, useSofttabs: true, showTabs: true, showPrintMargin: false, wrap: true
    });
    ed.session.setUseWrapMode(true);
    ed.commands.addCommand({
        name: "run",
        bindKey: {
            win: `ctrl-Enter`,
            mac: `Command-Enter`
        },
        exec(){runWeb(false)}
    });
    ed.commands.addCommand({
        name: "save",
        bindKey: {
            win: "Ctrl-S",
            mac: "command-S"
        },
        exec(){saveProject();}
    });
    return ed;
}

