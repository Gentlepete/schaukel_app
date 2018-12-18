let movedOne = false;
let movedTwo = false;
let chartOneValue = 0;
let chartTwoValue = 0;
let equalCounter = 0;

function showCam() {
    $("canvas").addClass("hide");
    $("video").addClass("show");
}

function hideCam() {
    $("canvas").removeClass("hide");
    $("video").removeClass("show");
    movedOne = false;
    movedTwo = false;
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
            //console.log("Somethin went wrong");
        });
    }

    let ctx = document.getElementById('frequency-chart');
    let myLineChart = new Chart(ctx, {
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
        
    let socket = io();

    socket.on('sendData', function(message) {
        message = Math.round(message / 10) * 10;
        chartOneValue = message;

        if(message > 600 || message < 400) {
            movedOne = true;
        }

        myLineChart.data.labels.push("");
        myLineChart.data.datasets[0].data.push(message);

        myLineChart.update(10);

        if(myLineChart.data.datasets[0].data.length > 38) {
            myLineChart.data.datasets[0].data.shift();
            myLineChart.data.datasets[1].data.shift();
            myLineChart.data.labels.shift();
        }  
    });

    socket.on('sendData2', function(message) {
        message = Math.round(message / 10) * 10;
        chartTwoValue = message;

        if(message > 600 || message < 400) {
            movedTwo = true;
        }

        myLineChart.data.datasets[1].data.push(message);

        myLineChart.update(10);

        if(myLineChart.data.datasets[0].data.length > 38) {
            myLineChart.data.datasets[1].data.shift();
        }
    });

    setInterval(function(){
        if (movedOne || movedTwo) {
            // Check if chart values are smiliar
            var difference = Math.abs(chartOneValue - chartTwoValue); 

            if (difference <= 100) {
                equalCounter++;
            } else {
                equalCounter = 0;
            }
        }
        
        if (equalCounter >= 100) {
            equalCounter = 0;
            showCam();
        }
        
    }, 100);
});