function createInputAndButton(x, y, baseNum, valueOnTheChart) {
    // Створення текстового поля вводу і кнопок 

    var input = document.createElement("input");
    // Конфігурація властивостей текстового поля вводу
    input.type = "text";
    input.id = "myInput";
    input.name = "myInput";
    input.style.position = "absolute";
    input.style.top = y + "px";
    input.style.left = x + "px";
    input.value = "";
    document.body.appendChild(input);

    input.addEventListener("input", function (event) {
        // Обробник події для текстового поля вводу, який оновлює значення змінної "value" при зміні вмісту поля
        value = event.target.value;
    });

    var connection = new signalR.HubConnectionBuilder()
        .withUrl("/randomnumberhub")
        .build();

    connection.on("ReceiveNumber", function (number) {
        // Обробник події для отримання числа з сигналу "ReceiveNumber" і його встановлення в текстове поле вводу
        input.value = number;

        // Відправлення асинхронного запиту POST до "/Indicator/SavingValues" для збереження числа в базі даних
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
            // Оновлення графіку, якщо він існує
            chart.data.labels.push("");
            chart.data.datasets[0].data.push(number);
            chart.update();
        }
    });

    // Запуск підключення до сигналу "randomnumberhub"
    connection.start()
        .then(function () {
            // Виклик методу "OnConnectedAsync" на сервері і передача значення "baseNum"
            connection.invoke("OnConnectedAsync", baseNum)
                .catch(function (err) {
                    console.error(err.toString());
                });
        })
        .catch(function (err) {
            console.error(err.toString());
        });

    // Створення кнопки "Delete" за допомогою JavaScript
    var deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.style.position = "absolute";
    deleteButton.style.top = (y + 30) + "px";
    deleteButton.style.left = (x + 120) + "px";
    deleteButton.type = "button";
    document.body.appendChild(deleteButton);

    deleteButton.addEventListener("click", function () {
        // Обробник події для кнопки "Delete", який видаляє елементи (поля вводу, кнопки, графік) і виконує відповідний POST-запит до сервера для видалення відповідного запису з бази даних
        $.ajax({
            url: "/Indicator/GetIndicators",
            type: "GET",
            success: function (data) {
                // Отримання списку індикаторів з сервера і перебір їх для знаходження відповідного індикатора за координатами (x, y)
                data.forEach(function (indicator) {
                    if (indicator.x === x && indicator.y === y) {
                        // Відправлення POST-запиту до "/Indicator/Delete" для видалення запису з бази даних за ідентифікатором "id"
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

        // Видалення елементів зі сторінки
        input.remove();
        deleteButton.remove();
        showGraphButton.remove();
        changeBaseNumButton.remove();

        if (chart) {
            // Знищення графіку, якщо він існує
            chart.destroy();
        }
    });

    // Створення кнопки "Show graph" за допомогою JavaScript
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
        // Обробник події для кнопки "Show graph", який створює або приховує графік на сторінці
        if (chartContainer) {
            // Приховування графіку, якщо він вже відображений
            chartContainer.remove();
            chartContainer = null;
            showGraphButton.innerText = "ShowGraph";
            showGraph = true;
        } else {
            // Створення графіку, якщо він ще не відображений
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

            // Створення графіку типу "line" за допомогою бібліотеки Chart.js
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

    // Створення кнопки "Change base number" за допомогою JavaScript
    var changeBaseNumButton = document.createElement("button");
    changeBaseNumButton.innerText = "Change base number";
    changeBaseNumButton.style.position = "absolute";
    changeBaseNumButton.style.top = (y + 70) + "px";
    changeBaseNumButton.style.left = x + "px";
    changeBaseNumButton.type = "button";
    document.body.appendChild(changeBaseNumButton);

    changeBaseNumButton.addEventListener("click", function () {
        // Обробник події для кнопки "Change base number", який дозволяє змінити базове число і відправляє відповідний POST-запит до сервера для оновлення в базі даних
        var newBaseNum = prompt("Enter new number: ");
        baseNum = newBaseNum;

        if (newBaseNum !== null) {
            // Відправлення POST-запиту до "/Indicator/EditInput" для оновлення значення базового числа в базі даних за координатами (x, y)
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
    // При завантаженні сторінки виконується асинхронний запит POST до "/Indicator/GetIndicators"
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

// Додавання обробника подій для кліку на сторінці, який створює новий індикатор при кліку на порожній простір сторінки
document.addEventListener("click", function (event) {
    if (event.target.tagName !== "INPUT" && event.target.tagName !== "BUTTON") {

        var x = event.clientX;
        var y = event.clientY;
        var baseNum = prompt("Enter number: ");
        var valueOnTheChart = prompt("Enter values: ");

          // Створення нового індикатора за вказаними координатами (x, y), базовим числом (baseNum) і значеннями на графіку (valueOnTheChart)
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

// Функція зміни фонового зображення
function changeBackground() {
    var newId = document.getElementById("bgNumber").value;
    selectedId = parseInt(newId);
    var img = document.querySelector('img');
    img.src = '@Url.Action("GetBackgroundImage", "Home")/' + selectedId;
}