const uri = "/api/Product/";
let items = null;

function GetProductsIntoCarousel() {
    var j, y = "";
    var request = new XMLHttpRequest();
    request.open("GET", uri, false);
    request.onload = function () {
        items = JSON.parse(request.responseText);
        for (j in items) {
            y += "<div class='item'><div class='block-4 text-center'><figure class='block-3-image'><img alt='Image placeholder' class='img-fluid' src=" +
                items[j].image +
                "></figure><div class='block-4-text p-4'><h3><a>" +
                items[j].name + "</a></h3>" + "<p class='text-primary font-weight-bold' Цена>" +
                items[j].price + "₽</p>" +
                //"<button type='button' class='btn btn-sm btn-outline-secondary' onclick='AddProduct(" +
                //items[j].id + ");'>В корзину</button>" +
                "</div></div></div>";
        }
        document.getElementById("DivProductsCarousel").innerHTML = y;
    };
    request.send();
}

document.addEventListener("DOMContentLoaded", function () {
    GetProductsIntoCarousel(); 
    // Обработка кликов по кнопкам
    document.getElementById("loginBtn").addEventListener("click", logIn);
    document.getElementById("logoffBtn").addEventListener("click", logOff);
    getCurrentUser();
});

function logIn() {
    var email, password = "";
    // Считывание данных с формы
    email = document.getElementById("Email").value;
    password = document.getElementById("Password").value;
    var request = new XMLHttpRequest();
    request.open("POST", "/api/Account/Login");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onreadystatechange = function () {
        // Очистка контейнера вывода сообщений
        document.getElementById("msg").innerHTML = "";
        var mydiv = document.getElementById('formError');
        while (mydiv.firstChild) {
            mydiv.removeChild(mydiv.firstChild);
        }
        // Обработка ответа от сервера
        if (request.responseText !== "") {
            var msg = null;
            msg = JSON.parse(request.responseText);
            document.getElementById("msg").innerHTML = msg.message;
            // Вывод сообщений об ошибках
            if (typeof msg.error !== "undefined" && msg.error.length > 0) {
                for (var i = 0; i < msg.error.length; i++) {
                    var ul = document.getElementsByTagName("ul");
                    var li = document.createElement("li");
                    li.appendChild(document.createTextNode(msg.error[i]));
                    ul[0].appendChild(li);
                }
            }
            document.getElementById("Password").value = "";
        }
    };
    // Запрос на сервер
    request.send(JSON.stringify({
        email: email,
        password: password
    }));
}

function logOff() {
    var request = new XMLHttpRequest();
    request.open("POST", "api/account/logoff");
    request.onload = function () {
        var msg = JSON.parse(this.responseText);
        document.getElementById("msg").innerHTML = "";
        var mydiv = document.getElementById('formError');
        while (mydiv.firstChild) {
            mydiv.removeChild(mydiv.firstChild);
        }
        document.getElementById("msg").innerHTML = msg.message;
    };
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send();
}

function getCurrentUser() {
    let request = new XMLHttpRequest();
    request.open("POST", "/api/Account/isAuthenticated", true);
    request.onload = function () {
        let myObj = "";
        myObj = request.responseText !== "" ? JSON.parse(request.responseText) : {};
        document.getElementById("msg").innerHTML = myObj.message;
    };
    request.send();
}

$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
})