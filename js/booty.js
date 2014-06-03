var fs = require('fs');
var path = require('path');
var util = require('util');

var pidFile = path.join("tmp", process.pid + ".pid");

fs.writeFileSync(pidFile, process.pid)
fs.readdir("tmp", function(err, files){
	files.forEach(function(v, k){
		if(/\.pid$/.test(v)){
			var pidToKill = v.replace(".pid", "");
			if(pidToKill == process.pid){
				return;
			}
			try{
				process.kill(pidToKill);
			}catch(ex){
				console.log(ex);
			}
			try{
				fs.unlink(path.join("tmp", v));
			}catch(ex){
				console.log(ex);
			}
		}
	});
});

window.ROOT = process.cwd();
window.SettingsFile = path.join(ROOT, 'settings.json');
window.Settings = {};
if(!fs.existsSync(SettingsFile)){
	alert("Você deve executar\n cd *caminho do projeto*\n nw .")
}else{
	window.Settings = JSON.parse(fs.readFileSync(SettingsFile));
}

process.on('exit', function() {
	fs.unlink(pidFile);
});

var gui = require('nw.gui');
var win = gui.Window.get();

var tray;
var toTray = function() {
	this.hide();
	tray = new gui.Tray({ icon: 'icon.png' });
	tray.on('click', function() {
		win.show();
		this.remove();
		tray = null;
	});
};

//onload = function(){
//	win.maximize();
//}

//win.on('minimize', toTray);
//win.on('close', toTray);

key('ctrl+r', function(){ 
	location.href = "/index.html"
	return false;
});

key('ctrl+q', function(){
	gui.App.quit();
	return false;
});

//document.getElementById("button-that-kills").onclick = function(){
//	gui.App.quit();
//}