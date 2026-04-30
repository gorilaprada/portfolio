import { serveDir } from "jsr:@std/http/file-server";
import { Octokit, App } from "https://esm.sh/octokit?dts";

Deno.serve((req) => {
  const pathname = new URL(req.url).pathname;

  if (pathname === "/api/repos") {
    return handleRepoRequest();
  }

  return serveDir(req, {
    fsRoot: "public",
    showDirListing: true,
    enableCors: true,
  });
});

async function handleRepoRequest() {
  const kv = await Deno.openKv();
  const entry = await kv.get(["repos"]);

  return new Response(JSON.stringify(entry.value || []), {
    headers: { "Content-Type": "application/json"}
  });
}

const GH_TOKEN = Deno.env.get("GH_TOKEN");

async function getReposAndWriteToKv() {
  const octokit = new Octokit({
    auth: GH_TOKEN,
  });

  const { data } = await octokit.request('GET /users/{username}/repos', {
    username: 'gorilaprada',
    headers: {
      'X-GitHub-Api-Version': '2026-03-10'
    }
  });

  const cleanedData = data.map(repo => ({
    name: repo.name,
    description: repo.description,
    language: repo.language,
    html_url: repo.html_url,
  }));

  const kv = await Deno.openKv();
  await kv.set(["repos"], cleanedData);
  console.log("Data synced to KV")
};


getReposAndWriteToKv();
