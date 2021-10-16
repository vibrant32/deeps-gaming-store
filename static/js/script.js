function setCartValue() {
    localStorage.clear();
    document.getElementById('btnpopover').innerText = 0;
}

function incrementCartItems(selectedbutton) {
    var val = document.getElementById('btnpopover');
    var num = val.innerHTML;
    num++;
    val.innerHTML = num;
    var productname = selectedbutton.parentElement.childNodes[1].childNodes[0].innerText
    var productprice = selectedbutton.parentElement.childNodes[1].childNodes[2].innerText;
    
    var productInfo = {
        'name': productname,
        'price': Number(productprice),
    }
    
    // got the main content 
    var products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(productInfo);
    localStorage.setItem("products", JSON.stringify(products));

    // disable the selected product button
    selectedbutton.disabled = true;    
}


function displayTable() {
    // get products to display on cart table
    var products = JSON.parse(localStorage.getItem("products"));
    var html = "<table class='table table-striped table-bordered'><thead><tr><th scope='col'>Srno</th><th scope='col'>Product Name</th><th scope='col'>Product Price(in Rs)</th><th scope='col'>Cancel Item</th></tr></thead><tbody>";
    if(products != null && products.length > 0) {
        for(var i = 0; i < products.length; i++) {
            html += "<tr>";
            html += `<td> ${i+1}</td>`;
            html += `<td> ${products[i]['name']} </td>`;
            html += `<td> ${products[i]['price']} </td>`;
            html += "<td><button class='btn btn-warning' type='button' onclick='deleteCartRow(this)'>Cancel</button></td>";
            html += "</tr>";
        }
    }
    html+="</tbody></table>";
    document.getElementById("cartmodal").innerHTML = html;
}

// delete added to cart item using remove button
function deleteCartRow(row) {
    var pnode = row.parentNode.parentNode;
    var addedToCart = JSON.parse(localStorage.getItem("products"));
    localStorage.clear();
    var pname = pnode.childNodes[1].innerText;
    var pprice = Number(pnode.childNodes[2].innerText);
    var result = addedToCart.filter((obj) => obj.name !== pname && obj.price !== pprice);
    localStorage.setItem("products", JSON.stringify(result));
    pnode.parentNode.removeChild(pnode);
    document.getElementById('btnpopover').innerHTML -= 1;         
}

// send the POST request via fetch api to flask
function sendPurchasedProducts() {
    // send the username along with products he purchased
    var products = JSON.parse(localStorage.getItem("products"));
    var username = document.getElementById("staticBackdropLabel").innerHTML.split("'s")[0];
    
    fetch(`${window.origin}/store/user/${username}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({"username":username, "purchased": products}),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"            
        })
    })
    .then(function (response) {
        if(response.status !== 200) {
            console.log(`Problem with status code: ${response.status}`);
            return;
        }
        console.log(response);
    })
    .catch(function (error) {
        console.log("Fetch error: " + error);
    })
    // reload the window
    window.location.reload();
}
