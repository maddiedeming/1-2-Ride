


function lyftLineChart(response) {
    console.log(response);
    var labels = [];
    for(var i = 0; i < response.cost_estimates.length; i++) {
        labels.push("Driver " + (i + 1) + " ");
    }
    console.log("labels: " + labels);
    var costData = [];
    for(var i = 0; i < response.cost_estimates.length; i++) {
        let rideCost = response.cost_estimates[i].estimated_cost_cents_max;
        let convertedCost = rideCost / 100;
        costData.push(convertedCost);
    }
    console.log("Cost Data: " + costData);
    var lyftCostData = costData;
    var lyftDataSet = {
        label: 'Lyft',
        fill: false,
        lineTenstion: 0,
        backgroundColor: 'rgb(255, 255, 255)',
        borderColor: 'rgb(255, 255, 255)',
        data: lyftCostData
    };
    var lyftData = [lyftDataSet, labels]
    return lyftData;
}  



function uberLineChart(response) {
    console.log(response);
    var costData = [];
    for(var i = 0; i < response.prices.length; i++) {
        costData.push(response.prices[i].high_estimate);
    }
    console.log("Cost Data: " + uberCostData);
    var uberCostData = costData;
    var uberDataSet = {
        label: 'Uber',
        fill: false,
        lineTenstion: 0,
        backgroundColor: 'rgb(0, 255, 0)',
        borderColor: 'rgb(0, 255, 0)',
        data: uberCostData
    };
    var uberData = uberDataSet;
    return uberData;
}



// Draws Chart
function LineChartRender(lyftLabels, lyftDataSet, uberData){
    console.log("Labels: " + lyftLabels);
    console.log("DataSet: " + lyftDataSet);
    const lineChart = document.getElementById('line-chart').getContext('2d');
    const textLineChart = new Chart(lineChart, {
        type: 'bar',
        data: {
            labels: lyftLabels,
            datasets: [lyftDataSet, uberData] 
            }
    });
    console.log(textLineChart);
}














// Example Doughnut Chart

// const doughnutChart = document.getElementById("dough-chart");
// const textDoughnutChart = new Chart(doughnutChart, {
//     type: 'doughnut',
//     data: {
//         datasets: [{
//             label: "red",
//             fill: true,
//             backgroundColor: "rgb(250, 0, 0)",
//             data: [10, 25, 35]
//         }],
    
//         // These labels appear in the legend and in the tooltips when hovering different arcs
//         labels: [
//             'Bananas',
//             'Yellow',
//             'Blue'
//         ]
//     },
// });