const uri = "/api/Product/";
const uri1 = "/api/CartLine/";
const uri2 = "/api/Cart/";
let products = null;
let carts = null;
let role = null;
var cart = 0;

document.addEventListener("DOMContentLoaded", function () {
    GetProducts();
    // Обработка кликов по кнопкам
    document.getElementById("loginBtn").addEventListener("click", logIn);
    document.getElementById("logoffBtn").addEventListener("click", logOff);
    getCurrentUser();
});

function getCurrentUser() {
    let request = new XMLHttpRequest();
    request.open("POST", "/api/Account/isAuthenticated", true);
    request.onload = function () {
        let myObj = "";
        myObj = request.responseText !== "" ?
            JSON.parse(request.responseText) : {};
        document.getElementById("msg").innerHTML = myObj.message;
    };
    request.send();
}

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

function isAdmin() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open("POST", "api/account/isAdmin");

        request.onload = function () {
            var response = JSON.parse(this.responseText);
            resolve(response);
        };

        request.onerror = function () {
            reject(new Error("Network Error"));
        };

        request.send();
    });
}

function GetProducts() {
    this.isAdmin()
        .then(
            response => {
                Role = response.message;

                var i, x = "";
                var request = new XMLHttpRequest();
                request.open("GET", uri, false);
                request.onload = function () {
                    products = JSON.parse(request.responseText);
                    if (typeof products !== "undefined") {
                        if (products.length > 0) {
                            if (products) {
                                for (i in products) {
                                    x += "<div class='col-sm-6 col-lg-4 mb-4' data-aos='fade-up'><div class='block-4 text-center border'><figure class='block-3-image'><a><img alt='Image placeholder' class='img-fluid' src=" +
                                        products[i].image +
                                        "></a></figure><div class='block-4-text p-4'><h3><a>" +
                                        products[i].name +
                                        "</a></h3>" + "<p class='text-primary font-weight-bold' Цена>" +
                                        products[i].price + "₽</p>";

                                        if (Role == "admin") {
                                            x += '<button class="btn btn-primary btn-sm icon icon-edit" type="button" onclick="editProduct(' + products[i].id + ')"></button>' +
                                                '<button class="btn btn-primary btn-sm icon icon-remove" type="button" onclick="deleteProduct(' + products[i].id + ')"></button>'
                                        }
                                        x += "<button type='button' class='btn btn-sm btn-outline-secondary' onclick='add(" + products[i].id + ',' + products[i].price + ");'>В корзину</button>" +
                                        "</div>" +
                                        "</div>" +
                                        "</div>";
                                }
                            }
                        }
                        items = products;
                        let createProductsHTML = "";
                        if (Role == "admin") {
                            createProductsHTML +=                  
                                '<div class="border p-4 rounded mb-4">' +
                                '<h3 class="mb-3 h6 text-uppercase text-black d-block">Админ панель</h3>' +

                                '<div class="form-group row">' +
                                '<div class="col-md-12">' +
                                '<label for="createTitleDiv" class="text-black">Название<span class="text-danger"></span></label>' +
                                '<input type="hidden" id="edit-id">' +
                                '<input type="text" class="form-control" id="createTitleDiv">' +
                                '</div>' +
                                '</div>' +

                                '<div class="form-group row">' +
                                '<div class="col-md-12">' +
                                '<label for="createPriceDiv" class="text-black">Цена<span class="text-danger"></span></label>' +
                                '<input type="text" class="form-control" id="createPriceDiv">' +
                                '</div>' +
                                '</div>' +

                                '<div class="form-group row">' +
                                '<div class="col-md-12">' +
                                '<label for="createImageDiv" class="text-black">Изображение<span class="text-danger"></span></label>' +
                                '<input type="text" class="form-control" id="createImageDiv">' +
                                '</div>' +
                                '</div>' +

                                '<div class="form-group row">' +
                                '<div class="col-lg-12">' +
                                '<button class="btn btn-primary btn-lg btn-block icon icon-save" onclick="updateProduct(); return false;"></button>' + //сохранить
                                '<button class="btn btn-primary btn-lg btn-block icon icon-add" onclick="createProduct(); return false;"></button>' + //добавить
                                '</div>' +  
                                '</div>' +

                                '</div>' +
                                '</div>';
                        }
                        document.getElementById("DivProducts").innerHTML = x;
                        document.querySelector("#createNewProduct").innerHTML = createProductsHTML;
                        }
                    };
                    request.send();
                    GetOrder();
                });
}

