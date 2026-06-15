//=====================
// Menu logic
//=====================
const menuView = document.getElementById("menu-view");
const contentView = document.getElementById("content-view");
const contentOutput = document.getElementById("content-output");
const backBtn = document.getElementById("back-btn");
const menuBtn = document.querySelectorAll(".menu-btn");

function showView(view) {
  menuView.style.display = "none";
  contentView.style.display = "none";
  view.style.display = "flex";

  if (view === contentView) {
    backBtn.classList.add("active");
  } else {
    backBtn.classList.remove("active");
    selectButton(0);
  }
}

menuBtn.forEach(btn => {
  btn.addEventListener("click", async () => {
    const option = btn.dataset.option;
    switch (option) {
      case "1":
        await typeWriterEffect(text_1, "output");
        showView(contentView);
        renderProjects();
        break;
      case "2":
        await typeWriterEffect(text_2, "output");
        showView(contentView);
        renderStreak();
        break;
      case "3":
        await typeWriterEffect(text_3, "output");
        showView(contentView);
        renderCard();
        break;
      default:
        return;
    }
  })
})

backBtn.addEventListener("click", () => {
  typeWriterEffect(text_0, "output");
  showView(menuView);
  contentOutput.innerHTML = "";
});

// Type Writer Effect
//=====================

const prefix = "guest@gorila:~$ "
const text_0 = "// welcome to the gorila terminal; select sequence to initialize"
const text_1 = "initializing project retrieval...";
const text_2 = "initializing coding streak retrieval..."
const text_3 = "initializing contact information retrieval..."
const speed = 50;


function typeWriterEffect(text, elementId, customPrefix = prefix) {
  return new Promise((resolve) => {
    let i = 0;
    let innerTyping = "";
    const element = document.getElementById(elementId);

    function type() {
      if ( i < text.length) {
        innerTyping += text[i];
        element.innerHTML = customPrefix + innerTyping + `<span class="cursor"></span>`;
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }

    type();
  });
};

typeWriterEffect(text_0, "output");

// Keyboard Navigation
//=====================

let selectedIndex = 0;

function selectButton(index) {
  menuBtn.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  selectedIndex = index;
}

function activateSelectedButton() {
  const buttons = document.querySelectorAll(".menu-btn:not(#back-btn)");
  if (selectedIndex < buttons.length) {
    buttons[selectedIndex].click();
  }
}

document.addEventListener("keydown", (e) => {
  const buttons = document.querySelectorAll(".menu-btn:not(#back-btn)");

  if (menuView.style.display !== "none") {
    switch (e.key) {
      case "1":
        e.preventDefault();
        buttons[0].click();
        break;
      case "2":
        e.preventDefault();
        buttons[1].click();
        break;
      case "3":
        e.preventDefault();
        buttons[2].click();
        break;
      case "ArrowDown":
      case "j":
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % buttons.length;
        selectButton(selectedIndex);
        break;
      case "ArrowUp":
      case "k":
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + buttons.length) % buttons.length;
        selectButton(selectedIndex);
        break;
      case "Enter":
        e.preventDefault();
        activateSelectedButton();
        break;
      default:
        break;
    }
  } else if (contentView.style.display !== "none") {
    switch (e.key) {
      case "ArrowDown":
      case "j":
        e.preventDefault();
        contentOutput.scrollTop += 20;
        break;
      case "ArrowUp":
      case "k":
        e.preventDefault();
        contentOutput.scrollTop -= 20;
        break;
      case "0":
      case "Enter":
      case "Escape":
        e.preventDefault();
        backBtn.click();
        break;
      default:
        break;
    }
  }
});

selectButton(0);

//=====================
// Fetch the JSON data and display the projects
//=====================

async function renderProjects() {

  const res = await fetch("data.json");
  const { repos } = await res.json();

  const divider = "-".repeat(48);
  
  const markup = repos.map(repo => `
<span class="proj-divider">${divider}</span>
<span class="proj-name"><strong>${repo.name}</strong></span>
<span class="proj-desc">${repo.description}</span>
<span class="proj-lang">lang  → ${repo.language}</span>
<span class="proj-url"><a href="${repo.url}" target="_blank">Link to repo</a></span>
`).join("\n");

  contentOutput.innerHTML = "";
  contentOutput.insertAdjacentHTML("beforeend", `<pre class="proj-output">${markup}</pre>`);
}

