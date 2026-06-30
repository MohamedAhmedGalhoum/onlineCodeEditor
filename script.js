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

/*
 * Escapes special HTML characters to prevent
 * HTML injection when displaying user-generated content.
 */
const escapeHtml = s => 
    String(s).replace(/[&<>"]/g, c => ({
        '&': "&amp;",
        '<': "&lt;",
        '>': "&gt;",
        '"': "&quot;"
    }[c]
));

const escapeHtml = s => 
    String(s).replace(/[&<>"]/g, c => ({
        '&': "&amp;",
        '<': "&lt;",
        '>': "&gt;",
        '"': "&quot;"
    }[c]
));

/*
 * Appends a timestamped message to the output console
 * using a color that matches the message type.
 */
function log(msg, type = 'info'){
    const color = type === "error" ? 'var(--err)' : type === "warn" ? 'var(--warn)' : 'var(--brand)';
    const time = new Date().toLocaleTimeString();
    const line = document.createElement("div"); 
    line.innerHTML = `<span style="color: ${color}">[${time}]</span> ${escapeHtml(msg)}`;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
}

/*
 * Clears all messages from the output console,
 * giving the user a fresh logging area.
 */
function clearOut() {
    out.innerHTML = "";
}

$("clearOut")?.addEventListener("click", clearOut);

/*
 * Clears all messages from the output console,
 * giving the user a fresh logging area.
 */
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

const ed_html = makeEditor("ed-html", "ace/mode/html");
const ed_css = makeEditor("ed_css", "ace/mode/css");
const ed_js = makeEditor("ed_js", "ace/mode/javascript");

const TAB_ORDER = ["html", "css", "js"];

const wraps = Object.fromEntries($$("#webEditors .editor-wrap")).map(w => [w.dataset.pane, w]);

const editors = {
    html: ed_html,
    css: ed_css,
    js: ed_js
};

/*
 * Returns the identifier of the currently active
 * editor tab, defaulting to the HTML editor.
 */
function activePane(){
    const t = $("#webTabs .tab.active");
    return t ? t.dataset.pane : "html";
}
