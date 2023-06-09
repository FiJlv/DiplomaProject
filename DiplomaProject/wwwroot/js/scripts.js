function createInputAndButton(x, y, baseNum, valueOnTheChart) {
    // ��������� ���������� ���� ����� � ������ 

    var input = document.createElement("input");
    // ������������ ������������ ���������� ���� �����
    input.type = "text";
    input.id = "myInput";
    input.name = "myInput";
    input.style.position = "absolute";
    input.style.top = y + "px";
    input.style.left = x + "px";
    input.value = "";
    document.body.appendChild(input);

    input.addEventListener("input", function (event) {
        // �������� ��䳿 ��� ���������� ���� �����, ���� ������� �������� ����� "value" ��� ��� ����� ����
        value = event.target.value;
    });

    var connection = new signalR.HubConnectionBuilder()
        .withUrl("/randomnumberhub")
        .build();

    connection.on("ReceiveNumber", function (number) {
        // �������� ��䳿 ��� ��������� ����� � ������� "ReceiveNumber" � ���� ������������ � �������� ���� �����
        input.value = number;

        // ³���������� ������������ ������ POST �� "/Indicator/SavingValues" ��� ���������� ����� � ��� �����
        $.ajax({
            url: "/Indicator/SavingValues",
            type: "POST",
            data: {
                x: x,
                y: y,
                value: number
            }
        });

        if (chart) {
            // ��������� �������, ���� �� ����
            chart.data.labels.push("");
            chart.data.datasets[0].data.push(number);
            chart.update();
        }
    });

    // ������ ���������� �� ������� "randomnumberhub"
    connection.start()
        .then(function () {
            // ������ ������ "OnConnectedAsync" �� ������ � �������� �������� "baseNum"
            connection.invoke("OnConnectedAsync", baseNum)
                .catch(function (err) {
                    console.error(err.toString());
                });
        })
        .catch(function (err) {
            console.error(err.toString());
        });

    // ��������� ������ "Delete" �� ��������� JavaScript
    var deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.style.position = "absolute";
    deleteButton.style.top = (y + 30) + "px";
    deleteButton.style.left = (x + 120) + "px";
    deleteButton.type = "button";
    document.body.appendChild(deleteButton);

    deleteButton.addEventListener("click", function () {
        // �������� ��䳿 ��� ������ "Delete", ���� ������� �������� (���� �����, ������, ������) � ������ ��������� POST-����� �� ������� ��� ��������� ���������� ������ � ���� �����
        $.ajax({
            url: "/Indicator/GetIndicators",
            type: "GET",
            success: function (data) {
                // ��������� ������ ���������� � ������� � ������ �� ��� ����������� ���������� ���������� �� ������������ (x, y)
                data.forEach(function (indicator) {
                    if (indicator.x === x && indicator.y === y) {
                        // ³���������� POST-������ �� "/Indicator/Delete" ��� ��������� ������ � ���� ����� �� ��������������� "id"
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

        // ��������� �������� � �������
        input.remove();
        deleteButton.remove();
        showGraphButton.remove();
        changeBaseNumButton.remove();

        if (chart) {
            // �������� �������, ���� �� ����
            chart.destroy();
        }
    });

    // ��������� ������ "Show graph" �� ��������� JavaScript
    var showGraphButton = document.createElement("button");
    showGraphButton.innerText = "Show graph";
    showGraphButton.style.position = "absolute";
    showGraphButton.style.top = (y + 30) + "px";
    showGraphButton.style.left = x + "px";
    showGraphButton.type = "button";
    document.body.appendChild(showGraphButton);

    var chart;

    var chartContainer = null;
    var showGraph = true;

    showGraphButton.addEventListener("click", function () {
        // �������� ��䳿 ��� ������ "Show graph", ���� ������� ��� ������� ������ �� �������
        if (chartContainer) {
            // ������������ �������, ���� �� ��� �����������
            chartContainer.remove();
            chartContainer = null;
            showGraphButton.innerText = "ShowGraph";
            showGraph = true;
        } else {
            // ��������� �������, ���� �� �� �� �����������
            chartContainer = document.createElement("div");
            chartContainer.style.width = "400px";
            chartContainer.style.height = "200px";
            chartContainer.style.position = "absolute";
            chartContainer.style.top = (y + 90) + "px";
            chartContainer.style.left = x + "px";
            document.body.appendChild(chartContainer);

            var canvas = document.createElement("canvas");
            canvas.id = "myChart";
            chartContainer.appendChild(canvas);

            var ctx = canvas.getContext("2d");

            canvas.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
            canvas.style.opacity = "0.9";

            // ��������� ������� ���� "line" �� ��������� �������� Chart.js
            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: [],
                    datasets: [{
                        label: valueOnTheChart,
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

    // ��������� ������ "Change base number" �� ��������� JavaScript
    var changeBaseNumButton = document.createElement("button");
    changeBaseNumButton.innerText = "Change base number";
    changeBaseNumButton.style.position = "absolute";
    changeBaseNumButton.style.top = (y + 70) + "px";
    changeBaseNumButton.style.left = x + "px";
    changeBaseNumButton.type = "button";
    document.body.appendChild(changeBaseNumButton);

    changeBaseNumButton.addEventListener("click", function () {
        // �������� ��䳿 ��� ������ "Change base number", ���� �������� ������ ������ ����� � ��������� ��������� POST-����� �� ������� ��� ��������� � ��� �����
        var newBaseNum = prompt("Enter new number: ");
        baseNum = newBaseNum;

        if (newBaseNum !== null) {
            // ³���������� POST-������ �� "/Indicator/EditInput" ��� ��������� �������� �������� ����� � ��� ����� �� ������������ (x, y)
            $.ajax({
                url: "/Indicator/EditInput",
                type: "POST",
                data: {
                    x: x,
                    y: y,
                    baseNum: newBaseNum
                }
            });
        }
    });
}

$(document).ready(function () {
    // ��� ����������� ������� ���������� ����������� ����� POST �� "/Indicator/GetIndicators"
    $.ajax({
        url: "/Indicator/GetIndicators",
        type: "POST",
        success: function (data) {
            data.forEach(function (indicator) {
                let baseNum = indicator.baseNum;
                let baseNumStr = baseNum.toString();
                createInputAndButton(indicator.x, indicator.y, baseNumStr, indicator.valueOnTheChart);
            });
        }
    });
});

// ��������� ��������� ���� ��� ���� �� �������, ���� ������� ����� ��������� ��� ���� �� ������� ������ �������
document.addEventListener("click", function (event) {
    if (event.target.tagName !== "INPUT" && event.target.tagName !== "BUTTON") {

        var x = event.clientX;
        var y = event.clientY;
        var baseNum = prompt("Enter number: ");
        var valueOnTheChart = prompt("Enter values: ");

          // ��������� ������ ���������� �� ��������� ������������ (x, y), ������� ������ (baseNum) � ���������� �� ������� (valueOnTheChart)
        createInputAndButton(x, y, baseNum, valueOnTheChart); 

        $.ajax({
            url: "/Indicator/SaveInput",
            type: "POST",
            data: {
                x: x,
                y: y,
                baseNum: baseNum,
                valueOnTheChart: valueOnTheChart 
            }
        });

    }
});

// ������� ���� �������� ����������
function changeBackground() {
    var newId = document.getElementById("bgNumber").value;
    selectedId = parseInt(newId);
    var img = document.querySelector('img');
    img.src = '@Url.Action("GetBackgroundImage", "Home")/' + selectedId;
}