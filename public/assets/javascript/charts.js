
// Example Line Chart

const lineChart = document.getElementById('line-chart').getContext('2d');
const textLineChart = new Chart(lineChart, {
    type: 'line',
    data: {
        labels: ["Mon", "Tues", "Wed", "Thurs", "Frid", "Sat", "Sun"],
        datasets: [{
            label: "Placeholder Data Set",
            fill: false,
            lineTenstion: 0,
            borderColor: 'rgb(255, 255, 255)',
            data: [0, 10, 5, 2, 20, 30, 45],
        },
        {
            label: "2nd Data Set",
            fill: false,
            backgroundColor: 'rgb(0, 255, 0)',
            borderColor: 'rgb(0, 0, 255)',
            data: [0, 5, 25, 25, 20, 30, 35],
        }       
        ]}
});



// Example Doughnut Chart

const doughnutChart = document.getElementById("dough-chart");
const textDoughnutChart = new Chart(doughnutChart, {
    type: 'doughnut',
    data: {
        datasets: [{
            label: "red",
            fill: true,
            backgroundColor: "rgb(250, 0, 0)",
            data: [10, 20, 30]
        }],
    
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Bananas',
            'Yellow',
            'Blue'
        ]
    },
});