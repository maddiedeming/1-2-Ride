
// Example Line Chart

const lineChart = document.getElementById('line-chart').getContext('2d');
const textLineChart = new Chart(lineChart, {
    type: 'line',
    data: {
        labels: ["Mon", "Tues", "Wed", "Thurs", "Frid", "Sat", "Sun"],
        datasets: [{
            label: "Placeholder Data Set",
            backgroundColor: 'rgb(255, 255, 255)',
            borderColor: 'rgb(255, 255, 255)',
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    }
});



// Example Doughnut Chart

const doughnutChart = document.getElementById("dough-chart");
const textDoughnutChart = new Chart(doughnutChart, {
    type: 'doughnut',
    data: data = {
        datasets: [{

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