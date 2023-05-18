// Функція для генерації міток
function generateLabels(length) {

    var labels = [];
    for (var i = 1; i <= length; i++) {
        labels.push(i + "s");
    }
    return labels;
}

// Функція для створення поля вводу, кнопки для графіка
function createInputAndButton(x, y, values) {

    // Створення вхідного елемента
    var input = document.createElement("input");
    input.type = "text";
    input.id = "myInput";
    input.name = "myInput";
    input.style.position = "absolute";
    input.style.top = y + "px";
    input.style.left = x + "px";
    input.value = "";
    document.body.appendChild(input);

    // Створення кнопки видалення
    var deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.style.position = "absolute";
    deleteButton.style.top = (y + 30) + "px";
    deleteButton.style.left = (x + 120) + "px";
    deleteButton.type = "button";
    document.body.appendChild(deleteButton);

    // Створення кнопки  "Показати графік".
    var button = document.createElement("button");
    button.innerText = "Show Graph";
    button.style.position = "absolute";
    button.style.top = (y + 30) + "px";
    button.style.left = x + "px";
    button.type = "button";
    document.body.appendChild(button);
    input.focus();

    // Перетворення значень у масив чисел
    var valuesArr = values.split(",").map(function (num) {
        return parseInt(num.trim(), 10);
    });

    // Посилання на елемент <canvas>
    var canvas = null; 

    // Посилання на об'єкт Chart
    var chart = null; 

    // Обробник події для кнопки "Показати графік".
    button.addEventListener("click", function () {
        if (button.innerText === "Hide Graph") {
              // Якщо текст  "Приховати графік", то графік уже відображається і його потрібно приховати
            button.innerText = "Show Graph";
            if (chart) {
                chart.destroy(); // Знищуємо графічний об'єкт, щоб звільнити ресурси
            }
            if (canvas) {
                canvas.remove(); // // Видаляємо canvas з DOM
            }
            canvas = null;
            chart = null;
        } else {
             // Якщо текст не "Приховати графік", то графік ще не відображається і його потрібно створити
            if (!canvas) {
                canvas = document.createElement("canvas");
                canvas.width = 300;
                canvas.height = 200;
                canvas.style.position = "absolute";
                canvas.style.top = (y + 45) + "px";
                canvas.style.left = x + "px";
                document.body.appendChild(canvas);
            }
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

            if (chart) {
                chart.destroy(); // Знищуємо попередній графічний об'єкт, якщо він існує
            }

            chart = new Chart(canvas, {
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
        }
    });

    // Обробник події для кнопки "Видалити"
    deleteButton.addEventListener("click", function () {

        // Відправляємо AJAX-запит на сервер для видалення відповідного індикатора
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

        // Видаляємо елементи з DOM
        input.remove();
        button.remove();
        deleteButton.remove();
        chart.destroy();

    });
}

$(document).ready(function () {
    // Відправляємо AJAX-запит на сервер для отримання даних індикаторів
    $.ajax({
        url: "/Indicator/GetIndicators",
        type: "GET",
        success: function (data) {
            data.forEach(function (indicator) {
                // Створюємо поле введення і кнопку для кожного індикатора
                createInputAndButton(indicator.x, indicator.y, indicator.temperatureValues);
            });
        }
    });
});

// Обробник події кліка на документе
document.addEventListener("click", function (event) {
    if (event.target.tagName !== "INPUT" && event.target.tagName !== "BUTTON") {

        // Отримуємо координати кліка
        var x = event.clientX;
        var y = event.clientY;

        // Надсилаємо AJAX-запит на сервер для генерації значень
        $.ajax({

            url: "/Generator/GenerateValues",
            type: "GET",
            success: function (values) {

                // Створюємо поле введення та кнопку для нового індикатора
                createInputAndButton(x, y, values);

                 // Отправляем AJAX-запрос на сервер для сохранения введенных значений индикатора
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

// Функція зміни фонового зображення
function changeBackground() {
    var newId = document.getElementById("bgNumber").value;
    selectedId = parseInt(newId);
    var img = document.querySelector('img');
    img.src = '@Url.Action("GetBackgroundImage", "Home")/' + selectedId;
}