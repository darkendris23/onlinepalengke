// User-Defined Globals
const bigCard_bg = document.getElementById('preview-background')
const bigCard = document.getElementById("preview-container")

const cardImg = document.getElementById("preview-img")
const cardTitle = document.getElementById("preview-title")
const cardPrice = document.getElementById("preview-price")
const cardQuantity = document.getElementById("quantity-amount")

var extData // JSON.parse Data
var extID   // This.Element
var initArr

var initAmount = 1
var currAmount

var computePrice = 0

// Opens a pop-up for the product
function viewProd(id) {
    currAmount = initAmount
    cardImg.src = id[0].src
    cardTitle.innerHTML = id[1].innerHTML
    cardPrice.innerHTML = id[3].innerHTML
    cardQuantity.innerHTML = currAmount

    bigCard_bg.style.display = 'block'
}

// Close pop-up
function closeBTN() {
    console.log('clicked')
    bigCard_bg.style.display = ''
}

// Adjust amount for the product
function amount(mod) {
    if (mod == '+') {
        currAmount = currAmount + 1
    } else {
        if (currAmount > 1) {
            currAmount = currAmount - 1
        }
    }
    cardQuantity.innerHTML = currAmount
}

// Cart functions
// Key generator for sessionStorage
function keygen() {
    let key = "onlinepalengke_" + cardTitle.innerText
    return key
}

// Store data
async function addTo() {
    let key = await keygen()

    let priceStr = cardPrice.innerHTML.toString()
    let priceSpl = priceStr.split("₱")
    let priceInt = parseFloat(priceSpl[1])

    let retAmount
    if (JSON.parse(sessionStorage.getItem(key))) retAmount = JSON.parse(sessionStorage.getItem(key))[2]
    let struct = [cardImg.src, priceInt] // Data structure template
    if (retAmount > 0) {
        let addAmount = currAmount + retAmount

        struct.push(addAmount)
    } else {
        struct.push(currAmount)
    }
    sessionStorage.setItem(key, JSON.stringify(struct))
    console.log(JSON.parse(sessionStorage.getItem(key)))

    if (!sessionStorage.keylist) {
        sessionStorage.keylist = key
    } else {
        console.log(sessionStorage.keylist)
        let split = await splitKey() // Get array of strings
        let found = false
        split.forEach(strings => {
            if (strings == key) return found = true //Stop loop when similar name is found
        });
        if (found == false) sessionStorage.keylist = sessionStorage.keylist + ',' + key // Add the key to the current set of string in the storage
    }
}

// Key splitter
function splitKey() {
    let keylist = sessionStorage.keylist
    let str = keylist.toString()
    let split = str.split(",")
    return split
}

// Shopping cart items
async function openCart() {
    let container = document.getElementById("cart-list")
    container.innerHTML = ""
    computePrice = 0

    let split = await splitKey()

    split.forEach(key => {
        let extract = JSON.parse(sessionStorage.getItem(key))
        itemGen(key, extract)
    });

    let struct = `<li><h4 id="cart-total">Total: ₱${computePrice}.00</h4>
                <h6 id="total-extra"><span>Shipping</span> calculated at checkout</h6>
                <button id="BTN_checkout" onclick="saveAmt()">CHECK OUT</button></li>`
    container.innerHTML += struct
    container.style.opacity = 1
}

// Cart List structure
function itemGen(key, data) {
    let container = document.getElementById("cart-list")

    let itemName = key.split("_")[1]
    console.log(itemName)
    console.log(data)

    computePrice = computePrice + (data[2] * data[1])

    const struct = `<li>
    <div class="cart-item">
        <div class="item-top">
            <img src="${data[0]}"/>
            <div class="cart-item-text">
                <h5>${itemName}</h5>
                <h6>₱${data[1]}.00</h6>
            </div>
        </div>
        <div class="item-bottom">
            <div class="item-quantity">
                <button onclick="cartAmountMod('${key}','-');"><i class="fa-solid fa-minus"></i></button>
                <h5>${JSON.parse(data[2])}</h5>
                <button onclick="cartAmountMod('${key}','+');"><i class="fa-solid fa-plus"></i></button>
            </div>
            <button class="BTN_remove" onclick="itemRemove('${key}')">Remove</button>
        </div>
    </div>
</li>`
    let merg = container.innerHTML + struct
    container.innerHTML = merg
}

