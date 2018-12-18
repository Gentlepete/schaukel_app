function showCam(video) {
    $("canvas").addClass("hide");
    $("video").addClass("show");
}

function hideCam() {
    $("canvas").removeClass("hide");
    $("video").removeClass("show");
}

$(document).ready(function(){

    // Create Div Elements for Stars and Bokehs
    for (let index = 0; index < 100; index++) {
        $('.star-container').append('<div></div>'); 
        $('.bokeh-container').append('<div></div>');
    }

    //implement WebCam code
    let video = document.getElementById("webcam-video");

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video: true})
        .then(function(stream) {
            video.srcObject = stream;
        })
        .catch(function(error) {
            console.log("Somethin went wrong");
        });

    }


    var ctx = document.getElementById('frequency-chart');
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: "",
            datasets: [{
                fill: false,
                label: "",
                backgroundColor: "transparent",
                borderColor: "#8818A1",
                borderWidth: 2,
                data: []
            }, {
                fill: false,
                label: "",
                backgroundColor: "transparent",
                borderColor: "#F39324",
                borderWidth: 2,
                data: []
            }]
        },
        options: {
            legend: {
                display: false,
            },
            responsive: false,
            elements: {
                point: {
                    radius: 0
                }
            },
            scales: {
                xAxes: [{
                    display: false,
                    gridLines: {
                        display:false
                    }
                }],
            yAxes: [{
                    display: false,
                    ticks: {
                        max: 1200,
                        min: -100
                    },
                    gridLines: {
                        display:false
                    }
                }]
            }
        }
    });
        
    var socket = io();

    let chartOneValue = 0;
    socket.on('sendData', function(message) {
        message = Math.round(message / 10) * 10;
        chartOneValue = message;
        myLineChart.data.labels.push("");
        myLineChart.data.datasets[0].data.push(message);

        myLineChart.update(10);

        if(myLineChart.data.datasets[0].data.length > 38) {
            myLineChart.data.datasets[0].data.shift();
            myLineChart.data.datasets[1].data.shift();
            myLineChart.data.labels.shift();
        }  
    });

    let chartTwoValue = 0;
    socket.on('sendData2', function(message) {
        message = Math.round(message / 10) * 10;
        chartTwoValue = message;
        myLineChart.data.datasets[1].data.push(message);

        myLineChart.update(10);

        if(myLineChart.data.datasets[0].data.length > 38) {
            myLineChart.data.datasets[1].data.shift();
            // myLineChart.data.labels.shift();
        }
    });

    var equalCounter = 0;

    setInterval(function(){
        // Check if chart values are smiliar
        var difference = Math.abs(chartOneValue - chartTwoValue); 

        if (difference <= 100) {
            // console.log(difference);
            equalCounter++;
        } else {
            equalCounter = 0;
        }

        if (equalCounter >= 100) {
            equalCounter = 0;
            showCam(video);
        }
        
    }, 100);
});