function createProduct() {
    let titleText = "";
    titleText = document.querySelector("#createTitleDiv").value;
    let priceText = 0;
    priceText = document.querySelector("#createPriceDiv").value;
    let imageText = "";
    imageText = document.querySelector("#createImageDiv").value;

    var request = new XMLHttpRequest();
    request.open("POST", uri);
    request.onload = function () {
        // Обработка кода ответа
        var msg = "";
        if (request.status === 401) {
            msg = "У вас не хватает прав для создания";
        } else if (request.status === 201) {
            msg = "Запись добавлена";
            GetProducts();
        } else {
            msg = "Неизвестная ошибка";
        }
        document.querySelector("#actionMsg").innerHTML = msg;
        document.querySelector("#createTitleDiv").value = "";
        document.querySelector("#createPriceDiv").value = 0;
        document.querySelector("#createImageDiv").value = "";
    };
    request.setRequestHeader("Accepts", "application/json;charset=UTF-8");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ name: titleText, price: priceText, image: imageText }));
}

function editProduct(id) {
    if (items) {
        let i;
        for (i in items) {
            if (id === items[i].id) {
                document.querySelector("#edit-id").value = items[i].id;
                document.querySelector("#createTitleDiv").value = items[i].name;
                document.querySelector("#createPriceDiv").value = items[i].price;
                document.querySelector("#createImageDiv").value = items[i].image;
            }
        }
    }
}

function updateProduct() {
    $.ajax({
        url: "api/product",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: document.querySelector("#edit-id").value,
            name: document.querySelector("#createTitleDiv").value,
            price: document.querySelector("#createPriceDiv").value,
            image: document.querySelector("#createImageDiv").value
        }),
        success: function () {
            GetProducts();
        }
    })
}

function deleteProduct(id) {
    let request = new XMLHttpRequest();
    request.open("DELETE", uri + id, false);
    request.onload = function () {
        GetProducts();
    };
    request.send();
}

function add(id, sum) {
    try {
        var CartLine = {
            'productId': id,
            'cartId': cart,
            'quantity': 1,
            'price': sum
        }
        var request = new XMLHttpRequest();
        request.open("POST", uri1);
        request.onload = function () {
            // Обработка кода ответа
            var msg = "";//сообщение
            if (request.status === 200) {
                msg = "Не добавлено";
            } else if (request.status === 201) {
                msg = "Товар добавлен в корзину";
                uri3 = uri2 + cart;//получение текущего заказа
                var request1 = new XMLHttpRequest();
                request1.open("GET", uri3, false);
                var item;///Получение данных о заказе
                request1.onload = function () {
                    item = JSON.parse(request1.responseText);
                    item.sumOrder += sum; //к сумме текущего заказа прибавляется стоимость книги
                    ///Изменение данных о заказе -- отправка изменений в БД
                    var request2 = new XMLHttpRequest();
                    request2.open("PUT", uri3);
                    request2.onload = function () {
                    };
                    request2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    request2.send(JSON.stringify(item));
                };
                request1.send();

            } else if (request.status === 401) {
                msg = "Для оформления заказа Вам необходимо авторизоваться."
            } else {
                msg = "Неизвестная ошибка";
            }
            document.querySelector("#actionMsg").innerHTML = msg;//вывод сообщения
        };
        request.setRequestHeader("Accepts", "application/json;charset=UTF-8");
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(JSON.stringify(CartLine));//добавление строки заказа
    } catch (e) { 
        alert("Хьюстон, у нас проблема"); }
}

function GetOrder() { //получение id текущего заказа и его отображение
    try {
        getIdUser();
        var request2 = new XMLHttpRequest();
        request2.open("GET", "/api/cart/");
        carts = null;
        request2.onload = function () {
            if (request2.status === 200) { //если мы получили список заказов
                carts = JSON.parse(request2.responseText);

                for (j in carts) {//в цикле ищем заказ пользователя, который является активным
                    if (carts[j].active === 1) {
                        cart = carts[j].cartId;
                    }
                }          //если список заказов получить не удалось
            } else if (request2.status !== 204) {
                alert("Возникла неизвестная ошибка! Статус ошибки: " + request2.status);
            }
        };
        request2.send();

    } catch (e) { alert("Хьюстон, у нас проблема"); }
}

var myObj = "";
function getIdUser() {
    try {
        let request = new XMLHttpRequest();
        request.open("GET", "/api/Account/WhoisAuthenticated", true);
        request.onload = function () {
            if (request.status === 200) {
                myObj = JSON.parse(request.responseText);
            }
        };
        request.send();
    } catch (e) { alert("Хьюстон, у нас проблема"); }
}





