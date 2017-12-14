var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

var prevTotal = 0;
var prevIdle = 0;

server.listen(8989, function() {
  console.log("Servidor corriendo en http://localhost:8081");
});

app.use(express.static('public'));

io.on('connection', function(socket) {
  socket.on('solicitud', function(data){
   //======================================================== RAM
    var path='/proc/meminfo';
    var d = fs.readFileSync(path).toString();
	
    var datos = d.split(/\n/g);
	
    var porcentaje_ram_usada = datos[0].split(":")[1].trim().split(" ")[0];
    var porcentaje_ram_libre = datos[1];


    var strRamTotal = datos[0].split(":")[1].trim().split(" ")[0];
    var strRamLibre = datos[2].split(":")[1].trim().split(" ")[0];


    var intRamTotal = parseInt(strRamTotal);
    var intRamLibre = parseInt(strRamLibre);
    var intRamUsada = intRamTotal - intRamLibre;
    var pRamUsada = (intRamUsada / intRamTotal) * 100;

    var outRamTotal = "" + parseFloat(Math.round((intRamTotal / 1024) * 100) / 100).toFixed(2) + " Mb";
    //var outRamTotal = "" + (intRamTotal / 1024) + " Mb";
    var outRamUsada = "" + parseFloat(Math.round((intRamUsada / 1024) * 100) / 100).toFixed(2) + " Mb";
    //var outRamUsada = "" + (intRamUsada / 1024) + " Mb";
    var outPorcentajeUsado = "" + parseFloat(Math.round(pRamUsada * 100) / 100).toFixed(2) + " %";
    

    //======================================================== PROC
    var path2 = '/proc/stat'
    var dCpu = fs.readFileSync(path2).toString();
    var datosCpu = dCpu.split(/\n/g);
    var cpuValores = datosCpu[0].split(" ");

    
    var statUser = parseInt(cpuValores[2]); 
    var statNice = parseInt(cpuValores[3]);
    var statSystem = parseInt(cpuValores[4]);
    var statIdle = parseInt(cpuValores[5]);
    var statIowait = parseInt(cpuValores[6]);
    var statIrq = parseInt(cpuValores[7]);
    var statSoftirq = parseInt(cpuValores[8]);
    var statSteal = parseInt(cpuValores[9]);
    var statGuest = parseInt(cpuValores[10]);
    var statGuestNice = parseInt(cpuValores[11]);


    var idle = statIdle + statIowait;
    var nonIdle = statUser + statNice + statSystem + statIrq + statSoftirq + statSteal;
    var total = idle - nonIdle;

    var totald = total - prevTotal;
    var ideld = idle - prevIdle;

    var cpuPercentage = (totald - ideld)/totald;


    //var outTotalCpuPercentage = ""+prevTotal + "-" + total + "   |   "+prevIdle+"-"+idle;

    prevTotal = total;
    prevIdle = idle;


    var totalCpuTimeSinceBoot = parseInt(cpuValores[2]) + 
                                parseInt(cpuValores[3]) +
                                parseInt(cpuValores[4]) +
                                parseInt(cpuValores[5]) +
                                parseInt(cpuValores[6]) +
                                parseInt(cpuValores[7]) +
                                parseInt(cpuValores[8]) +
                                parseInt(cpuValores[9]);

    var totalCpuIdleTimeSinceBoot = parseInt(cpuValores[5]) +
                                    parseInt(cpuValores[6]);

    var totalCpuUsageTimeSinceBoot = totalCpuTimeSinceBoot - totalCpuIdleTimeSinceBoot;

    var totalCpuPercentage = (totalCpuUsageTimeSinceBoot/totalCpuTimeSinceBoot) * 100;
    
    var outTotalCpuPercentage = "" + (totalCpuPercentage + cpuPercentage) + "%";
    
    //======================================================== ARBOL PROC
    var path3 = '/proc/procinfo'
    var lista_proc = fs.readFileSync(path3).toString();



    socket.emit('respuesta', [{
      "ram_total":outRamTotal,
      "ram_usada":outRamUsada,
      "ram_usada_porcentaje":outPorcentajeUsado,
      "adminproc": outTotalCpuPercentage,
      "proc":lista_proc
    }]);

  });


});