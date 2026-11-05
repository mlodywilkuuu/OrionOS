window.OrionTaskbar={
render(root){
const config=window.ORION_CONFIG||{};
const header=document.createElement("header");header.className="system-bar";
header.innerHTML='<div class="system-brand">✦ ORIONOS</div><div class="system-tray"><span id="system-profile"></span><span id="system-clock" class="system-clock"></span><span>◈</span></div>';
header.querySelector("#system-profile").textContent=config.username||"Użytkownik";root.appendChild(header);
const menu=document.createElement("section");menu.className="start-menu";menu.id="start-menu";menu.innerHTML='<h3>✦ OrionOS</h3><div class="start-grid"><button data-open="files">▰<br>Pliki</button><button data-open="settings">⚙<br>Ustawienia</button><button data-open="about">✦<br>O systemie</button></div>';root.appendChild(menu);
const dock=document.createElement("nav");dock.className="dock";dock.innerHTML='<button id="launcher" title="Menu" aria-label="Menu">✦</button><button data-open="files" title="Pliki" aria-label="Pliki">▰</button><button data-open="settings" title="Ustawienia" aria-label="Ustawienia">⚙</button><button data-open="about" title="O OrionOS" aria-label="O OrionOS">ⓘ</button>';root.appendChild(dock);
const update=()=>{const zone=config.timezone||undefined;document.getElementById("system-clock").textContent=new Intl.DateTimeFormat(config.language||undefined,{hour:"2-digit",minute:"2-digit",weekday:"short",day:"numeric",month:"short",timeZone:zone}).format(new Date())};
update();setInterval(update,15000);
}
};