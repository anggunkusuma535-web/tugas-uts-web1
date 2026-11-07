
document.addEventListener("DOMContentLoaded", () => {

    // Memeriksa status login
    folioraRequireLogin();

    // Mengambil elemen HTML
    const form = document.getElementById("checkoutForm");

    const customerName = document.getElementById("customerName");
    const customerPhone = document.getElementById("customerPhone");
    const customerAddress = document.getElementById("customerAddress");

    const orderBook = document.getElementById("orderBook");
    const orderQty = document.getElementById("orderQty");
    const paymentMethod = document.getElementById("paymentMethod");

    const summaryBook = document.getElementById("summaryBook");
    const summaryPrice = document.getElementById("summaryPrice");
    const summaryQty = document.getElementById("summaryQty");
    const summaryTotal = document.getElementById("summaryTotal");

    const historyBody = document.getElementById("orderHistoryBody");
    const message = document.getElementById("checkoutMessage");


    // Mengambil data dari data.js
    let books = folioraGetBooks();
    let orders = folioraGetOrders();
    let shipments = folioraGetShipments();


    // Mengambil harga buku
    function getPrice(book) {

        return Number(
            book.hargaAngka ?? folioraPriceNumber(book.harga)
        ) || 0;

    }


    // Membuat nomor DO otomatis
    function generateDO() {

        let nomorDO;

        do {

            nomorDO = "FOL-" +
                Date.now().toString().slice(-8);

        } while (
            shipments.some(item => item.nomorDO === nomorDO)
        );

        return nomorDO;

    }


    // Mengisi pilihan buku dari katalog
    function loadBooks() {

        orderBook.innerHTML =
            '<option value="">Pilih buku yang ingin dibeli</option>';

        books.forEach(book => {

            const option = document.createElement("option");

            option.value = book.kodeBarang;

            option.textContent =
                `${book.namaBarang} - ${folioraFormatRupiah(getPrice(book))} (Stok: ${book.stok})`;

            if (Number(book.stok) <= 0) {
                option.disabled = true;
            }

            orderBook.appendChild(option);

        });

    }


    // Mencari buku berdasarkan kode barang
    function getSelectedBook() {

        return books.find(book =>
            book.kodeBarang === orderBook.value
        );

    }


    // Menghitung total pembayaran
    function updateSummary() {

        const book = getSelectedBook();

        const quantity = Math.max(
            1,
            Number(orderQty.value) || 1
        );

        if (!book) {

            summaryBook.textContent = "-";
            summaryPrice.textContent = "Rp0";
            summaryQty.textContent = quantity;
            summaryTotal.textContent = "Rp0";

            return;

        }

        const price = getPrice(book);
        const total = price * quantity;

        summaryBook.textContent = book.namaBarang;

        summaryPrice.textContent =
            folioraFormatRupiah(price);

        summaryQty.textContent = quantity;

        summaryTotal.textContent =
            folioraFormatRupiah(total);

    }


    // Menampilkan riwayat transaksi
    function renderHistory() {

        historyBody.innerHTML = "";

        if (orders.length === 0) {

            historyBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        Belum ada transaksi.
                    </td>
                </tr>
            `;

            return;

        }

        orders.forEach(order => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${order.nomorDO}</td>
                <td>${order.nama}</td>
                <td>${order.namaBarang}</td>
                <td>${folioraFormatRupiah(order.totalAngka)}</td>
                <td>
                    <span class="status status-success">
                        ${order.status}
                    </span>
                </td>
            `;

            historyBody.appendChild(row);

        });

    }


    // Memperbarui pilihan buku dan ringkasan
    orderBook.addEventListener("change", updateSummary);

    orderQty.addEventListener("input", updateSummary);


    // Proses ketika formulir dikirim
    form.addEventListener("submit", event => {

        event.preventDefault();

        // Mengambil data formulir
        const nama = customerName.value.trim();
        const telepon = customerPhone.value.trim();
        const alamat = customerAddress.value.trim();

        const book = getSelectedBook();

        const quantity = Number(orderQty.value);

        const payment = paymentMethod.value;


        // Validasi data
        if (!nama || !telepon || !alamat) {

            alert("Mohon lengkapi informasi pemesan.");

            return;

        }

        if (!book) {

            alert("Silakan pilih buku terlebih dahulu.");

            return;

        }

        if (!Number.isInteger(quantity) || quantity < 1) {

            alert("Jumlah buku minimal 1.");

            return;

        }

        if (!payment) {

            alert("Silakan pilih metode pembayaran.");

            return;

        }


        // Memeriksa ketersediaan stok
        if (quantity > Number(book.stok)) {

            alert("Stok buku tidak mencukupi.");

            return;

        }


        // Menghitung total
        const price = getPrice(book);
        const total = price * quantity;

        // Membuat nomor DO
        const nomorDO = generateDO();

        // Mengambil tanggal saat ini
        const tanggal = new Date().toISOString().slice(0, 10);


        // Membuat data transaksi
        const newOrder = {

            nomorDO: nomorDO,

            nama: nama,

            telepon: telepon,

            alamat: alamat,

            kodeBarang: book.kodeBarang,

            namaBarang: book.namaBarang,

            jumlah: quantity,

            harga: price,

            totalAngka: total,

            total: folioraFormatRupiah(total),

            metodePembayaran: payment,

            tanggal: tanggal,

            status: "Diproses"

        };


        // Membuat data pengiriman untuk tracking
        const newShipment = {

            nomorDO: nomorDO,

            nama: nama,

            telepon: telepon,

            alamat: alamat,

            namaBarang: book.namaBarang,

            jumlah: quantity,

            status: "Diproses",

            ekspedisi: "JNE",

            tanggalKirim: tanggal,

            paket: "REG",

            total: folioraFormatRupiah(total),

            perjalanan: [
                {
                    waktu: new Date().toLocaleString("sv-SE"),
                    keterangan:
                        "Pesanan diterima oleh Foliora dan sedang diproses."
                }
            ]

        };


        // Mengurangi stok buku
        book.stok = Number(book.stok) - quantity;


        // Menyimpan perubahan data
        folioraSaveBooks(books);


        // Menambahkan transaksi baru
        orders.push(newOrder);

        folioraSaveOrders(orders);


        // Menambahkan data pengiriman
        shipments.push(newShipment);

        folioraSaveShipments(shipments);


        // Menampilkan pesan berhasil
        message.textContent =
            `Pesanan berhasil dibuat! Nomor DO: ${nomorDO}`;

        message.className = "form-message success";


        // Menampilkan informasi transaksi
        alert(
            "Pesanan berhasil dibuat!\n\n" +
            "Nomor DO: " + nomorDO + "\n" +
            "Nama: " + nama + "\n" +
            "Buku: " + book.namaBarang + "\n" +
            "Jumlah: " + quantity + "\n" +
            "Total: " + folioraFormatRupiah(total)
        );


        // Memperbarui data halaman
        books = folioraGetBooks();
        orders = folioraGetOrders();
        shipments = folioraGetShipments();

        loadBooks();
        renderHistory();


        // Mengosongkan formulir
        form.reset();

        orderQty.value = 1;

        updateSummary();

    });


    // Tombol logout
    document.getElementById("logoutBtn")
        .addEventListener("click", folioraLogout);


    // Menjalankan fungsi awal
    loadBooks();

    renderHistory();

    updateSummary();

});
