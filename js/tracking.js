
document.addEventListener("DOMContentLoaded", () => {

    // Memeriksa apakah pengguna sudah login
    folioraRequireLogin();

    // Mengambil elemen HTML
    const trackingForm = document.getElementById("trackingForm");
    const trackingInput = document.getElementById("trackingNumber");
    const trackingResult = document.getElementById("trackingResult");
    const trackingMessage = document.getElementById("trackingMessage");

    // Mengambil data pengiriman
    let shipments = folioraGetShipments();


    // Mengamankan teks sebelum dimasukkan ke HTML
    function safe(value) {

        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char]));

    }


    // Mengubah tanggal menjadi format Indonesia
    function formatDate(dateString) {

        if (!dateString) return "-";

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    }


    // Menampilkan detail pengiriman
    function showTracking(shipment) {

        trackingResult.hidden = false;

        trackingMessage.textContent = "";

        const perjalanan = shipment.perjalanan || [];

        // Menampilkan status perjalanan
        let historyHTML = "";

        if (perjalanan.length > 0) {

            historyHTML = perjalanan.map(item => `

                <div class="tracking-item">

                    <div class="tracking-dot"></div>

                    <div class="tracking-item-content">

                        <strong>${safe(item.keterangan)}</strong>

                        <p class="muted small">
                            ${safe(item.waktu)}
                        </p>

                    </div>

                </div>

            `).join("");

        } else {

            historyHTML = `
                <p class="muted">
                    Belum ada riwayat perjalanan.
                </p>
            `;

        }


        // Menampilkan informasi pengiriman
        trackingResult.innerHTML = `

            <div class="tracking-card">

                <div class="tracking-header">

                    <div>

                        <p class="eyebrow">
                            DETAIL PENGIRIMAN
                        </p>

                        <h2>
                            ${safe(shipment.nomorDO)}
                        </h2>

                    </div>

                    <span class="status status-success">
                        ${safe(shipment.status)}
                    </span>

                </div>


                <div class="tracking-info-grid">

                    <div class="tracking-info">

                        <span>Nama Penerima</span>

                        <strong>
                            ${safe(shipment.nama)}
                        </strong>

                    </div>


                    <div class="tracking-info">

                        <span>Ekspedisi</span>

                        <strong>
                            ${safe(shipment.ekspedisi)}
                        </strong>

                    </div>


                    <div class="tracking-info">

                        <span>Tanggal Pengiriman</span>

                        <strong>
                            ${safe(formatDate(shipment.tanggalKirim))}
                        </strong>

                    </div>


                    <div class="tracking-info">

                        <span>Jenis Paket</span>

                        <strong>
                            ${safe(shipment.paket)}
                        </strong>

                    </div>


                    <div class="tracking-info">

                        <span>Total Pembayaran</span>

                        <strong>
                            ${safe(shipment.total)}
                        </strong>

                    </div>


                    <div class="tracking-info">

                        <span>Alamat Tujuan</span>

                        <strong>
                            ${safe(shipment.alamat || "-")}
                        </strong>

                    </div>

                </div>


                <div class="tracking-history">

                    <h3>Riwayat Perjalanan Paket</h3>

                    <div class="tracking-timeline">

                        ${historyHTML}

                    </div>

                </div>

            </div>

        `;

    }


    // Mencari nomor DO
    trackingForm.addEventListener("submit", event => {

        event.preventDefault();

        const nomorDO = trackingInput.value.trim();

        if (!nomorDO) {

            trackingMessage.textContent =
                "Masukkan nomor DO terlebih dahulu.";

            trackingMessage.className =
                "form-message error";

            trackingResult.hidden = true;

            return;

        }


        // Memperbarui data pengiriman dari penyimpanan
        shipments = folioraGetShipments();


        // Mencari data berdasarkan nomor DO
        const shipment = shipments.find(item =>
            String(item.nomorDO).toLowerCase() === nomorDO.toLowerCase()
        );


        // Jika nomor DO tidak ditemukan
        if (!shipment) {

            trackingResult.hidden = true;

            trackingMessage.textContent =
                "Nomor DO tidak ditemukan. Periksa kembali nomor pesanan kamu.";

            trackingMessage.className =
                "form-message error";

            return;

        }


        // Jika nomor DO ditemukan
        showTracking(shipment);

    });


    // Tombol logout
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", folioraLogout);

    }

});
