//Variables
var nbTest = 0;
var canvasInfo;
var audioHashInfo;
var audioSumInfo;
var orderInfo;

//Functions
function hashSha1(toHash){
    var sha1 = CryptoJS.algo.SHA1.create();
    sha1.update(toHash);
    var hash = sha1.finalize();
    return hash.toString(CryptoJS.enc.Hex);
}

function canvasTest(resolve, reject) {
    try {
        var canvas = document.getElementById("canvas");
        canvas.height = 60;
        canvas.width = 400;
        var canvasContext = canvas.getContext("2d");
        canvas.style.display = "inline";
        canvasContext.textBaseline = "alphabetic";
        canvasContext.fillStyle = "#f60";
        canvasContext.fillRect(125, 1, 62, 20);
        canvasContext.fillStyle = "#069";
        canvasContext.font = "11pt no-real-font-123";
        canvasContext.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15);
        canvasContext.fillStyle = "rgba(102, 204, 0, 0.7)";
        canvasContext.font = "18pt Arial";
        canvasContext.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45);
        canvasInfo = hashSha1(canvas.toDataURL());
        resolve();
    } catch (e) {
        reject();
    }
}


function audioTest(resolve, reject) {
    try {
        var context = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);

        // Create oscillator
        var pxi_oscillator = context.createOscillator();
        pxi_oscillator.type = "triangle";
        pxi_oscillator.frequency.value = 1e4;

        // Create and configure compressor
        var pxi_compressor = context.createDynamicsCompressor();
        pxi_compressor.threshold && (pxi_compressor.threshold.value = -50);
        pxi_compressor.knee && (pxi_compressor.knee.value = 40);
        pxi_compressor.ratio && (pxi_compressor.ratio.value = 12);
        pxi_compressor.reduction && (pxi_compressor.reduction.value = -20);
        pxi_compressor.attack && (pxi_compressor.attack.value = 0);
        pxi_compressor.release && (pxi_compressor.release.value = .25);

        // Connect nodes
        pxi_oscillator.connect(pxi_compressor);
        pxi_compressor.connect(context.destination);

        // Start audio processing
        pxi_oscillator.start(0);
        context.startRendering();
        context.oncomplete = function (evnt) {
            var sha1 = CryptoJS.algo.SHA1.create();
            for (var i = 0; i < evnt.renderedBuffer.length; i++) {
                sha1.update(evnt.renderedBuffer.getChannelData(0)[i].toString());
            }
            var hash = sha1.finalize();
            audioHashInfo = hash.toString(CryptoJS.enc.Hex);

            for (var i = 4500; 5e3 > i; i++) {
                audioSumInfo += Math.abs(evnt.renderedBuffer.getChannelData(0)[i]);
            }
            pxi_compressor.disconnect();
            document.getElementById("audioHash").innerHTML = audioHashInfo;
            document.getElementById("audioSum").innerHTML = audioSumInfo;
            resolve();
        }
    } catch (u) {
        reject();
    }
}

function orderTest(resolve, reject) {
    var order = "";
    for(var i in navigator){
        order += i.toString();
    }
    orderInfo = hashSha1(order);
    document.getElementById("order").innerHTML = orderInfo;
    resolve();
}


function run(){
    nbTest++;
    canvasInfo = "";
    audioHashInfo = "";
    audioSumInfo = 0;
    orderInfo = "";

    console.log("Test n°"+nbTest);
    Promise.all([new Promise(canvasTest),new Promise(audioTest),new Promise(orderTest)]).then(function(){
        var table = document.getElementById('table').getElementsByTagName('tbody')[0];
        var newRow   = table.insertRow(table.rows.length);
        var info = [nbTest,canvasInfo,audioHashInfo,audioSumInfo,orderInfo];
        for(var i = 0; i< info.length; i++){
            var newCell  = newRow.insertCell(i);
            var newText  = document.createTextNode(info[i]);
            newCell.appendChild(newText);
        }
    });
}