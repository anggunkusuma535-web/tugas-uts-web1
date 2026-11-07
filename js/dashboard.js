document.addEventListener("DOMContentLoaded", () => {
  folioraRequireLogin();
  const hour = new Date().getHours();
  let greeting = "Selamat Malam";
  if (hour >= 4 && hour < 11) greeting = "Selamat Pagi";
  else if (hour >= 11 && hour < 15) greeting = "Selamat Siang";
  else if (hour >= 15 && hour < 18) greeting = "Selamat Sore";

  const name = sessionStorage.getItem("folioraUser") || "Pengunjung Foliora";
  document.getElementById("greeting").textContent = `${greeting}, ${name}!`;
  document.getElementById("userName").textContent = name;

  const books = folioraGetBooks();
  const orders = folioraGetOrders();
  const shipments = folioraGetShipments();
  document.getElementById("totalBooks").textContent = books.length;
  document.getElementById("totalStock").textContent =
    books.reduce((sum, book) => sum + Number(book.stok || 0), 0);
  document.getElementById("totalOrders").textContent = orders.length + shipments.length;

  document.getElementById("logoutBtn").addEventListener("click", folioraLogout);
});
