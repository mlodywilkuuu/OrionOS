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
const soundFlyout=$("sound-flyout"),volumeSlider=$("volume-slider"),volumeValue=$("volume-value"),muteButton=$("mute-toggle"),notificationToggle=$("notification-toggle"),notificationCenter=$("notification-center"),notificationList=$("notification-list"),toast=$("orion-toast");
let audioContext=null,masterGain=null,volume=0.7,muted=false,toastTimer=null;
const getAudio=()=>{const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;if(!audioContext){audioContext=new C();masterGain=audioContext.createGain();masterGain.gain.value=volume;masterGain.connect(audioContext.destination)}if(audioContext.state==="suspended")audioContext.resume();return audioContext};
const tone=(frequency=620,duration=.055,shape="sine")=>{if(muted||volume<=0)return;const ctx=getAudio();if(!ctx)return;const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=shape;osc.frequency.setValueAtTime(frequency,ctx.currentTime);gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.18,ctx.currentTime+.008);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);osc.connect(gain);gain.connect(masterGain);osc.start();osc.stop(ctx.currentTime+duration+.015)};
const playNotificationSound=()=>{tone(740,.09);setTimeout(()=>tone(980,.12),95)};
const showToast=(heading,message)=>{toast.innerHTML='<b></b><span></span><button aria-label="Zamknij">×</button>';toast.querySelector("b").textContent=heading;toast.querySelector("span").textContent=message;toast.classList.add("show");toast.querySelector("button").onclick=()=>toast.classList.remove("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),4800)};
const notify=(heading,message)=>{const empty=notificationList.querySelector(".notification-empty");if(empty)empty.remove();const item=document.createElement("article");item.className="notification-item";const h=document.createElement("b"),p=document.createElement("p"),time=document.createElement("small");h.textContent=heading;p.textContent=message;time.textContent=new Intl.DateTimeFormat("pl-PL",{hour:"2-digit",minute:"2-digit"}).format(new Date());item.append(h,p,time);notificationList.prepend(item);showToast(heading,message);if($("notification-sound").checked)playNotificationSound()};
window.OrionNotify=notify;
const closeSound=()=>soundFlyout.classList.remove("open");
const openSound=()=>{closeQuick();closeCalendar();closeMenu();notificationCenter.classList.remove("open");soundFlyout.classList.toggle("open");if(soundFlyout.classList.contains("open")){volumeSlider.value=Math.round(volume*100);volumeValue.textContent=Math.round(volume*100)+"%"}};
quickPanel.querySelector('[data-setting="volume"]').addEventListener("click",openSound);
$("sound-icon").addEventListener("click",e=>{e.stopPropagation();openSound()});
volumeSlider.addEventListener("input",()=>{volume=Number(volumeSlider.value)/100;muted=volume===0;if(masterGain)masterGain.gain.setTargetAtTime(muted?0:volume,audioContext.currentTime,.025);volumeValue.textContent=volumeSlider.value+"%";muteButton.textContent=muted?"×":"◖))";tone(520,.035)});
muteButton.addEventListener("click",()=>{muted=!muted;muteButton.textContent=muted?"×":"◖))";if(masterGain)masterGain.gain.setTargetAtTime(muted?0:volume,audioContext.currentTime,.025);if(!muted)tone(660,.06)});
notificationToggle.addEventListener("click",e=>{e.stopPropagation();closeQuick();closeCalendar();closeMenu();closeSound();const open=notificationCenter.classList.toggle("open");notificationToggle.setAttribute("aria-expanded",String(open))});
$("clear-notifications").addEventListener("click",()=>{notificationList.innerHTML='<div class="notification-empty">Nie masz nowych powiadomień</div>'});
document.addEventListener("keydown",e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.repeat)return;if(e.key.length!==1)return;const target=e.target;if(target&&(/INPUT|TEXTAREA|SELECT/.test(target.tagName)||target.isContentEditable)&&!$("typing-sound").checked)return;if(!$("typing-sound").checked)return;tone(420+Math.random()*180,.025,"triangle")});
document.addEventListener("pointerdown",()=>{getAudio()},{once:true});
notify("OrionOS","Centrum powiadomień jest gotowe. Dźwięk pisania jest włączony.");

