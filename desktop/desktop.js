document.addEventListener("DOMContentLoaded",()=>{
const root=document.getElementById("orion-desktop");
const screen=window.OrionScreen.render(root);
screen.querySelectorAll(".desktop-icons,.desktop-app,.desktop-glyph,[data-window]").forEach(node=>node.remove());
window.OrionWindows.render(screen.querySelector("#orion-windows"));
window.OrionTaskbar.render(root);
document.querySelectorAll(".window-close").forEach(button=>button.addEventListener("click",()=>button.closest(".app-window").classList.remove("open")));
const $=id=>document.getElementById(id);
const quickToggle=$("quick-toggle"),quickPanel=$("quick-panel"),calendarToggle=$("calendar-toggle"),calendarPanel=$("calendar-panel"),logo=$("orion-logo"),menu=$("orion-menu"),powerScreen=$("power-screen");
const title=$("quick-title"),back=quickPanel.querySelector(".quick-back"),home=quickPanel.querySelector(".quick-home"),sub=$("quick-subview");
const closeQuick=()=>{quickPanel.classList.remove("open");quickToggle.setAttribute("aria-expanded","false");home.hidden=false;sub.hidden=true;back.hidden=true;title.textContent="Szybkie ustawienia"};
const closeCalendar=()=>{calendarPanel.classList.remove("open");calendarToggle.setAttribute("aria-expanded","false")};
const closeMenu=()=>{menu.classList.remove("open");logo.setAttribute("aria-expanded","false")};
quickToggle.addEventListener("click",e=>{e.stopPropagation();closeCalendar();closeMenu();const open=quickPanel.classList.toggle("open");quickToggle.setAttribute("aria-expanded",String(open))});
calendarToggle.addEventListener("click",e=>{e.stopPropagation();closeQuick();closeMenu();const open=calendarPanel.classList.toggle("open");calendarToggle.setAttribute("aria-expanded",String(open))});
logo.addEventListener("click",e=>{e.stopPropagation();closeQuick();closeCalendar();const open=menu.classList.toggle("open");logo.setAttribute("aria-expanded",String(open))});
quickPanel.querySelector(".quick-close").addEventListener("click",closeQuick);
back.addEventListener("click",()=>{home.hidden=false;sub.hidden=true;back.hidden=true;title.textContent="Szybkie ustawienia"});
const showView=kind=>{
home.hidden=true;sub.hidden=false;back.hidden=false;
if(kind==="wifi"){
title.textContent="Wi-Fi";
sub.innerHTML='<div class="device-status"><span>⌁</span><div><b>Wi-Fi</b><small>Informacje o połączeniu</small></div><span class="device-tag">System</span></div><p class="list-caption">Sieci bezprzewodowe</p><div class="native-device-info"><b>Brak dostępu do skanera sieci Wi-Fi</b><p>Przeglądarka nie udostępnia stronach internetowych listy pobliskich sieci ani haseł. Aby pokazać prawdziwe sieci, OrionOS musi działać jako aplikacja systemowa z natywnym modułem Wi-Fi.</p></div>';
return;
}
title.textContent="Bluetooth";
sub.innerHTML='<div class="device-status"><span>ᛒ</span><div><b>Bluetooth</b><small id="bluetooth-status">Gotowy do wyszukiwania urządzeń</small></div></div><button class="scan-devices" id="scan-bluetooth">Szukaj urządzeń Bluetooth</button><div id="bluetooth-results" class="bluetooth-results"><p class="device-note">Kliknij „Szukaj urządzeń”. Przeglądarka poprosi o zgodę i pokaże urządzenia, które można wykryć.</p></div>';
$("scan-bluetooth").addEventListener("click",async()=>{
const button=$("scan-bluetooth"),status=$("bluetooth-status"),results=$("bluetooth-results");
if(!navigator.bluetooth||!navigator.bluetooth.requestDevice){status.textContent="Ta przeglądarka nie obsługuje Web Bluetooth";results.innerHTML='<p class="device-note">Użyj Chrome lub Edge na obsługiwanym urządzeniu i połączenia HTTPS. Wykrywanie zależy od systemu oraz uprawnień.</p>';return}
button.disabled=true;button.textContent="Wyszukiwanie…";status.textContent="Oczekiwanie na wybór urządzenia";
try{const device=await navigator.bluetooth.requestDevice({acceptAllDevices:true,optionalServices:[]});results.innerHTML='<div class="device-row selected"><span>ᛒ</span><span><b></b><small>Urządzenie wykryte przez Bluetooth</small></span></div>';results.querySelector("b").textContent=device.name||"Urządzenie bez nazwy";status.textContent="Wykryto urządzenie"}
catch(error){status.textContent=error.name==="NotFoundError"?"Nie wybrano urządzenia":"Nie udało się wykryć urządzenia";results.innerHTML='<p class="device-note">Wyszukiwanie anulowane lub urządzenie niedostępne. Spróbuj ponownie.</p>'}
finally{button.disabled=false;button.textContent="Szukaj ponownie"}
});
};
quickPanel.querySelectorAll("[data-view]").forEach(tile=>tile.addEventListener("click",()=>showView(tile.dataset.view)));
quickPanel.querySelectorAll("[data-setting]").forEach(tile=>tile.addEventListener("click",()=>{const active=tile.classList.toggle("active");tile.querySelector(".tile-state").textContent=active?"Włączony":"Wyłączony"}));
const showPower=(mode)=>{closeQuick();closeCalendar();closeMenu();powerScreen.dataset.mode=mode;powerScreen.classList.add("open");$("power-title").textContent=mode==="shutdown"?"OrionOS — wyłączanie":"OrionOS — ponowne uruchomienie";$("power-description").textContent=mode==="shutdown"?"Możesz zamknąć ekran systemu. Strona nie może wyłączyć fizycznego komputera.":"System OrionOS zostanie ponownie załadowany."; $("power-confirm").textContent=mode==="shutdown"?"Przejdź do ekranu wyłączenia":"Uruchom ponownie"};
menu.querySelectorAll("[data-power]").forEach(button=>button.addEventListener("click",()=>showPower(button.dataset.power)));
$("power-cancel").addEventListener("click",()=>powerScreen.classList.remove("open"));
$("power-confirm").addEventListener("click",()=>{if(powerScreen.dataset.mode==="restart"){ $("power-description").textContent="Ponowne uruchamianie…";setTimeout(()=>location.reload(),650)}else{$("power-title").textContent="OrionOS jest wyłączony";$("power-description").textContent="To ekran symulujący wyłączenie. Odśwież stronę, aby wrócić do systemu.";$("power-confirm").textContent="Włącz OrionOS";$("power-confirm").onclick=()=>location.reload();$("power-cancel").textContent="Zamknij ekran";$("power-cancel").onclick=()=>powerScreen.classList.remove("open")}});
document.addEventListener("click",e=>{if(!quickPanel.contains(e.target)&&!quickToggle.contains(e.target))closeQuick();if(!calendarPanel.contains(e.target)&&!calendarToggle.contains(e.target))closeCalendar();if(!menu.contains(e.target)&&!logo.contains(e.target))closeMenu()});
});