var neurosky = require("node-neurosky");
var fs = require("fs");
var util = require("util");
var mass = JSON.parse(fs.readFileSync("./ulan_base.json"));
var client = neurosky.createClient({
    appName: "NodeNeuroSky",
    appKey: ""
});
client.connect();
client.on("data", function (data1) {
    console.log(data1);
    if (data1.poorSignalLevel < 70) {
        var max_all = fs.readFileSync("../max_index.json");
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
            max_all.highBeta = data1.eegPower.highBeta;
        }
        if (max_all.lowGamma < data1.eegPower.lowGamma) {
            max_all.lowGamma = data1.eegPower.lowGamma;
        }
        if (max_all.highGamma < data1.eegPower.highGamma) {
            max_all.highGamma = data1.eegPower.highGamma;
        }
        fs.writeFileSync("../max_index.json", JSON.stringify(max_all));
        console.log(data1);
        
        let Main_word = "Z";
        mass[Main_word]["delta"].push(data1.eegPower.delta);
        mass[Main_word]["theta"].push(data1.eegPower.theta);
        mass[Main_word]["lowAlpha"].push(data1.eegPower.lowAlpha);
        mass[Main_word]["highAlpha"].push(data1.eegPower.highAlpha);
        mass[Main_word]["lowBeta"].push(data1.eegPower.lowBeta);
        mass[Main_word]["highBeta"].push(data1.eegPower.highBeta);
        mass[Main_word]["lowGamma"].push(data1.eegPower.lowGamma);
        mass[Main_word]["highGamma"].push(data1.eegPower.highGamma);
        console.log(mass[Main_word]["highGamma"].length);
      if (mass[Main_word]["highGamma"].length % 10 == 0 && mass[Main_word]["highGamma"].length != 0) {
        fs.writeFileSync("./ulan_base.json", JSON.stringify(mass));
        
      }
      
    }
});
