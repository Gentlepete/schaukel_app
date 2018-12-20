// Chart

var canvas = document.getElementById("waves").getContext("2d");
    
// Apply multiply blend when drawing datasets
var multiply = {
  beforeDatasetsDraw: function(chart, options, el) {
    chart.ctx.globalCompositeOperation = 'multiply';
  },
  afterDatasetsDraw: function(chart, options) {
    chart.ctx.globalCompositeOperation = 'source-over';
  },
};

var config = {
    type: 'line',
    data: {
        labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
        datasets: [
          {
              label: 'This week',
              data: [24, 18, 16, 18, 24, 36, 28],
              backgroundColor: "transparent",
              borderColor: '#8818A1',
              borderWidth: 15,

          },
          {
              label: 'Previous week',
              data: [20, 22, 30, 22, 18, 22, 30],
              backgroundColor: "transparent",
              borderColor: '#F39324',
              borderWidth: 15,
          }
        ]
    },
    options: {
    		elements: { 
        	point: {
          	radius: 0,
          	hitRadius: 5, 
            hoverRadius: 5 
          } 
        },
    		legend: {
        		display: false,
        },
        scales: {
            xAxes: [{
            		display: false,
            }],
            yAxes: [{
            		display: false,
                ticks: {
                	beginAtZero: true,
              	},
            }]
        }
    },
    plugins: [multiply],
};

window.chart = new Chart(canvas, config);

