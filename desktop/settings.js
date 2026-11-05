(function(){
const config=JSON.parse(localStorage.getItem("orionos.configuration.v1")||"null");
const install=JSON.parse(localStorage.getItem("orionos.installation.v1")||"null");
if(!config){location.replace("configuration/");return}
if(!install?.complete){location.replace("install.html");return}
document.documentElement.lang=config.language||"pl";
window.ORION_CONFIG=config;
const accents={violet:["#8795ff","#bd8bff"],blue:["#438bff","#77b5ff"],cyan:["#28b8c8","#73e0df"],sky:["#38a9e8","#8bd5ff"],indigo:["#5865dc","#9a8cff"],purple:["#9b65e8","#d0a0ff"],magenta:["#d64ab7","#f18acb"],pink:["#ee72aa","#ffb1ce"],red:["#e34e61","#ff8c91"],coral:["#ef7864","#ffb09a"],orange:["#ef923d","#ffc078"],amber:["#d6a326","#ffe080"],yellow:["#c3ad2e","#f4e879"],lime:["#8abf38","#c4e879"],green:["#3aa878","#8bd6a9"],emerald:["#20a887","#76ddc2"],teal:["#269f9b","#7ad5ca"],slate:["#8292a8","#b8c5d6"]};
const pair=accents[config.accent]||accents.violet;
document.documentElement.style.setProperty("--accent",pair[0]);document.documentElement.style.setProperty("--accent2",pair[1]);
document.body.dataset.theme=config.appearance==="light"?"light":"dark";
})();