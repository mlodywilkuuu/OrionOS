(function(){
const config=JSON.parse(localStorage.getItem("orionos.configuration.v1")||"null");
const install=JSON.parse(localStorage.getItem("orionos.installation.v1")||"null");
if(!config){location.replace("configuration/");return}
if(!install?.complete){location.replace("install.html");return}
const keyboardLabels={"pl":"Polski — programisty","pl-214":"Polski — 214","pl-dvorak":"Polski — Dvorak","pl-qwertz":"Polski — maszynistki","us":"English — US","us-intl":"English — US International","us-dvorak":"English — Dvorak","us-colemak":"English — Colemak","us-workman":"English — Workman","gb":"English — UK","gb-ext":"English — UK Extended","gb-dvorak":"English — UK Dvorak","ie":"Irish","de":"Deutsch","de-nodeadkeys":"Deutsch — no dead keys","de-neo":"Deutsch — Neo","de-qwerty":"Deutsch — QWERTY","fr":"Français — AZERTY","fr-bepo":"Français — Bépo","fr-mac":"Français — Mac","fr-qwerty":"Français — QWERTY","es":"Español","es-latin":"Español — Latinoamérica","es-cat":"Català","it":"Italiano","pt":"Português","br":"Português — Brasil ABNT2","br-abnt":"Português — Brasil ABNT","ru":"Русский","ua":"Українська","by":"Беларуская","cz":"Čeština","sk":"Slovenčina","hu":"Magyar","ro":"Română","bg":"Български","gr":"Ελληνικά","tr":"Türkçe — Q","tr-f":"Türkçe — F","ar":"العربية","ar-azerty":"العربية — AZERTY","he":"עברית","fa":"فارسی","ur":"اردو","in":"हिन्दी — InScript","in-phonetic":"हिन्दी — Phonetic","bn":"বাংলা","ta":"தமிழ்","te":"తెలుగు","th":"ไทย — Kedmanee","th-pattachote":"ไทย — Pattachote","vn":"Tiếng Việt — Telex","vn-vni":"Tiếng Việt — VNI","id":"Indonesia","jp":"日本語 — Kana","jp-romaji":"日本語 — Romaji","jp-jis":"日本語 — JIS","kr":"한국어 — 두벌식","kr-sebeolsik":"한국어 — 세벌식","cn":"中文 — Pinyin","cn-wubi":"中文 — Wubi","tw":"繁體中文 — Zhuyin","hk":"中文 — Cangjie","se":"Svenska","no":"Norsk","dk":"Dansk","fi":"Suomi","is":"Íslenska","nl":"Nederlands","be":"Belgisch","ch-de":"Schweiz — Deutsch","ch-fr":"Schweiz — Français","ca":"Canada — Multilingual","ca-fr":"Canada — Français","ca-eng":"Canada — English","latam":"Latinoamericano","epo":"Esperanto","af":"Afrikaans","al":"Shqip","am":"አማርኛ","az":"Azərbaycan dili","ba":"Башҡортса","br-breton":"Brezhoneg","bs":"Bosanski","fo":"Føroyskt","ge":"ქართული","gh":"Ghana","in-guj":"ગુજરાતી","in-kan":"ಕನ್ನಡ","in-mal":"മലയാളം","in-mar":"मराठी","in-tel":"తెలుగు","in-urd":"اردو","ir":"کوردی","kg":"Кыргызча","kz":"Қазақша","mk":"Македонски","mn":"Монгол","mt":"Malti","np":"नेपाली","pk":"اردو — پاکستان","rs":"Српски","si":"සිංහල","sk-qwerty":"Slovenčina — QWERTY","tg":"Тоҷикӣ","tm":"Türkmençe","uz":"Oʻzbek","za-english":"South African","custom":"Własny układ (konfiguracja systemowa)"};
const localeAliases={"am-ethiopic":"am-ET","zh":"zh-CN","no":"nb-NO","pt":"pt-PT","fil":"fil-PH","ckb":"ckb-IQ","dv":"dv-MV","fa":"fa-IR","he":"he-IL","ar":"ar-SA","ur":"ur-PK"};
let locale=localeAliases[config.language]||config.language||"pl-PL";
try{locale=Intl.DateTimeFormat.supportedLocalesOf([locale]).length?locale:"en-US"}catch(e){locale="en-US"}
window.ORION_CONFIG=config;
window.ORION_SYSTEM={locale,timeZone:config.timezone||"UTC",keyboard:config.keyboard||"pl",keyboardLabel:keyboardLabels[config.keyboard]||config.keyboard||"Polski — programisty",dateFormat:config.dateFormat||"auto",repeatRate:config.repeatRate||"normal",cursorSize:config.cursorSize||"normal"};
window.OrionFormatDate=function(date){
const d=new Date(date),parts=new Intl.DateTimeFormat(locale,{timeZone:window.ORION_SYSTEM.timeZone,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(d);
const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
if(window.ORION_SYSTEM.dateFormat==="dmy")return p.day+"."+p.month+"."+p.year;
if(window.ORION_SYSTEM.dateFormat==="mdy")return p.month+"/"+p.day+"/"+p.year;
if(window.ORION_SYSTEM.dateFormat==="ymd")return p.year+"-"+p.month+"-"+p.day;
return new Intl.DateTimeFormat(locale,{timeZone:window.ORION_SYSTEM.timeZone,dateStyle:"medium"}).format(d);
};
document.documentElement.lang=config.language||"pl";
const accents={violet:["#8795ff","#bd8bff"],blue:["#438bff","#77b5ff"],cyan:["#28b8c8","#73e0df"],sky:["#38a9e8","#8bd5ff"],indigo:["#5865dc","#9a8cff"],purple:["#9b65e8","#d0a0ff"],magenta:["#d64ab7","#f18acb"],pink:["#ee72aa","#ffb1ce"],red:["#e34e61","#ff8c91"],coral:["#ef7864","#ffb09a"],orange:["#ef923d","#ffc078"],amber:["#d6a326","#ffe080"],yellow:["#c3ad2e","#f4e879"],lime:["#8abf38","#c4e879"],green:["#3aa878","#8bd6a9"],emerald:["#20a887","#76ddc2"],teal:["#269f9b","#7ad5ca"],slate:["#8292a8","#b8c5d6"]};
const pair=accents[config.accent]||accents.violet;
document.documentElement.style.setProperty("--accent",pair[0]);document.documentElement.style.setProperty("--accent2",pair[1]);
document.body.dataset.theme=config.appearance==="light"?"light":"dark";
})();