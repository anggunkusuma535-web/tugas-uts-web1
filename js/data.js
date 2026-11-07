
/* =========================================
   DATA PENGGUNA FOLIORA
========================================= */

var dataPengguna = [
    {
        id: 1,
        nama: "Rina Wulandari",
        email: "rina@gmail.com",
        password: "rina123",
        role: "User"
    },
    {
        id: 2,
        nama: "Agus Pranoto",
        email: "agus@gmail.com",
        password: "agus123",
        role: "User"
    },
    {
        id: 3,
        nama: "Siti Marlina",
        email: "siti@gmail.com",
        password: "siti123",
        role: "Admin"
    }
];


/* =========================================
   DATA KATALOG BUKU
========================================= */

var dataKatalogBuku = [
    {
        kodeBarang: "ASIP4301",
        namaBarang: "Pengantar Ilmu Komunikasi",
        jenisBarang: "Buku Ajar",
        edisi: "2",
        stok: 548,
        harga: "Rp 180.000",
        hargaAngka: 180000,
        cover: "assets/pengantar_komunikasi.jpg"
    },
    {
        kodeBarang: "EKMA4002",
        namaBarang: "Manajemen Keuangan",
        jenisBarang: "Buku Ajar",
        edisi: "3",
        stok: 392,
        harga: "Rp 220.000",
        hargaAngka: 220000,
        cover: "assets/manajemen_keuangan.jpg"
    },
    {
        kodeBarang: "EKMA4310",
        namaBarang: "Kepemimpinan",
        jenisBarang: "Buku Ajar",
        edisi: "1",
        stok: 278,
        harga: "Rp 150.000",
        hargaAngka: 150000,
        cover: "assets/kepemimpinan.jpg"
    },
    {
        kodeBarang: "BIOL4211",
        namaBarang: "Mikrobiologi Dasar",
        jenisBarang: "Buku Ajar",
        edisi: "2",
        stok: 165,
        harga: "Rp 200.000",
        hargaAngka: 200000,
        cover: "assets/mikrobiologi.jpg"
    },
    {
        kodeBarang: "PAUD4401",
        namaBarang: "Perkembangan Anak Usia Dini",
        jenisBarang: "Buku Ajar",
        edisi: "4",
        stok: 204,
        harga: "Rp 250.000",
        hargaAngka: 250000,
        cover: "assets/paud_perkembangan.jpg"
    }
];


/* =========================================
   DATA TRACKING PENGIRIMAN
========================================= */

var dataTracking = {

    "20230012": {
        nomorDO: "20230012",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        ekspedisi: "JNE",
        tanggalKirim: "2025-08-25",
        paket: "0JKT01",
        total: "Rp 180.000",

        perjalanan: [
            {
                waktu: "2025-08-25 10:12:20",
                keterangan:
                    "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka"
            },
            {
                waktu: "2025-08-25 14:07:56",
                keterangan:
                    "Tiba di Hub: TANGERANG SELATAN"
            },
            {
                waktu: "2025-08-25 10:12:20",
                keterangan:
                    "Diteruskan ke Kantor Jakarta Selatan"
            }
        ]
    },

    "20230013": {
        nomorDO: "20230013",
        nama: "Agus Pranoto",
        status: "Dikirim",
        ekspedisi: "Pos Indonesia",
        tanggalKirim: "2025-08-25",
        paket: "0UPBJJBDG",
        total: "Rp 220.000",

        perjalanan: [
            {
                waktu: "2025-08-25 10:12:20",
                keterangan:
                    "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka"
            },
            {
                waktu: "2025-08-25 14:07:56",
                keterangan:
                    "Tiba di Hub: TANGERANG SELATAN"
            },
            {
                waktu: "2025-08-25 16:30:10",
                keterangan:
                    "Diteruskan ke Kantor Kota Bandung"
            },
            {
                waktu: "2025-08-26 12:15:33",
                keterangan:
                    "Tiba di Hub: Kota BANDUNG"
            },
            {
                waktu: "2025-08-26 15:06:12",
                keterangan:
                    "Proses antar ke Cimahi"
            },
            {
                waktu: "2025-08-26 20:00:00",
                keterangan:
                    "Selesai Antar. Penerima: Agus Pranoto"
            }
        ]
    }

};


