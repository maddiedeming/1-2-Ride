


function lyftLineChart(response) {
    let labels = [];
    for(var i = 0; i < response.cost_estimates.length; i++) {
        labels.push("Driver " + (i + 1) + " ");
    }
    let costData = [];
    for(var i = 0; i < response.cost_estimates.length; i++) {
        let rideCost = response.cost_estimates[i].estimated_cost_cents_max;
        let convertedCost = rideCost / 100;
        costData.push(convertedCost);
    }
    let lyftCostData = costData.sort();
    let lyftDataSet = {
        label: 'Lyft',
        fill: false,
        lineTenstion: 0,
        backgroundColor: 'rgb(255, 255, 255)',
        borderColor: 'rgb(255, 255, 255)',
        data: lyftCostData
    };
    let lyftData = [lyftDataSet, labels]
    return lyftData;
}  



function uberLineChart(response) {
    let costData = [];
    for(var i = 0; i < response.prices.length; i++) {
        costData.push(response.prices[i].high_estimate);
    }
    let uberCostData = costData.sort();
    let uberDataSet = {
        label: 'Uber',
        fill: false,
        lineTenstion: 0,
        backgroundColor: 'rgb(0, 255, 0)',
        borderColor: 'rgb(0, 255, 0)',
        data: uberCostData
    };
    let uberData = uberDataSet;
    return uberData;
}



// Draws Chart
function LineChartRender(lyftLabels, lyftDataSet, uberData){
    const lineChart = document.getElementById('line-chart').getContext('2d');
    const textLineChart = new Chart(lineChart, {
        type: 'bar',
        data: {
            labels: lyftLabels,
            datasets: [lyftDataSet, uberData] 
            }
    });
}






function lyftDoughnutChart(response) {
    let seatsArray = [];
    let seatsObject = {};
    for(var i = 0; i < response.ride_types.length; i++) {
        var seats = response.ride_types[i].seats;
        seatsArray.push(seats);
    }

    let lyftSeatsCounted = seatsArray.reduce((acc, curVal) => {
        if (curVal in acc) {
            acc[curVal]++;
        } else {
            acc[curVal] = 1;
        }
        return acc;
    }, seatsObject);

    let seatValues = "";
    for(var value in lyftSeatsCounted) {
        seatValues = seatValues + lyftSeatsCounted[value];
    }
    let seatValuesArray = [];
    seatValues.split("").forEach((value) => {
        seatValuesArray.push(parseInt(value));   
    });

    let lyftSeatKeys =[];
    Object.keys(lyftSeatsCounted).forEach((value) => {
        value = "Lyft " + value + " Seats";
        lyftSeatKeys.push(value);
    });

    lyftSeatData = [lyftSeatKeys, seatValuesArray];
    console.log(lyftSeatData);
    return lyftSeatData;
}


function uberDoughnutChart(response) {
    let seatsArray = [];
    let seatsObject = {};
    for(var i = 0; i < response.products.length; i++) {
        var seats = response.products[i].capacity;
        seatsArray.push(seats);
    }

    let uberSeatsCounted = seatsArray.reduce((acc, curVal) => {
        if (curVal in acc) {
            acc[curVal]++;
        } else {
            acc[curVal] = 1;
        }
        return acc;
    }, seatsObject);

    let seatValues = "";
    for(var value in uberSeatsCounted) {
        seatValues = seatValues + uberSeatsCounted[value];
    }
    let seatValuesArray = [];
    seatValues.split("").forEach((value) => {
        seatValuesArray.push(parseInt(value));   
    });

    let uberSeatKeys =[];
    Object.keys(uberSeatsCounted).forEach((value) => {
        value = "Lyft " + value + " Seats";
        uberSeatKeys.push(value);
    });

    lyftSeatData = [uberSeatKeys, seatValuesArray];
    console.log("Uber seat Data: " + uberSeatData);
    return uberSeatData;
}




function doughnutChartRender (lyftSeatsCounted) {
    const doughnutChart = document.getElementById("dough-chart");
    const textDoughnutChart = new Chart(doughnutChart, {
        type: 'doughnut',
        data: {
            datasets: [{
                label: "red",
                fill: true,
                backgroundColor: ["rgb(250, 0, 0)", "rgb(0, 0, 250)"],
                data: [/*insert seat value arrays here*/]
            }],
            
            
            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Bananas',
                'Yellow',
                'Blue'
            ]
        },
    });
}



