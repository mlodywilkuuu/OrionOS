window.OrionScreen={
render(root){
const screen=document.createElement("main");screen.className="desktop-screen";screen.id="desktop-screen";
screen.innerHTML='<div class="desktop-icons"><button class="desktop-app" data-window="files"><span class="desktop-glyph">▰</span><span>Pliki</span></button><button class="desktop-app" data-window="settings"><span class="desktop-glyph">⚙</span><span>Ustawienia</span></button><button class="desktop-app" data-window="about"><span class="desktop-glyph">✦</span><span>O OrionOS</span></button></div><div id="orion-windows"></div>';
root.appendChild(screen);return screen;
}
};