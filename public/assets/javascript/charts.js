
// Example Line Chart

function getResponseData(response) {
    return function chartTest(response) {
        // Label array to 
        let labels = [];
        for(var i = 0; i < response.length; i++) {
            labels.push("Driver " + response[i] + 1);
        }

        let costData = [];
        for(var i = 0; i < response.length; i++) {
            costData.push(response[i].estimated_cost_cents_max);
        }

        const lineChart = document.getElementById('line-chart').getContext('2d');
        const textLineChart = new Chart(lineChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Placeholder Data Set",
                    fill: false,
                    lineTenstion: 0,
                    borderColor: 'rgb(255, 255, 255)',
                    data: costData,
                },
                // {
                //     label: "2nd Data Set",
                //     fill: false,
                //     backgroundColor: 'rgb(0, 255, 0)',
                //     borderColor: 'rgb(0, 0, 255)',
                //     data: [0, 5, 25, 25, 20, 30, 35],
                // }       
                ]}
        });
    }
}



// Example Doughnut Chart

const doughnutChart = document.getElementById("dough-chart");
const textDoughnutChart = new Chart(doughnutChart, {
    type: 'doughnut',
    data: {
        datasets: [{
            label: "red",
            fill: true,
            backgroundColor: "rgb(250, 0, 0)",
            data: [10, 25, 35]
        }],
    
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Bananas',
            'Yellow',
            'Blue'
        ]
    },
});