//=====================
// Fetch the JSON data and display coding streak
//=====================

async function renderStreak() {
  const res = await fetch("./data.json");
  const { codingStreak, events } = await res.json();

  const { percentage } = codingStreak.threeMonthTracking;
  const barLength = 40;
  const filled = Math.round((percentage / 100) * barLength);
  const empty = barLength - filled;

  const progressBar = `[${"█".repeat(filled)}${"░".repeat(empty)}] ${percentage}%`;

  const eventLog = events
    .map(event => `${event.date} → ${event.repo}`)
    .join("\n");

  const divider = "-".repeat(48);

  const markup = `
<div class="streak-container">
  <div class="streak-progress">
    <span class="streak-label"><strong>last 3-months commit %</strong></span>
    <span class="streak-bar">${progressBar}</span>
  </div>
  
  <div class="streak-divider">${divider}</div>

  <div class="streak-log">
    <span class="streak-log-label"><strong>recent commits</strong></span>
    <pre class="streak-events">${eventLog}</pre>
  </div>

  <div class="streak-divider">${divider}</div>

  <div class="streak-note">
    <p><strong>If I did not commit one day it is probably because I was on <a href="https://www.boot.dev/u/gorilaprada" target="_blank">boot.dev</a>. Check it out!</strong></p>
    <img src="https://api.boot.dev/v1/users/public/f30f42d3-9bc3-4a58-89d7-e4eea1cd6103/thumbnail" alt="boot.dev profile">
  </div>
</div>
`;

  contentOutput.innerHTML = "";
  contentOutput.insertAdjacentHTML("beforeend", markup);
}

//=====================
// Render Contact Card
//=====================


async function renderCard() {
  const markup = `
<div class="contact-card">
  <div class="contact-avatar">
    <img src="https://github.com/gorilaprada.png" alt="gorilaprada">
  </div>
  
  <h2 class="contact-name">Carlos Prada</h2>
  <p class="contact-title">Just a Dev</p>
  
  <div class="contact-divider">─────────────────────────────────</div>
  
  <div class="contact-links">
    <a href="https://github.com/gorilaprada" target="_blank" class="contact-link">
      <span class="contact-icon">→</span> GitHub
    </a>
    <a href="https://linkedin.com/in/gorilaprada" target="_blank" class="contact-link">
      <span class="contact-icon">→</span> LinkedIn
    </a>
    <a href="https://x.com/gorilaprada" target="_blank" class="contact-link">
      <span class="contact-icon">→</span> X (Twitter)
    </a>
    <a href="https://dev.to/gorilaprada" target="_blank" class="contact-link">
      <span class="contact-icon">→</span> Dev.to
    </a>
    <a href="https://discord.com/users/gorilaprada" target="_blank" class="contact-link">
      <span class="contact-icon">→</span> Discord
    </a>
  </div>
  
  <div class="contact-divider">─────────────────────────────────</div>
  
  <div class="contact-email">
    <p class="contact-email-label">fastest way to contact me</p>
    <a href="mailto:gorilaprada@gmail.com" class="contact-email-link">gorilaprada@gmail.com</a>
  </div>
</div>
`;
  
  contentOutput.innerHTML = "";
  contentOutput.insertAdjacentHTML("beforeend", markup);
}

//=====================
// ASCII ART
//=====================
const density = " .:-=+*#%@"; // Brightness map (left = dark, right = light)
const pre = document.getElementById("ascii");
const video = document.getElementById("videoSource");
const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });

video.play();

function render() {
  const cols = 100;
  const rows = 100 / 2;
  ctx.canvas.width = cols;
  ctx.canvas.height = rows;
  
  // 1. Draw your content (video, image, or shapes) to the hidden canvas
  ctx.drawImage(video, 0, 0, cols, rows);

  // 2. Sample pixels and map to ASCII
  const pixels = ctx.getImageData(0, 0, cols, rows).data;
  let ascii = "";
  for (let i = 0; i < pixels.length; i += 4) {
    const brightness = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3;
    ascii += density[Math.floor((brightness / 255) * (density.length - 1))];
    if ((i / 4 + 1) % cols === 0) ascii += "\n";
  }
  
  pre.textContent = ascii;
  requestAnimationFrame(render);
}

render();
