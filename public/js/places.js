const params = new URLSearchParams(window.location.search);
const lang = params.get("lang") || "vi";
let currentStationData = null;
let quizIndex = 0;

function selectLanguage(newLang) {
    params.set('lang', newLang);
    window.location.search = params.toString();
}

function openPassport() {
    window.location.href = `passport.html?lang=${lang}`;
}

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.toggle('open');
}

function applyTextTranslations(pageData, currentLang) {
    if (!pageData) return;

    document.querySelectorAll('[data-i18n]').forEach((node) => {
        const key = node.getAttribute('data-i18n');
        const translations = pageData[key];

        if (!translations) return;
        const text = translations[currentLang] || translations["vi"] || '';
        node.innerHTML = text;
    });
}

function applyPlaceTranslations(placeData, currentLang) {
    if (!placeData) return;

    document.querySelectorAll('.place').forEach((card) => {
        const placeKey = card.getAttribute('data-place-key');
        const place = placeData[placeKey];

        if (!place) return;

        const title = card.querySelector('h3');
        if (title && place.name && place.name[currentLang]) {
            title.textContent = place.name[currentLang];
        }

        const description = card.querySelector('p[data-i18n]');
        if (description && place.description && place.description[currentLang]) {
            description.innerHTML = place.description[currentLang];
        }
    });
}

function syncLanguageSelector(currentLang) {
    const select = document.querySelector('.nav-language');
    if (select) {
        select.value = currentLang;
    }
}

function loadTranslations() {
    syncLanguageSelector(lang);

    // Lấy data từ Astro, triệt tiêu hoàn toàn lỗi 404 trên Vercel
    if (window.stationData) {
        currentStationData = window.stationData;
        applyTextTranslations(currentStationData || {}, lang);
        applyPlaceTranslations(currentStationData, lang);
        renderQuiz(); 
    } else {
        console.warn('Could not load station data.');
    }
}

function renderQuiz() {
    if (!currentStationData || !currentStationData.quiz) return;

    const list = currentStationData.quiz[lang]; 
    const q = list[quizIndex];
    if (!q) return;

    document.getElementById("progress").textContent = `QUESTION ${quizIndex + 1} / ${list.length}`;
    document.getElementById("question").textContent = q.q;

    const answersBox = document.getElementById("answers");
    answersBox.innerHTML = "";
    document.getElementById("quizMessage").textContent = "";

    q.a.forEach((answerText, index) => {
        const button = document.createElement("button");
        button.className = "answer";
        button.textContent = answerText;
        button.onclick = () => checkAnswer(index, button);
        answersBox.appendChild(button);
    });
}

/* HÀM KIỂM TRA ĐÁP ÁN */
function checkAnswer(selectedIndex, buttonElement) {
    const list = currentStationData.quiz[lang];
    const q = list[quizIndex];
    const allButtons = document.querySelectorAll(".answer");

    if (selectedIndex === q.correct) {
        buttonElement.classList.add("correct");
        allButtons.forEach(b => b.disabled = true);

        document.getElementById("quizMessage").textContent = 
            lang === "vi" ? "✨ CHÍNH XÁC!" : (lang === "en" ? "✨ CORRECT!" : "✨ ПРАВИЛЬНО!");

        setTimeout(() => {
            quizIndex++;
            if (quizIndex >= list.length) {
                // Lấy ID và Tên trạm trực tiếp từ JSON, hoàn toàn không hardcode!
                const id = currentStationData.stationId;
                const name = currentStationData.stationName[lang];
                completeStation(id, name); 
            } else {
                renderQuiz();
            }
        }, 900);
    } else {
        buttonElement.classList.add("wrong");
        document.getElementById("quizMessage").textContent = 
            lang === "vi" ? "❌ Chưa chính xác!" : (lang === "en" ? "❌ Not quite!" : "❌ Неправильно!");

        setTimeout(() => {
            buttonElement.classList.remove("wrong");
            document.getElementById("quizMessage").textContent = "";
        }, 700);
    }
}

function completeStation(stationId, stationName) {
    // 1. Lưu trạng thái với key động (vd: hanoiCompleted, thai-nguyenCompleted)
    localStorage.setItem(`${stationId}Completed`, "true");

    // 2. Cập nhật text động cho thông báo và con dấu
    document.getElementById("completedTitle").textContent = `🎉 ${stationName.toUpperCase()} STATION COMPLETED!`;
    document.getElementById("stampStationName").textContent = `${stationName.toUpperCase()} STATION`;

    // 3. Gọi chuỗi Animation (Giữ nguyên như cũ)
    document.getElementById("stampAnimation").classList.add("show");
    
    setTimeout(() => {
        document.getElementById("stamp").classList.add("show");
    }, 100);

    setTimeout(() => {
        document.getElementById("stampAnimation").classList.remove("show");
        document.getElementById("stamp").classList.remove("show");
        
        const completedSection = document.getElementById("completed");
        completedSection.classList.add("show");
        completedSection.scrollIntoView({ behavior: "smooth" });
    }, 2300);
}

window.addEventListener('DOMContentLoaded', function () {
    renderQuiz();
    loadTranslations();
});