function generateLabels(length) {

    var labels = [];
    for (var i = 1; i <= length; i++) {
        labels.push(i + "s");
    }
    return labels;
}

function createInputAndButton(x, y, values) {

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

    var button = document.createElement("button");
    button.innerText = "Show Graph";
    button.style.position = "absolute";
    button.style.top = (y + 30) + "px";
    button.style.left = x + "px";
    button.type = "button";
    document.body.appendChild(button);
    input.focus();

    var valuesArr = values.split(",").map(function (num) {
        return parseInt(num.trim(), 10);
    });

    button.addEventListener("click", function () {
        var canvas = document.querySelector("canvas");
        if (canvas)
        {
            canvas.remove();
            button.innerText = "Show Graph";
        }
        else
        {
            canvas = document.createElement("canvas");
            canvas.width = 300;
            canvas.height = 200;
            canvas.style.position = "absolute";
            canvas.style.top = (y + 45) + "px";
            canvas.style.left = x + "px";

            document.body.appendChild(canvas);
            button.innerText = "Hide Graph";

            var data = {
                labels: generateLabels(valuesArr.length),
                datasets: [{
                    label: "Temperature",
                    backgroundColor: "rgba(153, 102, 255, 0.1)",
                    borderColor: "rgba(153, 102, 255, 0.5)",
                    borderWidth: 1,
                    data: []
                }]
            };

            var chart = new Chart(canvas, {
                type: "line",
                data: data,
                options: {
                    responsive: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }

        var currentIndex = 0;
        var intervalId = setInterval(function () {
            if (currentIndex < valuesArr.length) {
                input.value = valuesArr[currentIndex];
                chart.data.datasets[0].data.push(valuesArr[currentIndex]);
                chart.update();
                currentIndex++;
            } else {
                clearInterval(intervalId);
            }
        }, 2000);
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
        button.remove();
        deleteButton.remove();

    });
}

$(document).ready(function () {
    $.ajax({
        url: "/Indicator/GetIndicators",
        type: "GET",
        success: function (data) {
            data.forEach(function (indicator) {
                createInputAndButton(indicator.x, indicator.y, indicator.temperatureValues);
            });
        }
    });
});

document.addEventListener("click", function (event) {
    if (event.target.tagName !== "INPUT" && event.target.tagName !== "BUTTON") {

        var x = event.clientX;
        var y = event.clientY;

        $.ajax({

            url: "/Generator/GenerateValues",
            type: "GET",
            success: function (values) {

                createInputAndButton(x, y, values);

                $.ajax({
                    url: "/Indicator/SaveInput",
                    type: "POST",
                    data: {
                        x: x,
                        y: y,
                        temperatureValues: values
                    }
                });
            }
        });
    }
});

function changeBackground() {
    var newId = document.getElementById("bgNumber").value;
    selectedId = parseInt(newId);
    var img = document.querySelector('img');
    img.src = '@Url.Action("GetBackgroundImage", "Home")/' + selectedId;
}