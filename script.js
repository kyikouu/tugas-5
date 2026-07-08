(function () {
  "use strict";

  /* ===== Data karier =====
     Setiap karier punya bobot poin per minat (0-3).
     Skor akhir = total bobot dari minat yang dipilih, lalu
     diubah jadi persentase terhadap skor maksimum karier itu. */
  const CAREERS = [
    {
      id: "frontend",
      name: "Frontend Developer",
      emoji: "💻",
      color: "var(--career-frontend)",
      weights: { desain: 2, coding: 3, matematika: 1, bisnis: 1 },
      salary: "Rp 6 jt – 20 jt+ /bulan (junior–mid)",
      skills: ["HTML/CSS/JS", "React / Vue", "Git & GitHub", "Responsive Design", "REST API"],
      roadmap: [
        "Kuasai HTML, CSS, dan JavaScript dasar",
        "Pelajari salah satu framework (React/Vue)",
        "Bangun 3–5 project portofolio, unggah ke GitHub",
        "Magang atau lamar posisi junior frontend"
      ]
    },
    {
      id: "data",
      name: "Data Scientist",
      emoji: "📊",
      color: "var(--career-data)",
      weights: { desain: 0, coding: 2, matematika: 3, bisnis: 1 },
      salary: "Rp 8 jt – 30 jt+ /bulan (junior–mid)",
      skills: ["Python", "Statistik & Probabilitas", "Machine Learning", "SQL", "Pandas/NumPy"],
      roadmap: [
        "Perkuat matematika, statistik, dan Python",
        "Pelajari library data (Pandas, NumPy, scikit-learn)",
        "Kerjakan project analisis data nyata (mis. lewat Kaggle)",
        "Magang sebagai data analyst, lalu naik ke data scientist"
      ]
    },
    {
      id: "ui",
      name: "UI Designer",
      emoji: "🎨",
      color: "var(--career-ui)",
      weights: { desain: 3, coding: 1, matematika: 0, bisnis: 1 },
      salary: "Rp 6 jt – 18 jt+ /bulan (junior–mid)",
      skills: ["Figma", "Design Thinking", "Wireframing", "Riset Pengguna", "Tipografi & Warna"],
      roadmap: [
        "Pelajari prinsip desain dan tools seperti Figma",
        "Pahami riset pengguna dan UX writing dasar",
        "Bangun portofolio berisi 3–4 studi kasus desain",
        "Magang atau lamar posisi junior UI/UX designer"
      ]
    },
    {
      id: "game",
      name: "Game Developer",
      emoji: "🎮",
      color: "var(--career-game)",
      weights: { desain: 2, coding: 2, matematika: 2, bisnis: 0 },
      salary: "Rp 6 jt – 18 jt+ /bulan (junior–mid)",
      skills: ["C# / C++", "Unity / Unreal Engine", "Matematika & Fisika Game", "Level Design", "Version Control"],
      roadmap: [
        "Belajar dasar pemrograman (C#/C++) dan logika matematika",
        "Kuasai satu game engine (Unity atau Unreal)",
        "Buat beberapa game kecil sebagai portofolio",
        "Gabung studio indie atau lamar posisi junior game developer"
      ]
    }
  ];

  const INTERESTS = ["desain", "coding", "matematika", "bisnis"];

  const selected = new Set();

  const interestButtons = document.querySelectorAll(".interest-btn");
  const findBtn = document.getElementById("findBtn");
  const resetBtn = document.getElementById("resetBtn");
  const placeholder = document.getElementById("placeholder");
  const resultsHead = document.getElementById("resultsHead");
  const careerList = document.getElementById("careerList");
  const starField = document.getElementById("starField");

  function toggleInterest(btn) {
    const key = btn.dataset.interest;
    if (selected.has(key)) {
      selected.delete(key);
      btn.classList.remove("active");
    } else {
      selected.add(key);
      btn.classList.add("active");
    }
    findBtn.disabled = selected.size === 0;
  }

  function computeMatches() {
    return CAREERS.map((career) => {
      let score = 0;
      let maxScore = 0;
      INTERESTS.forEach((interest) => {
        maxScore += career.weights[interest];
        if (selected.has(interest)) score += career.weights[interest];
      });
      const maxPossibleFromSelection = Array.from(selected).reduce(
        (sum, i) => sum + 3, 0
      );
      const percent = maxPossibleFromSelection > 0
        ? Math.round((score / maxPossibleFromSelection) * 100)
        : 0;
      return { career, percent: Math.min(percent, 100) };
    }).sort((a, b) => b.percent - a.percent);
  }

  function animateRing(ringEl, target, delay = 0) {
    const span = ringEl.querySelector("span");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      ringEl.style.background = `conic-gradient(var(--career-color) ${target}%, rgba(255,255,255,.08) 0)`;
      span.textContent = `${target}%`;
      return;
    }

    setTimeout(() => {
      const duration = 900;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        ringEl.style.background = `conic-gradient(var(--career-color) ${current}%, rgba(255,255,255,.08) 0)`;
        span.textContent = `${current}%`;

        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }, delay);
  }

  function renderResults() {
    const matches = computeMatches();
    careerList.innerHTML = "";

    matches.forEach((match, index) => {
      const { career, percent } = match;
      const card = document.createElement("article");
      card.className = "career-card" + (index === 0 ? " rank-1" : "");
      card.style.setProperty("--career-color", career.color);
      card.style.animationDelay = `${index * 0.08}s`;

      const skillTags = career.skills
        .map((s) => `<span class="skill-tag">${s}</span>`)
        .join("");

      const roadmapItems = career.roadmap
        .map((step, i) => `<li><span class="step-num">${i + 1}.</span><span>${step}</span></li>`)
        .join("");

      card.innerHTML = `
        <span class="rank-tag">${index === 0 ? "⭐ MATCH TERBAIK" : `#${index + 1} MATCH`}</span>
        <div class="match-ring" data-target="${percent}" style="background: conic-gradient(var(--career-color) 0%, rgba(255,255,255,.08) 0)">
          <span>0%</span>
        </div>
        <div class="career-body">
          <h3>${career.emoji} ${career.name}</h3>
          <p class="career-salary">💰 ${career.salary}</p>
          <div class="career-block">
            <h4>Skill utama</h4>
            <div class="skill-tags">${skillTags}</div>
          </div>
          <div class="career-block">
            <h4>Roadmap belajar</h4>
            <ol class="roadmap">${roadmapItems}</ol>
          </div>
        </div>
      `;

      careerList.appendChild(card);
      animateRing(card.querySelector(".match-ring"), percent, index * 90);
    });

    placeholder.hidden = true;
    resultsHead.hidden = false;
  }

  function resetAll() {
    selected.clear();
    interestButtons.forEach((btn) => btn.classList.remove("active"));
    findBtn.disabled = true;
    careerList.innerHTML = "";
    resultsHead.hidden = true;
    placeholder.hidden = false;
  }

  function createStarField() {
    const count = 70;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const star = document.createElement("span");
      star.className = "star";
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDuration = `${2 + Math.random() * 3}s`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      frag.appendChild(star);
    }
    starField.appendChild(frag);
  }

  function initParallax() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;

    document.addEventListener("mousemove", (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 16;
        const y = (e.clientY / window.innerHeight - 0.5) * 16;
        starField.style.transform = `translate(${x}px, ${y}px)`;
        ticking = false;
      });
    });
  }

  function init() {
    createStarField();
    initParallax();

    interestButtons.forEach((btn) => {
      btn.addEventListener("click", () => toggleInterest(btn));
    });

    findBtn.addEventListener("click", () => {
      if (selected.size === 0) return;
      renderResults();
      document.getElementById("resultsSection").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    resetBtn.addEventListener("click", resetAll);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
