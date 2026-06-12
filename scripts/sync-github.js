import { writeFile } from "fs/promises";

const USERNAME = "gorilaprada"
const TOKEN = process.env.GH_TOKEN;

if (!TOKEN) {
  console.error("Token not found");
  process.exit(1);
}

const headers = {
  'X-GitHub-Api-Version': '2026-03-10'
}
// ==========================
// Repos Info
// ==========================
const reposRes = await fetch(
  `https://api.github.com/users/${USERNAME}/repos`,
  { headers }
);

const repos = await reposRes.json();

 const cleanedRepos = 
   repos
     .filter((repo) => repo.archived === false)
     .map((repo) => ({
       name: repo.name,
       url: repo.html_url,
       description: repo.description,
       language: repo.language,
     }));

// ==========================
// Events Info
// ==========================
const eventsRes = await fetch(
  `https://api.github.com/users/${USERNAME}/events`,
  { headers }
);

const events = await eventsRes.json();

const cleanedEvents = 
  events
    .filter((event) => event.type === "PushEvent")
    .map((event) => ({
      is_public: event.public ? "public" : "private",
      repo: event.public ? event.repo.name : "super_secret_repo",
      date: event.created_at.slice(0, 10),
    }));

// ==========================
// Coding streak
// ==========================
const threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
const sinceDate = threeMonthsAgo.toISOString();

let allCommitDates = new Set();

for (const repo of repos) {
  try {
    const commitsRes = await fetch(
      `https://api.github.com/repos/${USERNAME}/${repo.name}/commits?since=${sinceDate}&author=${USERNAME}&per_page=100`,
      { headers }
    );
    const commits = await commitsRes.json();

    if (Array.isArray(commits)) {
      commits.forEach(commit => {
        const commitDate = commit.commit.author.date.slice(0, 10);
        allCommitDates.add(commitDate);
      });
    }
  } catch (err) {
    console.error(`Failed to fetch commits from ${repo.name}:`, err);
  }
}

const commitDays = [...allCommitDates].sort();
const totalDays = commitDays.length;

const streakInfo = {
  days: commitDays,
  threeMonthTracking: {
    active: totalDays,
    total: 90,
    percentage: Math.round((totalDays / 90) * 100),
  }
};

// ==========================
// Final Payload
// ==========================

const payload = {
  repos: cleanedRepos,
  events: cleanedEvents,
  codingStreak: streakInfo,
};

writeFile("./public/data.json", JSON.stringify(payload, null, 2));
