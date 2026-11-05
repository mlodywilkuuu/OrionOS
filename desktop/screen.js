window.OrionScreen={
render(root){
const screen=document.createElement("main");screen.className="desktop-screen";screen.id="desktop-screen";
screen.innerHTML='<div id="orion-windows"></div>';
root.appendChild(screen);return screen;
}
};