 var electron = require("electron");
var fs = require("fs");
var neurosky = require('node-neurosky');
//var net = require('net');
var	events = require('events');
var	util = require('util');

var mass = [[],[],[],[],[]];
var mass_way;
var words = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z", "%"];
let win;

const {app, BrowserWindow, Menu, ipcMain} = electron;
 
app.on("ready", function(){
    mainWindow = new BrowserWindow({
        width:1300,
        height:700,
        title:"Neuronetworks"
    });
    mainWindow.loadFile("index.html");

    //build 
    const MainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    //insert
    Menu.setApplicationMenu(MainMenu);
});
//something for interface
const mainMenuTemplate = [
{
    label:"Magic",
    submenu:[
        {
            label:"just1"
        },
        {
            label:"just2",
            accelerator:process.platform == "darwin" ?  "Command+Q":
            "Ctrl+Q",
            click() {
                app.quit();
            }
        }
    ]
}
];


// пока что неважно (нейро сеть)
function begun() {
    for (var i = 0; i < 8; ++i) {
        mass[0].push(0);
    }
    for (var i = 0; i < 40; ++i) {
        mass[1].push(0);  
    } 
    for (var i = 0; i < 34; ++i) {
        mass[2].push(0);
    } 
    for (var i = 0; i < 32; ++i) {
        mass[3].push(0);
    }
    for (var i = 0; i < 28; ++i) {
        mass[4].push(0);
    }        
 }
begun();

var client = neurosky.createClient({
	appName:'NodeNeuroSky',
    appKey:'0fc4141b4b45c6npm75cc8d3a765b8d71c5bde9390'
});
client.connect();


function kettik() {
    client.on('data',function(data1){
        console.log(data1);

        mainWindow.webContents.send("get_text", data1.poorSignalLevel);
        
        fs.writeFileSync("inf.json", JSON.stringify(data1));
        var max_all = fs.readFileSync("max_index.json");
        max_all = JSON.parse(max_all);
        
        if (max_all.delta < data1.eegPower.delta) {
            max_all.delta = data1.eegPower.delta;
        }  
        if (max_all.theta < data1.eegPower.theta) {
            max_all.theta = data1.eegPower.theta;
        }
        if (max_all.lowAlpha < data1.eegPower.lowAlpha) {
            max_all.lowAlpha = data1.eegPower.lowAlpha;
        }
        if (max_all.highAlpha < data1.eegPower.highAlpha) {
            max_all.highAlpha = data1.eegPower.highAlpha;
        }
        if (max_all.lowBeta < data1.eegPower.lowBeta) {
            max_all.lowBeta = data1.eegPower.lowBeta;
        }
        if (max_all.highBeta < data1.eegPower.highBeta) {
            max_all.highBeta = data1.eegPower.highBeta
        }
        if (max_all.lowGamma < data1.eegPower.lowGamma) {
            max_all.lowGamma = data1.eegPower.lowGamma;
        }
        if (max_all.highGamma < data1.eegPower.highGamma) {
            max_all.highGamma = data1.eegPower.highGamma;
        }
        fs.writeFileSync("max_index.json", JSON.stringify(max_all));
    
        if (data1.poorSignalLevel < 70) {    
           mass[0][0] = data1.eegPower.delta * 100 / max_all.delta;
            mass[0][1] = data1.eegPower.theta * 100 / max_all.theta;
            mass[0][2] = data1.eegPower.lowAlpha * 100 / max_all.lowAlpha;
            mass[0][3] = data1.eegPower.highAlpha * 100 / max_all.highAlpha;
            mass[0][4] = data1.eegPower.lowBeta * 100 / max_all.lowBeta;
            mass[0][5] = data1.eegPower.highBeta * 100 / max_all.highBeta;
            mass[0][6] = data1.eegPower.lowGamma * 100 / max_all.lowGamma;
            mass[0][7] = data1.eegPower.highGamma * 100 / max_all.highGamma;
            
            // run;
            mass_way = fs.readFileSync("way.json");
            mass_way = JSON.parse(mass_way);
        
            for (var i = 0; i < mass.length - 1; ++i) {
                for (var j = 0; j < mass[i].length; ++j) {
                    for (var k = 0; k < mass[i + 1].length; ++k) {                                        
                        mass[i + 1][k] = +mass[i + 1][k] + +(mass_way[i][j][k] * mass[i][j]);                                                
                    }
                }
            }      
            
            
            //find word
            var maxi = 0;
            for (var i = 1; i < 28; i = i + 1) {
                if (mass[4][i] > mass[4][maxi]) {
                    maxi = i;
                }        
            }
            client.removeAllListeners('data');
            mainWindow.webContents.send("wordic", words[maxi]);
        }
    });
}


function randomizer(percent) {
    mass_way = fs.readFileSync("way.json");
    mass_way = JSON.parse(mass_way);
    percent = percent / 100;
    
    for (var i = 0; i < mass.length - 1; ++i) {
        for (var j = 0; j < mass[i].length; ++j) {
            for (var k = 0; k < mass[i + 1].length; ++k) {
                if (Math.random() < percent) {
                    mass_way[i][j][k]  = (2 * Math.random()) - 1;
                }
            }
        }
    }
    fs.writeFileSync("way.json", JSON.stringify(mass_way));
}

ipcMain.on("button_click1", function(e, click1) {
    if (click1 == 1) {
        randomizer(2);
   }else {
        randomizer(60);
   } 
}); 
ipcMain.on("run_0", function(e) {
    kettik();
 }); 
