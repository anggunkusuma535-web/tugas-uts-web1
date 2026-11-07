document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const forgotForm = document.getElementById("forgotForm");
  const registerForm = document.getElementById("registerForm");

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) { modal.classList.add("active"); modal.setAttribute("aria-hidden", "false"); }
  }
  function closeModal(modal) {
    if (modal) { modal.classList.remove("active"); modal.setAttribute("aria-hidden", "true"); }
  }

  document.querySelectorAll("[data-open-modal]").forEach(button =>
    button.addEventListener("click", () => openModal(button.dataset.openModal))
  );
  document.querySelectorAll("[data-close-modal]").forEach(button =>
    button.addEventListener("click", () => closeModal(button.closest(".modal")))
  );
  document.querySelectorAll(".modal").forEach(modal => modal.addEventListener("click", event => {
    if (event.target === modal) closeModal(modal);
  }));

  loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const akun = dataPengguna.find(user =>
      user.email.toLowerCase() === email && user.password === password
    );

    if (!akun) {
      alert("email/password yang anda masukkan salah");
      return;
    }
    sessionStorage.setItem("folioraLoggedIn", "true");
    sessionStorage.setItem("folioraUser", akun.nama);
    sessionStorage.setItem("folioraRole", akun.role);
    window.location.href = "dashboard.html";
  });

  forgotForm.addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("forgotEmail").value.trim().toLowerCase();
    const found = dataPengguna.some(user => user.email.toLowerCase() === email);
    document.getElementById("forgotMessage").textContent = found
      ? "Email terdaftar. Fitur pengiriman instruksi pemulihan masih berupa simulasi."
      : "Email tidak ditemukan dalam data pengguna.";
  });

  registerForm.addEventListener("submit", event => {
    event.preventDefault();
    document.getElementById("registerMessage").textContent =
      "Pendaftaran pada tampilan ini masih berupa simulasi. Hubungi admin untuk menambahkan akun ke dataPengguna.";
    registerForm.reset();
  });
});
