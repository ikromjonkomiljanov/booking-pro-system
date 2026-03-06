document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#bookingForm");
  const list = document.querySelector("#list");
  const filterBtns = document.querySelectorAll(".filterBtns");

  let bookings = JSON.parse(localStorage.getItem("bookings_all")) || [];
  let currentFilter = "all";

  const todayStr = new Date().toISOString().split("T")[0];
  document.querySelector("#date").setAttribute("min", todayStr);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newBooking = {
      id: Date.now(),
      name: document.querySelector("#fullname").value,
      date: document.querySelector("#date").value,
      time: document.querySelector("#time").value,
      guests: document.querySelector("#guests").value,
      status: "Confirmed",
    };

    const conflict = bookings.find(
      (b) => b.date === newBooking.date && b.time === newBooking.time,
    );

    if (conflict) {
      alert("Allaqachon band qilingan!");
    } else {
      bookings.unshift(newBooking);
      saveAndRender();
      form.reset();
    }
  });

  window.removeBooking = (id) => {
    if (confirm("Rostdan ham o'chirmoqchimisiz?")) {
      bookings = bookings.filter((b) => b.id !== id);
      saveAndRender();
    }
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active-filter"));
      btn.classList.add("active-filter");

      currentFilter = btn.dataset.filter;
      render();
    });
  });

  function saveAndRender() {
    localStorage.setItem("bookings_all", JSON.stringify(bookings));
    render();
  }

  function render() {
    list.innerHTML = "";
    const now = new Date().toISOString().split("T")[0];

    const filtered = bookings.filter((b) => {
      if (currentFilter === "today") return b.date === now;
      if (currentFilter === "upcoming") return b.date > now;
      return true;
    });

    if (filtered.length === 0) {
      list.innerHTML = `<div class="empty-msg">Hozircha rezervatsiyalar yo'q</div>`;
      return;
    }

    filtered.forEach((b) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <div class="booking-card">
          <div class="card-header">
            <div class="avatar">${b.name.charAt(0)}</div>
            <div class="status-badge status-${b.status.toLowerCase()}">${b.status}</div>
          </div>
          
          <div class="card-body">
            <h3 class="client-name">${b.name}</h3>
            <div class="details">
              <div class="detail-item"><span>📅</span> ${b.date}</div>
              <div class="detail-item"><span>⌚</span> ${b.time}</div>
              <div class="detail-item"><span>👥</span> ${b.guests} kishi</div>
            </div>
          </div>

          <div class="card-footer">
            <button class="delete-btn" onclick="removeBooking(${b.id})">
              🗑️ O'chirish
            </button>
          </div>
        </div>`;
      list.appendChild(div);
    });
  }

  render();
});
