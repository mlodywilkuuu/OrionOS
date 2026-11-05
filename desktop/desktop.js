document.addEventListener("DOMContentLoaded",()=>{
const root=document.getElementById("orion-desktop");
const screen=window.OrionScreen.render(root);
window.OrionWindows.render(screen.querySelector("#orion-windows"));
window.OrionTaskbar.render(root);
function openWindow(name){document.querySelectorAll(".app-window").forEach(w=>w.classList.remove("open"));document.getElementById("window-"+name)?.classList.add("open");document.getElementById("start-menu").classList.remove("open")}
document.querySelectorAll("[data-window]").forEach(button=>button.addEventListener("click",()=>openWindow(button.dataset.window)));
document.querySelectorAll("[data-open]").forEach(button=>button.addEventListener("click",()=>openWindow(button.dataset.open)));
document.querySelectorAll(".window-close").forEach(button=>button.addEventListener("click",()=>button.closest(".app-window").classList.remove("open")));
document.getElementById("launcher").addEventListener("click",()=>document.getElementById("start-menu").classList.toggle("open"));
});
