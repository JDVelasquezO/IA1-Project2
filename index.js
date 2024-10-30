let csvLoaded = {};
let xTrainGlobal = [];
let yTrainGlobal = [];

document.getElementById("predictBtn").addEventListener("click", function() {
    let [ xTrain, yTrain ] = arrayCsv(csvLoaded);
    let linear = new LinearRegression();
    linear.fit(xTrain, yTrain);
    let yPredict = linear.predict(xTrain);
    document.getElementById("info").innerHTML = `
        <table id="displayTable" class="table">
            <tr>
                <th>X Base</th>
                <th>Y Predicted</th>
                <th>Error %</th>
            </tr>
        </table>
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
});

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
    }

    console.log(xTrainGlobal);
    console.log(yTrainGlobal);
    return [xTrainGlobal, yTrainGlobal];
}
