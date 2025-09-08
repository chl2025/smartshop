// document.addEventListener("DOMContentLoaded", () => {
//   let cartCount = 0;
//   let cartTotal = 0;

//   // Read Cart store to update cartCount and cartTotal
//   function updateCartFigures() {
//     console.log(
//       `Enter updateCartFigures: cartCount=${cartCount}, cartTotal=${cartTotal}`
//     );
//     if (!db) return;
//     const transaction = db.transaction(["cart"], "readonly");
//     const store = transaction.objectStore("cart");
//     const request = store.getAll();
//     request.onsuccess = function (event) {
//       const items = event.target.result;
//       cartCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
//       cartTotal = items.reduce(
//         (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
//         0
//       );
//       document.getElementById("header-qty").textContent = cartCount;
//       document.getElementById(
//         "header-price"
//       ).textContent = `$${cartTotal.toLocaleString()}`;
//     };
//     console.log(
//       `Leave updateCartFigures: cartCount=${cartCount}, cartTotal=${cartTotal}`
//     );
//   }

//   // Open (or create) the IndexedDB database
//   let db;
//   const request = indexedDB.open("cartDB", 1);

//   // Call updateCartFigures after DB is ready
//   request.onsuccess = function (event) {
//     db = event.target.result;
//     updateCartFigures();
//   };

//   request.onupgradeneeded = function (event) {
//     db = event.target.result;
//     if (!db.objectStoreNames.contains("cart")) {
//       db.createObjectStore("cart", { keyPath: "name" });
//     }
//   };

//   function addToCart(item) {
//     const transaction = db.transaction(["cart"], "readwrite");
//     const store = transaction.objectStore("cart");
//     const getRequest = store.get(item.name);

//     getRequest.onsuccess = function (event) {
//       const existing = event.target.result;
//       if (existing) {
//         existing.quantity = (existing.quantity || 1) + 1;
//         store.put(existing);
//       } else {
//         store.put(item);
//       }
//     };
//   }

//   document.querySelectorAll(".product-item").forEach((item) => {
//     const btn = item.querySelector("button");
//     const name = item.querySelector(".product-name")?.textContent?.trim();
//     const priceRaw =
//       item.querySelector(".product-price")?.textContent?.trim() || "$0";
//     const img = item.querySelector("img")?.getAttribute("src") || "";

//     const priceClean = priceRaw.replace(/[^0-9.]/g, "");
//     const price = parseFloat(priceClean);

//     if (btn && name && !isNaN(price)) {
//       btn.addEventListener("click", () => {
//         // Store data in IndexedDB, now including image path
//         addToCart({
//           name: name,
//           price: price,
//           quantity: 1,
//           image: img,
//         });

//         // Update cart figures
//         cartCount += 1;
//         cartTotal += price;
//         document.getElementById("header-qty").textContent = cartCount;
//         document.getElementById(
//           "header-price"
//         ).textContent = `$${cartTotal.toLocaleString()}`;

//         showToast(`🛒 Added ${name}`);
//       });
//     }
//   });

//   function showToast(msg) {
//     const toast = document.createElement("div");
//     toast.className = "toast align-items-center text-white bg-success border-0";
//     toast.innerHTML = `
//       <div class="d-flex">
//         <div class="toast-body">${msg}</div>
//         <button type="button" class="btn-close btn-close-white me-2 m-auto"
//           data-bs-dismiss="toast" aria-label="Close"></button>
//       </div>
//     `;
//     document.querySelector(".toast-container")?.appendChild(toast);
//     new bootstrap.Toast(toast).show();
//   }
// });