/* =========================================
   FUNGSI FORMAT HARGA
========================================= */

// Mengubah angka menjadi format Rupiah
function folioraFormatRupiah(angka) {

    if (typeof angka === "string") {
        angka = folioraPriceNumber(angka);
    }

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Number(angka) || 0);

}


// Mengambil angka dari tulisan harga
function folioraPriceNumber(harga) {

    return Number(
        String(harga || "").replace(/[^0-9]/g, "")
    ) || 0;

}


/* =========================================
   FUNGSI PENYIMPANAN LOCAL STORAGE
========================================= */

const FOLIORA_BOOKS_KEY = "folioraBooks";
const FOLIORA_ORDERS_KEY = "folioraOrders";
const FOLIORA_SHIPMENTS_KEY = "folioraShipments";


// Mengambil data buku
function folioraGetBooks() {

    const savedBooks = localStorage.getItem(FOLIORA_BOOKS_KEY);

    if (savedBooks !== null) {
        try {
            return JSON.parse(savedBooks);
        } catch (error) {
            console.error("Data buku tidak dapat dibaca:", error);
        }
    }

    folioraSaveBooks(dataKatalogBuku);

    return JSON.parse(JSON.stringify(dataKatalogBuku));

}


// Menyimpan data buku
function folioraSaveBooks(books) {

    localStorage.setItem(
        FOLIORA_BOOKS_KEY,
        JSON.stringify(books)
    );

}


// Mengambil data pesanan
function folioraGetOrders() {

    try {
        return JSON.parse(
            localStorage.getItem(FOLIORA_ORDERS_KEY)
        ) || [];
    } catch (error) {
        return [];
    }

}


// Menyimpan data pesanan
function folioraSaveOrders(orders) {

    localStorage.setItem(
        FOLIORA_ORDERS_KEY,
        JSON.stringify(orders)
    );

}


// Mengambil data pengiriman
function folioraGetShipments() {

    try {

        const saved = localStorage.getItem(FOLIORA_SHIPMENTS_KEY);

        if (saved !== null) {
            return JSON.parse(saved) || [];
        }

    } catch (error) {
        console.error("Data pengiriman tidak dapat dibaca:", error);
    }

    // Mengubah objek tracking menjadi array
    const initialShipments = Object.values(dataTracking);

    folioraSaveShipments(initialShipments);

    return initialShipments;

}


// Menyimpan data pengiriman
function folioraSaveShipments(shipments) {

    localStorage.setItem(
        FOLIORA_SHIPMENTS_KEY,
        JSON.stringify(shipments)
    );

}


/* =========================================
   FUNGSI LOGIN DAN LOGOUT
========================================= */

// Memeriksa apakah pengguna sudah login
function folioraRequireLogin() {

    const user = sessionStorage.getItem("folioraUser");

    if (!user) {
        window.location.href = "login.html";
    }

}


// Mengeluarkan pengguna dari akun
function folioraLogout() {

    sessionStorage.removeItem("folioraUser");

    window.location.href = "login.html";

}


/* =========================================
   INISIALISASI DATA FOLIORA
========================================= */

// Menyiapkan data awal ketika website dibuka
function folioraInitialize() {

    if (localStorage.getItem(FOLIORA_BOOKS_KEY) === null) {
        folioraSaveBooks(dataKatalogBuku);
    }

    if (localStorage.getItem(FOLIORA_ORDERS_KEY) === null) {
        folioraSaveOrders([]);
    }

    if (localStorage.getItem(FOLIORA_SHIPMENTS_KEY) === null) {
        folioraSaveShipments(Object.values(dataTracking));
    }

}

// Menjalankan inisialisasi
folioraInitialize();
