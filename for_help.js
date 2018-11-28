var mass = [[],[],[],[],[]];
var mass_way = [];
const fs = require("fs");

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

for (var i = 0; i < mass.length - 1; ++i) {
    mass_way.push([]);
    for (var j = 0; j < mass[i].length; ++j) {
        mass_way[i].push([]);
        for (var k = 0; k < mass[i + 1].length; ++k) {  
            mass_way[i][j].push(0);
        }
    }
} 
fs.writeFileSync("way.json", JSON.stringify(mass_way));
for (var i = 0; i < mass.length - 1; ++i) {
    for (var j = 0; j < mass[i].length; ++j) {
        for (var k = 0; k < mass[i + 1].length; ++k) {
            console.log("000000000000000000000");
            console.log(mass_way[i][j]);
            console.log("88888888888888");
            mass[i + 1][k] = +mass[i + 1][k] + +(mass_way[i][j][k] * mass[i][j]);  
                                  
        }
    }
}  