// In-Cart amount
function cartAmountMod(key, operand) {
    let data = JSON.parse(sessionStorage.getItem(key))
    let cartAmount = data[2]
    console.log(cartAmount)
    let totalAmount
    if (operand == "+") {
        totalAmount = cartAmount + 1
    } else if (operand == "-") {
        if (cartAmount > 1) {
            totalAmount = cartAmount - 1
        } else {
            totalAmount = 0
        }
    }
    let jsfy = JSON.stringify([data[0], data[1], totalAmount])
    sessionStorage.setItem(key, jsfy)
    console.log(sessionStorage.getItem(key))
}

// Remove item
async function itemRemove(key) {
    let split = await splitKey()
    for (let i = 0; i < split.length; i++) {
        if (split[i].toString() == key) {
            split.splice(i, 1)
            sessionStorage.keylist = split
            return
        }
    }
    sessionStorage.removeItem(key)
}

// Hide Cart
function hideCart() {
    let container = document.getElementById("cart-list")
    container.style.opacity = "0"
}

function addHideListeners() {
    let container = document.getElementById("cart-list")
    if (!container) return
    container.setAttribute("onmouseleave", "hideCart()")
}

addHideListeners()


function saveAmt() {
    let key = "onlinepalengke_amount"
    sessionStorage.setItem(key, JSON.parse(computePrice))
    window.location.href = '/dir/checkout.html';
}
// 

function userData() {
    let key = "onlinepalengke_userdata"
    let fname = document.getElementById('Firstname').value
    let lname = document.getElementById('Lastname').value
    let add = document.getElementById('address').value
    let zip = document.getElementById('zip').value
    let phone = document.getElementById('phonenum').value

    let con = [fname, lname, add, zip, phone]
    let jsfy = JSON.stringify(con)

    sessionStorage.setItem(key, jsfy)

    window.location.href = "/dir/confirmation.html"
}

async function getData() {
    let data = JSON.parse(sessionStorage.getItem("onlinepalengke_userdata"))
    let name = document.getElementById("confirmation-name")
    let phone = document.getElementById("confirmation-phone")
    let add = document.getElementById("confirmation-address")
    let amount = document.getElementById("confirmation-amount")
    let ref = document.getElementById("confirmation-ref")
    let dat = document.getElementById("confirmation-date")

    let pri = JSON.parse(sessionStorage.getItem("onlinepalengke_amount"))

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let monName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${monName[month]} ${day}, ${year} ${strTime}`;

    console.log(currentDate)
    name.innerHTML = data[0] + " " + data[1]
    phone.innerHTML = data[4]
    add.innerHTML = data[2] + ", " + data[3]
    amount.innerHTML = "₱" + pri + ".00"
    let refid = await makeid(15)
    ref.innerHTML = "Ref no. " + refid
    dat.innerHTML = currentDate

    let container = document.getElementById("item-list")
    container.innerHTML = ""

    let split = await splitKey()

    split.forEach(key => {
        let extract = JSON.parse(sessionStorage.getItem(key))
        let name = key.split("_")[1]
        console.log(extract)
        let calc = extract[1] * extract[2]
        let struct = `<li>
        <img class="item-list-img" src="${extract[0]}" />
        <div class="item-list-texts">
            <h5 class="item-text-name">${name}</h5>
            <h6 class="item-text-amount" style="font-weight: normal;padding-top: 5px">₱${extract[1]}.00 x ${extract[2]}</h6>
        </div>
        <h5 class="item-list-price">₱${calc}.00</h5>
    </li>`
        container.innerHTML += struct
    });
}

// Ref ID
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}