const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const setPowerStage=(mode,stage)=>{
powerScreen.dataset.mode=mode;powerScreen.dataset.stage=stage;powerScreen.classList.add("open");
const heading=$("power-title"),description=$("power-description"),actions=powerScreen.querySelector(".power-screen-actions");
const spinner=powerScreen.querySelector(".power-spinner");
if(spinner)spinner.hidden=stage==="off";
if(stage==="shutdown"){heading.textContent="Zamykanie OrionOS";description.textContent="Zamykanie aplikacji i przygotowywanie systemu…";actions.hidden=true}
if(stage==="restart"){heading.textContent="Ponowne uruchamianie";description.textContent="Zapisywanie ustawień i ponowne uruchamianie systemu…";actions.hidden=true}
if(stage==="boot"){heading.textContent="OrionOS";description.textContent="Uruchamianie systemu…";actions.hidden=true}
if(stage==="off"){heading.textContent="OrionOS został wyłączony";description.textContent="System został bezpiecznie zamknięty. Możesz ponownie uruchomić OrionOS.";actions.hidden=false;$("power-cancel").hidden=true;$("power-confirm").textContent="Uruchom OrionOS"}
};
const showPower=mode=>{closeQuick();closeCalendar();closeMenu();closeSound();notificationCenter.classList.remove("open");powerScreen.dataset.mode=mode;powerScreen.classList.add("open");powerScreen.querySelector(".power-screen-actions").hidden=false;$("power-cancel").hidden=false;$("power-cancel").textContent="Anuluj";$("power-confirm").textContent=mode==="shutdown"?"Wyłącz":"Uruchom ponownie";$("power-title").textContent=mode==="shutdown"?"Wyłączanie OrionOS?":"Uruchomić OrionOS ponownie?";$("power-description").textContent=mode==="shutdown"?"Po potwierdzeniu system wyświetli ekran zamykania.":"Po potwierdzeniu system uruchomi się ponownie.";const spinner=powerScreen.querySelector(".power-spinner");if(spinner)spinner.hidden=true;powerScreen.dataset.stage="confirm"};
const bootAndReturn=async()=>{setPowerStage("boot","boot");await wait(1450+Math.floor(Math.random()*850));location.href=new URL("desktop.html",location.href).href};
menu.querySelectorAll("[data-power]").forEach(button=>button.addEventListener("click",()=>showPower(button.dataset.power)));
$("power-cancel").addEventListener("click",()=>{powerScreen.classList.remove("open");$("power-cancel").hidden=false});
$("power-confirm").addEventListener("click",async()=>{
const mode=powerScreen.dataset.mode,stage=powerScreen.dataset.stage;
if(stage==="off"){await bootAndReturn();return}
if(stage!=="confirm")return;
if(mode==="shutdown"){setPowerStage("shutdown","shutdown");await wait(1200+Math.floor(Math.random()*750));setPowerStage("shutdown","off");return}
setPowerStage("restart","restart");await wait(1250+Math.floor(Math.random()*900));await bootAndReturn();
});
document.addEventListener("click",e=>{if(!quickPanel.contains(e.target)&&!quickToggle.contains(e.target))closeQuick();if(!calendarPanel.contains(e.target)&&!calendarToggle.contains(e.target))closeCalendar();if(!menu.contains(e.target)&&!logo.contains(e.target))closeMenu();if(!soundFlyout.contains(e.target)&&!quickPanel.contains(e.target)&&!e.target.closest("#sound-icon"))closeSound();if(!notificationCenter.contains(e.target)&&!notificationToggle.contains(e.target))notificationCenter.classList.remove("open")});
});