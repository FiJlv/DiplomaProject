function createInputAndButton(x, y, baseNum) {
    var input = document.createElement("input");
    input.type = "text";
    input.id = "myInput";
    input.name = "myInput";
    input.style.position = "absolute";
    input.style.top = y + "px";
    input.style.left = x + "px";
    input.value = "";
    document.body.appendChild(input);

    var deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.style.position = "absolute";
    deleteButton.style.top = (y + 30) + "px";
    deleteButton.style.left = (x + 120) + "px";
    deleteButton.type = "button";
    document.body.appendChild(deleteButton);

    var showGraphButton = document.createElement("button");
    showGraphButton.innerText = "ShowGraph";
    showGraphButton.style.position = "absolute";
    showGraphButton.style.top = (y + 30) + "px";
    showGraphButton.style.left = x + "px";
    showGraphButton.type = "button";
    document.body.appendChild(showGraphButton);

    var chart; 

    input.addEventListener("input", function (event) {
        value = event.target.value;
    });

    var connection = new signalR.HubConnectionBuilder()
        .withUrl("/randomnumberhub") 
        .build();

    connection.on("ReceiveNumber", function (number) {
        input.value = number; 

        $.ajax({
            url: "/Indicator/FindInput",
            type: "POST",
            data: {
                x: x,
                y: y,
                value: number
            }
        });

        if (chart) {
            chart.data.labels.push("");
            chart.data.datasets[0].data.push(number);
            chart.update();
        }
    });

    connection.start()
        .then(function () {
           
            connection.invoke("OnConnectedAsync", baseNum)
                .catch(function (err) {
                    console.error(err.toString());
                });
        })
        .catch(function (err) {
            console.error(err.toString());
        });

    deleteButton.addEventListener("click", function () {
        $.ajax({
            url: "/Indicator/GetIndicators",
            type: "GET",
            success: function (data) {
                data.forEach(function (indicator) {
                    if (indicator.x === x && indicator.y === y) {
                        $.ajax({
                            url: '/Indicator/Delete',
                            type: 'POST',
                            data: {
                                id: indicator.id
                            }
                        });
                    }
                });
            }
        });

        input.remove();
        deleteButton.remove();
        showGraphButton.remove();
        if (chart) {
            chart.destroy();
        }
    });

    var chartContainer = null; 
    var showGraph = true; 

    showGraphButton.addEventListener("click", function () {
        if (chartContainer) {
            
            chartContainer.remove();
            chartContainer = null;
            showGraphButton.innerText = "ShowGraph";
            showGraph = true;
        } else {
          
            chartContainer = document.createElement("div");
            chartContainer.style.width = "400px"; 
            chartContainer.style.height = "200px"; 
            chartContainer.style.position = "absolute";
            chartContainer.style.top = (y + 50) + "px";
            chartContainer.style.left = x + "px";
            document.body.appendChild(chartContainer);

            var canvas = document.createElement("canvas");
            canvas.id = "myChart";
            chartContainer.appendChild(canvas);

            var ctx = canvas.getContext("2d");

            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: [],
                    datasets: [{
                        label: "Values",
                        data: [],
                        borderColor: "blue",
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            display: false
                        }
                    }
                }
            });

            showGraphButton.innerText = "HideGraph";
            showGraph = false;
        }
    });
}

$(document).ready(function () {
    $.ajax({
        url: "/Indicator/GetIndicators",
        type: "POST",
        success: function (data) {
            data.forEach(function (indicator) {
                let baseNum = indicator.baseNum;
                let baseNumStr = baseNum.toString();
                createInputAndButton(indicator.x, indicator.y, baseNumStr);
            });
        }
    });
});

document.addEventListener("click", function (event) {
    if (event.target.tagName !== "INPUT" && event.target.tagName !== "BUTTON") {

        var x = event.clientX;
        var y = event.clientY;
        var baseNum = prompt("Enter number: ");

        createInputAndButton(x, y, baseNum); 

        $.ajax({
            url: "/Indicator/SaveInput",
            type: "POST",
            data: {
                x: x,
                y: y,
                baseNum: baseNum
            }
        });

    }
});

// Функція зміни фонового зображення
function changeBackground() {
    var newId = document.getElementById("bgNumber").value;
    selectedId = parseInt(newId);
    var img = document.querySelector('img');
    img.src = '@Url.Action("GetBackgroundImage", "Home")/' + selectedId;
}