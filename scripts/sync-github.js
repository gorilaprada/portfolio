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
      data: event.created_at.slice(0, 10),
    }));

const payload = {
  repos: cleanedRepos,
  events: cleanedEvents,
};

writeFile("/tmp/data.json", JSON.stringify(payload, null, 2));
