let items = null;
var x = "";

function showOrder() { //получение id текущего заказа и его отображение
    var request2 = new XMLHttpRequest();
    request2.open("GET", uri2, false);
    carts = null; x = "";
    request2.onload = function () {
        carts = JSON.parse(request2.responseText);
        for (j in carts) {
            if (carts[j].active == 1) {
                cart = carts[j].cartId;
                //x += "<h2> Сумма заказа: " + carts[j].sumOrder + "</h2>";
            }
        }
        loadProducts(); //загружаем продукты, входящие в этот заказ
        document.getElementById("CartDiv").innerHTML = x; //выводим скрипт в элемент CartDiv
    };
    request2.send();
}

function loadProducts() {     
    var i;
    products = null;
    var request = new XMLHttpRequest();
    request.open("GET", uri1, false);
    request.onload = function () {
        products = JSON.parse(request.responseText);
        for (i in products) {
            if (products[i].cartId == cart) {
                loadProduct(products[i].productId, products[i].id);
            }
        }
    };
    request.send();
}

function MakeOrder() {      //Active=0, создать новый текущий заказ для этого пользователя
    var request = new XMLHttpRequest();
    var url = uri2 + order; //получить текущий заказ
    request.open("GET", url, false);
    request.onload = function () {
        if (request.status === 200) {
            var CurOrder = JSON.parse(request.responseText); //получение текущего заказа
            CurOrder.active = 0;
            var d = new Date();
            CurOrder.dateOrder = "" + String(d.getFullYear()) + "-" + String(d.getMonth()).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0');
            var request2 = new XMLHttpRequest();
            request2.open("PUT", url, false);
            request2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            request2.onload = function () {
                var request1 = new XMLHttpRequest();
                request1.open("POST", "/api/Orders/", false);
                request1.setRequestHeader("Accepts", "application/json;charset=UTF-8");
                request1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                request1.onload = function () {
                    GetOrder();
                };
                request1.send(JSON.stringify({

                    dateDelivery: "0001-01-01",
                    dateOrder: "0001-01-01",
                    sumDelivery: 50,
                    sumOrder: 0,
                    active: 1,
                    userId: "1"
                }));

            };
            request2.send(JSON.stringify(CurOrder));
        }
    };
    request.send();
}

function loadProduct(pid, idItem) {     
    var i;
    items = null;
    var request = new XMLHttpRequest();
    request.open("GET", "/api/product", false);
    request.onload = function () {
        items = JSON.parse(request.responseText);
        for (i in items) {
            if (items[i].id == pid) {
                x += "<div class=site-wrap'>";
                x += "<div class='site-section'>";
                x += "<div class='container'>";
                x += "<div class='row mb-5'>";
                x += "<form class='col-md-12'>";
                x += "<div class='site-blocks-table'>";
                x += "<table class='table table-bordered'>";
                x += "<thead>";
                x += "<tr>";
                x += "<th class='product-thumbnail'>Изображение</th>";
                x += "<th class='product-name'>Товар</th>";
                x += "<th class='product-price'>Цена</th>";
                x += "<th class='product-remove'>Убрать</th>";
                x += "</tr>";
                x += "</thead>";
                x += "<tbody>";

                x += "<tr>";
                x += "<td class='product-thumbnail'>";
                x += "<img src=\"" + items[i].image + "\" width=\"90\" height=\"190\" alt='Image'>";
                x += "</td>";

                x += "<td class='product-name'>";
                x += "<h2 class='h5 text-black'>" + items[i].name + "</h2>";
                x += "</td>";

                x += "<td class='product-name'>";
                x += "<h2 class='h5 text-black'>" + items[i].price + " Руб.</h2>";
                x += "</td>";

                x += "<td>";
                x += "<button class='btn btn-primary btn-sm' onclick=\"deleteOrderLine(" + idItem + "," + items[i].price + ");\">X</button>";
                x += "</td>";

                x += "</tr>";
                x += "</tbody>";
                x += "</table>";
                x += "</div>";
                x += "</form>";
                x += "</div>";
                x += "</div>";
                x += "</div>";
            }
        }
    };
    request.send();
}

function deleteOrderLine(id, cost) {
    //перерисовать список книг и сумму заказа

    var request = new XMLHttpRequest();
    var url = uri1 + id;
    request.open("DELETE", url, false);
    request.onload = function () {
        updateOrder(cost);
        showOrder();
        loadProducts();
    };
    request.send();
}

function updateOrder(cost) {
    //добавление к заказу товара
    ///Получение данных о заказе
    uri3 = uri2 + order;
    var request1 = new XMLHttpRequest();
    request1.open("GET", uri3, false);
    var item;
    request1.onload = function () {
        item = JSON.parse(request1.responseText);
        item.sumOrder -= cost;
        if (item.sumOrder < 0) item.sumOrder = 0;
        ///Изменение данных о заказе
        var request2 = new XMLHttpRequest();
        request2.open("PUT", uri3);
        request2.onload = function () {
        };
        request2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request2.send(JSON.stringify(item));
        GetOrder();
        loadProducts();
    };
    request1.send();
}