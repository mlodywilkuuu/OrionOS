window.OrionTaskbar={
render(root){
const config=window.ORION_CONFIG||{},system=window.ORION_SYSTEM||{},en=config.language==="en";
const header=document.createElement("header");header.className="system-bar";header.style.cssText="position:fixed!important;left:0!important;right:0!important;bottom:0!important;top:auto!important;width:100vw!important;height:56px!important;min-height:56px!important;z-index:99999!important;display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;";
header.innerHTML='<div class="taskbar-left"><button class="orion-logo" id="orion-logo" aria-label="Menu OrionOS" aria-expanded="false"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3 36 12v16L20 37 4 28V12z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M12 25V15l8 10 8-10v10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="app-search-wrap"><span class="app-search-icon">⌕</span><input id="app-search" class="app-search" type="search" placeholder="Szukaj aplikacji…" autocomplete="off" aria-label="Szukaj aplikacji" aria-controls="app-search-results" aria-expanded="false"><div id="app-search-results" class="app-search-results" role="listbox" hidden></div></div></div><div class="system-tray"><button class="quick-toggle" id="quick-toggle" aria-label="Szybkie ustawienia" aria-expanded="false"><span class="tray-symbol">◉</span><span class="tray-symbol">ᛒ</span><span class="tray-symbol" id="sound-icon">◖))</span><span class="tray-chevron">⌃</span></button><button class="notification-toggle" id="notification-toggle" aria-label="Powiadomienia" aria-expanded="false">🔔<i></i></button><button class="system-clock-wrap" id="calendar-toggle" aria-label="Otwórz kalendarz" aria-expanded="false"><span id="system-clock" class="system-clock"></span><span id="system-date" class="system-date"></span></button></div>';
root.appendChild(header);
const menu=document.createElement("section");menu.className="orion-menu";menu.id="orion-menu";menu.innerHTML='<div class="orion-menu-title"><span class="menu-logo">◈</span><div><b>OrionOS</b><small>Menu systemowe</small></div></div><button class="power-action" data-power="restart"><span>↻</span><span><b>Uruchom ponownie</b><small>Uruchom system ponownie</small></span></button><button class="power-action danger" data-power="shutdown"><span>⏻</span><span><b>Wyłącz</b><small>Przejdź do ekranu wyłączenia</small></span></button>';
root.appendChild(menu);
const panel=document.createElement("section");panel.className="quick-panel";panel.id="quick-panel";panel.setAttribute("aria-label",en?"Network and Bluetooth":"Sieć i Bluetooth");
panel.innerHTML='<div class="quick-panel-head"><button class="quick-back" hidden aria-label="Wstecz">‹</button><strong id="quick-title">Szybkie ustawienia</strong><button class="quick-close" aria-label="Zamknij">×</button></div><div class="quick-home"><div class="quick-grid"><button class="quick-tile active" data-view="wifi"><span class="quick-icon">⌁</span><span><b>Wi-Fi</b><small class="tile-state">Ustawienia sieci</small></span><span class="tile-arrow">›</span></button><button class="quick-tile active" data-view="bluetooth"><span class="quick-icon">ᛒ</span><span><b>Bluetooth</b><small class="tile-state">Urządzenia</small></span><span class="tile-arrow">›</span></button><button class="quick-tile active" data-setting="volume"><span class="quick-icon">◖))</span><span><b>Dźwięk</b><small class="tile-state">Włączony</small></span></button></div></div><div class="quick-subview" id="quick-subview" hidden></div>';
root.appendChild(panel);
const sound=document.createElement("section");sound.className="sound-flyout";sound.id="sound-flyout";sound.innerHTML='<div class="sound-head"><b>Głośność</b><span id="volume-value">70%</span></div><div class="sound-control"><span>◖))</span><input id="volume-slider" type="range" min="0" max="100" value="70" aria-label="Głośność"><button id="mute-toggle" aria-label="Wycisz">◖))</button></div><div class="sound-options"><label><input type="checkbox" id="typing-sound" checked> Dźwięk pisania</label><label><input type="checkbox" id="notification-sound" checked> Dźwięki powiadomień</label></div>';root.appendChild(sound);
const notifications=document.createElement("section");notifications.className="notification-center";notifications.id="notification-center";notifications.innerHTML='<div class="notification-head"><b>Powiadomienia</b><button id="clear-notifications">Wyczyść</button></div><div id="notification-list" class="notification-list"><div class="notification-empty">Nie masz nowych powiadomień</div></div>';root.appendChild(notifications);
const toast=document.createElement("div");toast.className="orion-toast";toast.id="orion-toast";toast.setAttribute("role","status");root.appendChild(toast);
const calendar=document.createElement("section");calendar.className="calendar-panel";calendar.id="calendar-panel";calendar.setAttribute("aria-label","Kalendarz");
calendar.innerHTML='<div class="calendar-head"><strong id="calendar-month"></strong><div><button id="calendar-prev" aria-label="Poprzedni miesiąc">‹</button><button id="calendar-next" aria-label="Następny miesiąc">›</button></div></div><div class="calendar-weekdays"></div><div class="calendar-days" id="calendar-days"></div><div class="calendar-today" id="calendar-today"></div>';
root.appendChild(calendar);
const powerScreen=document.createElement("section");powerScreen.className="power-screen";powerScreen.id="power-screen";powerScreen.innerHTML='<div class="power-spinner" hidden aria-hidden="true"></div><div class="power-orb">◈</div><h1 id="power-title">OrionOS</h1><p id="power-description">System jest gotowy.</p><div class="power-screen-actions"><button id="power-cancel">Anuluj</button><button id="power-confirm">Kontynuuj</button></div>';root.appendChild(powerScreen);
let now=new Date(),shown=new Date(now.getFullYear(),now.getMonth(),1),selected=new Date(now.getFullYear(),now.getMonth(),now.getDate());
const locale=system.locale||"pl-PL",minMonth=0,maxMonth=2100*12+11;
const monthIndex=date=>date.getFullYear()*12+date.getMonth();
const weekdays=Array.from({length:7},(_,i)=>new Intl.DateTimeFormat(locale,{weekday:"short"}).format(new Date(2024,0,1+i)));
calendar.querySelector(".calendar-weekdays").innerHTML=weekdays.map(x=>'<span>'+x+'</span>').join("");
const drawCalendar=()=>{
const y=shown.getFullYear(),m=shown.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,count=new Date(y,m+1,0).getDate();
document.getElementById("calendar-month").textContent=new Intl.DateTimeFormat(locale,{month:"long",year:"numeric"}).format(shown);
const cells=[];
for(let i=0;i<42;i++){const day=i-first+1;if(day<1||day>count){cells.push('<span class="calendar-empty" aria-hidden="true"></span>');continue}
const today=day===now.getDate()&&m===now.getMonth()&&y===now.getFullYear(),chosen=day===selected.getDate()&&m===selected.getMonth()&&y===selected.getFullYear();
cells.push('<button type="button" class="calendar-day'+(today?' today':'')+(chosen?' selected':'')+'" data-day="'+day+'"'+(today?' aria-current="date"':'')+(chosen?' aria-pressed="true"':'')+'>'+day+'</button>');
}
document.getElementById("calendar-days").innerHTML=cells.join("");
document.getElementById("calendar-prev").disabled=monthIndex(shown)<=minMonth;
document.getElementById("calendar-next").disabled=monthIndex(shown)>=maxMonth;
document.getElementById("calendar-today").textContent="Wybrano: "+new Intl.DateTimeFormat(locale,{dateStyle:"full"}).format(selected);
};
const moveMonth=delta=>{const next=monthIndex(shown)+delta;if(next<minMonth||next>maxMonth)return;shown=new Date(Math.floor(next/12),next%12,1);drawCalendar()};
document.getElementById("calendar-prev").addEventListener("click",()=>moveMonth(-1));
document.getElementById("calendar-next").addEventListener("click",()=>moveMonth(1));
document.getElementById("calendar-days").addEventListener("click",event=>{const button=event.target.closest("[data-day]");if(!button)return;selected=new Date(shown.getFullYear(),shown.getMonth(),Number(button.dataset.day));drawCalendar()});
document.getElementById("calendar-today").addEventListener("click",()=>{selected=new Date(now.getFullYear(),now.getMonth(),now.getDate());shown=new Date(now.getFullYear(),now.getMonth(),1);drawCalendar()});
document.getElementById("calendar-today").title="Kliknij, aby wrócić do dzisiejszej daty";
document.getElementById("calendar-today").style.cursor="pointer";
const update=()=>{now=new Date();document.getElementById("system-clock").textContent=new Intl.DateTimeFormat(locale,{hour:"2-digit",minute:"2-digit"}).format(now);document.getElementById("system-date").textContent=new Intl.DateTimeFormat(locale,{day:"2-digit",month:"2-digit",year:"numeric"}).format(now);drawCalendar()};
update();setInterval(update,15000);
};