const params = new URLSearchParams(window.location.search);
const lang = params.get("lang") || "vi";

const passportGrid = document.getElementById("passportGrid");

// THÊM ĐOẠN NÀY: Ra lệnh cho trình duyệt vẽ giao diện ngay khi load xong dữ liệu
document.addEventListener("DOMContentLoaded", () => {
    if (window.passportData) {
        renderPassport(window.passportData, lang);
    } else {
        console.error("Lỗi: Không nhận được passportData từ Astro");
    }
});

function renderPassport(places, lang) {
    passportGrid.innerHTML = "";
    for (const [id, place] of Object.entries(places)) {
        const cell = document.createElement("a");
        cell.classList.add("passport-cell");
        if (place.status === "available") {
            cell.href = `/station/${id}?lang=${lang}`;
            cell.innerHTML = `
                <strong>${place.name[lang]}</strong>
            `;
        } else {
            cell.classList.add("locked");
            cell.innerHTML = `
                <strong>${place.name[lang]}</strong>
                <small>COMING SOON</small>
                <span>🔒</span>
            `;
        }
        passportGrid.appendChild(cell);
    }
}