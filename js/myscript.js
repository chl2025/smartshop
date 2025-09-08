function addFavicon(url, type = "image/png") {
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = type;
  link.href = url;

  // Remove existing favicons if any
  const existingIcons = document.querySelectorAll("link[rel~='icon']");
  existingIcons.forEach((icon) => icon.remove());

  document.head.appendChild(link);
}

// Call the function with your favicon path
addFavicon("images/afavicon.png"); // Replace with your actual path

document.addEventListener("DOMContentLoaded", () => {
  fetch("partials/myheader.sect")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("myheader").innerHTML = data;

      // Now that the header is injected, calculate navHeight
      const navHeight = document.querySelector(".fixed-top")?.offsetHeight || 0;
      document.querySelector(".content-wrapper").style.paddingTop =
        navHeight + "px";

      // Open (or create) the IndexedDB database
      let request = indexedDB.open("cartDB", 1);
      // Call updateCartFigures after DB is ready
      request.onsuccess = function (event) {
        db = event.target.result;
        updateCartFigures();
      };

      request.onupgradeneeded = function (event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains("cart")) {
          db.createObjectStore("cart", { keyPath: "name" });
        }
      };
    });

  fetch("partials/myfooter.sect")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("myfooter").innerHTML = data;
    });

  setTopPad();

  // Keep resize logic separate — it works after everything is rendered
  window.addEventListener("resize", setTopPad);
});

let cartCount = 0;
let cartTotal = 0;

// Read Cart store to update cartCount and cartTotal at header
function updateCartFigures() {
  if (!db) return;
  const transaction = db.transaction(["cart"], "readonly");
  const store = transaction.objectStore("cart");
  const request = store.getAll();
  request.onsuccess = function (event) {
    const items = event.target.result;
    cartCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartTotal = items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    console.log(`cartCount = ${cartCount}, cartTotal = ${cartTotal}`);
    document.getElementById("header-qty").textContent = cartCount;
    document.getElementById(
      "header-price"
    ).textContent = `$${cartTotal.toLocaleString()}`;
  };
}

// Open (or create) the IndexedDB database
let db;

function addToCart(item) {
  const transaction = db.transaction(["cart"], "readwrite");
  const store = transaction.objectStore("cart");
  const getRequest = store.get(item.name);

  // console.log(
  //   `item in addToCart := ${item.name}, ${item.image}, ${item.price}, ${item.quantity}`
  // );
  getRequest.onsuccess = function (event) {
    const existing = event.target.result;
    if (existing) {
      existing.quantity = (existing.quantity || 1) + item.quantity;
      store.put(existing);
    } else {
      store.put(item);
    }
  };
}

document.querySelectorAll(".product-item").forEach((item) => {
  // console.log("Enter querySelectorAll('.product-item').foreach()");
  const btn = item.querySelector("button");
  const name = item.querySelector(".product-name")?.textContent?.trim();
  const priceRaw =
    item.querySelector(".product-price")?.textContent?.trim() || "$0";
  //    const img = item.querySelector("img")?.getAttribute("src") || "";
  let img = item.querySelector("img")?.getAttribute("src");
  if (!img) {
    const bgDiv = item.querySelector(".img-large");
    const bgStyle = bgDiv?.style?.backgroundImage || "";
    // console.log(`bgStype = ${bgStyle}`);
    const match = bgStyle.match(/url\(["']?(.*?)["']?\)/);
    // console.log(`match = ${match}`);
    img = match?.[1] || "";
  }

  const priceClean = priceRaw.replace(/[^0-9.]/g, "");
  const price = parseFloat(priceClean);

  // console.log(`btn is ${btn}, name = ${name}, price =${price}`);
  if (btn && name && !isNaN(price)) {
    btn.addEventListener("click", () => {
      const qtyInput = item.querySelector("#qty");
      // console.log(`qtyInput.value = ${qtyInput?.value ?? "not available"}`);
      const quantity = qtyInput ? parseInt(qtyInput.value, 10) : 1;
      // console.log(`quantity = ${quantity}`);

      // Store data in IndexedDB, now including image path
      addToCart({
        name: name,
        price: price,
        quantity: quantity,
        image: img,
      });

      // Update cart figures
      cartCount += quantity;
      cartTotal += quantity * price;
      document.getElementById("header-qty").textContent = cartCount;
      document.getElementById(
        "header-price"
      ).textContent = `$${cartTotal.toLocaleString()}`;
    });
  }
});

function setTopPad() {
  const navHeight = document.querySelector(".fixed-top")?.offsetHeight || 0;
  document.querySelector(".content-wrapper").style.paddingTop =
    navHeight + "px";
}
