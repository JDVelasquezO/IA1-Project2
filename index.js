let csvLoaded = {};
let xTrainGlobal = [];
let yTrainGlobal = [];
let xPredictGlobal = [];
let option = document.getElementById("select");

document.getElementById("predictBtn").addEventListener("click", function() {
    if (parseInt(option.value) === 1) {
        linear();
    } else if (parseInt(option.value) === 2) {
        polynomial();
    }
});

const linear = () => {
    console.log(option.value);
    let [ xTrain, yTrain ] = arrayCsv(csvLoaded);
    let linear = new LinearRegression();
    linear.fit(xTrain, yTrain);
    let yPredict = linear.predict(xTrain);
    document.getElementById("info").innerHTML = `
        <div>
            <div>
                <table id="displayTable" class="table is-bordered">
                    <tr>
                        <th>X Base</th>
                        <th>Y Predicted</th>
                        <th>Error %</th>
                    </tr>
                </table>
            </div>
            <div class="mt-3">
                <h2>Gráfica</h2>
                <div id="curve_chart" style='width: 900px; height: 500px'></div>
            </div>
        </div>
    `;

    let displayTable = document.getElementById("displayTable");
    for (let i = 0; i < xTrain.length; i++) {
        const x = xTrain[i];
        const y = yPredict[i];
        let row = document.createElement("tr");
        let xCol = document.createElement("td");
        xCol.innerHTML = x.toString();
        let yCol = document.createElement("td");
        yCol.innerHTML = y.toString();
        let errCol = document.createElement("td");
        errCol.innerHTML = (Math.abs(parseFloat(yTrain[i]) - parseFloat(yPredict[i])) /
        parseFloat(yTrain[i]) ===
        Infinity
            ? 1.0
            : Math.abs(parseFloat(yTrain[i]) - parseFloat(yPredict[i])) /
            parseFloat(yTrain[i])) * 100.0;
        row.appendChild(xCol);
        row.appendChild(yCol);
        row.appendChild(errCol);
        displayTable.appendChild(row);
    }

    let graphDataSet = [];
    graphDataSet.push(["X", "Y", "Predicted"]);
    for (let i = 0; i < xTrain.length; i++) {
        const x = xTrain[i];
        graphDataSet.push([x.toString(), yTrain[i], yPredict[i]]);
    }

    google.charts.load("current", { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        let data = google.visualization.arrayToDataTable(graphDataSet);

        let options = {
            title: "Linear Regression",
            legend: { position: "bottom" },
        };

        let chart = new google.visualization.LineChart(
            document.getElementById("curve_chart")
        );

        chart.draw(data, options);
    }
}

const polynomial = () => {
    function joinArrays() {
        let a = [];
        if (arguments.length === 10) {
            a.push([arguments[0], arguments[2], arguments[4], arguments[6], arguments[8]]);
            for (let i = 0; i < arguments[1].length; i++) {
                a.push([arguments[1][i], arguments[3][i], arguments[5][i], arguments[7][i], arguments[9][i]]);
            }
        }
        return a;
    }

    let [ xTrain, yTrain, predictedArray ] = arrayCsv(csvLoaded);
    let polynomial = new PolynomialRegression();
    polynomial.fit(xTrain, yTrain, 2);

    let yPredict = polynomial.predict(predictedArray);
    let r2 = polynomial.getError();

    polynomial.fit(xTrain, yTrain, 3);
    let yPredict2 = polynomial.predict(predictedArray);
    let r22 = polynomial.getError();

    polynomial.fit(xTrain, yTrain, 4);
    let yPredict3 = polynomial.predict(predictedArray);
    let r23 = polynomial.getError();

    for (let i = 0; i < predictedArray.length; i++) {
        yPredict[i] = Number(yPredict[i].toFixed(2));
        yPredict2[i] = Number(yPredict2[i].toFixed(2));
        yPredict3[i] = Number(yPredict3[i].toFixed(2));
    }

    document.getElementById("info").innerHTML += 'X Train: [' + xTrain + '] <br/>';
    document.getElementById("info").innerHTML += 'Y Train: [' + yTrain + '] <br/>';
    document.getElementById("info").innerHTML += 'X To Predict: [' + predictedArray + '] <br/>';
    document.getElementById("info").innerHTML += 'Y Prediction Degree 2: [' + yPredict + '] <br/>';
    document.getElementById("info").innerHTML += 'Y Prediction Degree 3: [' + yPredict2 + '] <br/>';
    document.getElementById("info").innerHTML += 'Y Prediction Degree 4: [' + yPredict3 + '] <br/>';
    document.getElementById("info").innerHTML += 'R^2 for Degree 2: ' + Number(r2.toFixed(2)) + '<br/>';
    document.getElementById("info").innerHTML += 'R^2 for Degree 3: ' + Number(r22.toFixed(2)) + '<br/>';
    document.getElementById("info").innerHTML += 'R^2 for Degree 4: ' + Number(r23.toFixed(2)) + '<br/>';
    document.getElementById("info").innerHTML += `
        <div class="mt-3">
            <h2>Gráfica</h2>
            <div id="curve_chart" style='width: 900px; height: 500px'></div>
        </div>
    `;

    let a = joinArrays('x', xTrain, 'Training', yTrain, 'Prediction Degree 2', yPredict, 'Prediction Degree 3', yPredict2, 'Prediction Degree 4', yPredict3);

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        let data = google.visualization.arrayToDataTable(a);
        let options = {
            seriesType: 'scatter',
            series: {
                1: { type: 'line' },
                2: { type: 'line' },
                3: { type: 'line' }
            }
        };
        let chart = new google.visualization.ComboChart(document.getElementById('curve_chart'));
        chart.draw(data, options);
    }
}

const decisionTree = () => {

}

document.getElementById("csvForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const file = document.getElementById("btnCsv").files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        csvLoaded = csvToArr(e.target.result, ",");
    }

    reader.readAsText(file);

    alert("Archivo con datos entrenados y listos para usar");
})

function csvToArr(stringVal, splitter) {
    const [keys, ...rest] = stringVal
        .trim()
        .split("\n")
        .map((item) => item.split(splitter));

    return rest.map((item) => {
        const object = {};
        keys.forEach((key, index) => (object[key] = item.at(index)));
        return object;
    });
}

function arrayCsv(fileCsv) {
    for (let i = 0; i < fileCsv.length; i++) {
        xTrainGlobal[i] = parseFloat(fileCsv[i][Object.keys(fileCsv[i])[0]]);
        yTrainGlobal[i] = parseFloat(fileCsv[i][Object.keys(fileCsv[i])[1]]);
        if (parseFloat(fileCsv[i][Object.keys(fileCsv[i])[2]]) != null) {
            xPredictGlobal[i] = parseFloat(fileCsv[i][Object.keys(fileCsv[i])[2]]);
        }
    }

    console.log(xTrainGlobal);
    console.log(yTrainGlobal);
    console.log(xPredictGlobal);
    return [xTrainGlobal, yTrainGlobal, xPredictGlobal];
}

document.getElementById("resetBtn").addEventListener("click", function () {
    location.reload();
})