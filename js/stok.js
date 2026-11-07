
document.addEventListener("DOMContentLoaded", () => {
  folioraRequireLogin();

  const tbody = document.getElementById("bookTableBody");
  const form = document.getElementById("addBookForm");
  const panel = document.getElementById("addBookPanel");
  const search = document.getElementById("searchBook");

  let books = folioraGetBooks();

  // Mengamankan teks yang ditampilkan pada HTML
  function safe(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  // Menampilkan data buku ke tabel
  function renderBooks(keyword = "") {

    const key = keyword.toLowerCase();

    const filtered = books.filter(book =>
      [book.kodeBarang, book.namaBarang, book.jenisBarang].some(value =>
        String(value || "").toLowerCase().includes(key)
      )
    );

    tbody.innerHTML = "";

    if (!filtered.length) {
      tbody.innerHTML =
        '<tr><td colspan="8">Buku tidak ditemukan.</td></tr>';

    } else {

      filtered.forEach((book, index) => {

        const stock = Number(book.stok) || 0;

        const status = stock > 0
          ? '<span class="status status-success">Tersedia</span>'
          : '<span class="status status-danger">Habis</span>';

        // Menampilkan gambar cover buku
        const cover = book.cover
          ? `<img
                src="${safe(book.cover)}"
                alt="${safe(book.namaBarang)}"
                class="book-cover"
                onerror="this.style.display='none'; this.nextElementSibling.hidden=false;"
             >
             <span class="cover-empty" hidden>Gambar tidak ditemukan</span>`
          : '<span class="cover-empty">Belum ada gambar</span>';

        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${index + 1}</td>

          <td>${cover}</td>

          <td>${safe(book.kodeBarang)}</td>

          <td>
            <strong>${safe(book.namaBarang)}</strong>
          </td>

          <td>${safe(book.jenisBarang)}</td>

          <td>${safe(book.edisi)}</td>

          <td>
            ${folioraFormatRupiah(
              book.hargaAngka ?? folioraPriceNumber(book.harga)
            )}
          </td>

          <td>
            ${stock} ${status}
          </td>
        `;

        tbody.appendChild(row);
      });
    }

    document.getElementById("bookCount").textContent =
      `Menampilkan ${filtered.length} dari ${books.length} judul buku.`;

      // Menampilkan total judul buku
document.getElementById("bookTotal").textContent =
  books.length;

      // Menghitung total stok buku
document.getElementById("stockTotal").textContent =
  books.reduce((sum, book) => {
    return sum + (Number(book.stok) || 0);
  }, 0).toLocaleString("id-ID");
  }


  // Menampilkan atau menyembunyikan form tambah buku
  document.getElementById("showAddForm").addEventListener("click", () => {

    panel.hidden = !panel.hidden;

    if (!panel.hidden) {
      document.getElementById("bookTitle").focus();
    }

  });


  // Tombol batal tambah buku
  document.getElementById("cancelAdd").addEventListener("click", () => {

    panel.hidden = true;
    form.reset();

  });


  // Menambahkan buku baru
  form.addEventListener("submit", event => {

    event.preventDefault();

    const title = document.getElementById("bookTitle").value.trim();

    const price = Number(
      document.getElementById("bookPrice").value
    );

    const stock = Number(
      document.getElementById("bookStock").value
    );

    const code = "FOL" + Date.now().toString().slice(-6);

    books.push({

      kodeBarang: code,

      namaBarang: title,

      jenisBarang: "Buku Tambahan",

      edisi: "1",

      stok: stock,

      harga: folioraFormatRupiah(price),

      hargaAngka: price,

      cover: ""

    });

    folioraSaveBooks(books);

    renderBooks(search.value);

    form.reset();

    panel.hidden = true;

    alert("Buku berhasil ditambahkan ke katalog.");

  });


  // Fitur pencarian buku
  search.addEventListener("input", () => {

    renderBooks(search.value);

  });


  // Menampilkan katalog saat halaman dibuka
  renderBooks();

});
