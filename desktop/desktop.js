document.addEventListener("DOMContentLoaded",()=>{
const root=document.getElementById("orion-desktop");
const screen=window.OrionScreen.render(root);
window.OrionWindows.render(screen.querySelector("#orion-windows"));
window.OrionTaskbar.render(root);
function openWindow(name){document.querySelectorAll(".app-window").forEach(w=>w.classList.remove("open"));document.getElementById("window-"+name)?.classList.add("open");document.getElementById("start-menu").classList.remove("open")}


document.querySelectorAll(".window-close").forEach(button=>button.addEventListener("click",()=>button.closest(".app-window").classList.remove("open")));
const quickToggle=document.getElementById("quick-toggle"),quickPanel=document.getElementById("quick-panel");
quickToggle.addEventListener("click",e=>{e.stopPropagation();const open=quickPanel.classList.toggle("open");quickToggle.setAttribute("aria-expanded",String(open));});
quickPanel.querySelectorAll("[data-setting]").forEach(tile=>tile.addEventListener("click",()=>{const active=tile.classList.toggle("active");tile.setAttribute("aria-pressed",String(active));const state=tile.querySelector(".tile-state");if(state){const key=tile.dataset.setting;state.textContent=active?({wifi:"Włączone",bluetooth:"Włączone",airplane:"Włączone",volume:"Włączony",battery:"Włączone",night:"Włączona"}[key]||"Włączone"):({wifi:"Wyłączone",bluetooth:"Wyłączone",airplane:"Wyłączone",volume:"Wyciszony",battery:"Wyłączone",night:"Wyłączona"}[key]||"Wyłączone");}}));
document.addEventListener("click",e=>{if(!quickPanel.contains(e.target)&&!quickToggle.contains(e.target)){quickPanel.classList.remove("open");quickToggle.setAttribute("aria-expanded","false");}});
});
