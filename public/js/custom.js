$(document).ready(function(){
    var ctx = document.getElementById('frequency-chart');
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: "",
            datasets: [{
                fill: false,
                label: "",
                borderColor: "#6c227e",
                borderWidth: 10,
                data: []
            }, {
                fill: false,
                label: "",
                borderColor: "#0f0",
                borderWidth: 5,
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
                        beginAtZero: true,
                        max: 1023
                    },
                    gridLines: {
                        display:false
                    }
                }]
            }
        }
    });
        
    var socket = io();

    socket.on('sendData', function(message) {
        message = Math.round(message / 10) * 10;
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
        myLineChart.data.datasets[1].data.push(message);

        myLineChart.update(10);

        if(myLineChart.data.datasets[0].data.length > 38) {
            myLineChart.data.datasets[1].data.shift();
            // myLineChart.data.labels.shift();
        }
    });
});