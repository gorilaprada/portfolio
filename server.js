import { serveDir } from "jsr:@std/http/file-server";
import { Octokit, App } from "https://esm.sh/octokit?dts";
import { fromFileUrl, join, dirname } from "jsr:@std/path";

const __dirname = dirname(fromFileUrl(import.meta.url));
const PUBLIC_ROOT = join(__dirname, "public");
const kv = await Deno.openKv();
const GH_TOKEN = Deno.env.get("GH_TOKEN");

Deno.serve((req) => {
  const pathname = new URL(req.url).pathname;

  if (pathname === "/api/repos") {
    return handleRepoRequest();
  }

  return serveDir(req, {
    fsRoot: PUBLIC_ROOT,
    showDirListing: true,
    enableCors: true,
    headers: [
      "Cache-Control: no-cache, no-store, must-revalidate",
      "Pragma: no-cache",
      "Expires: 0",
    ],
  });
});

async function handleRepoRequest() {
  const entry = await kv.get(["repos"]);

  return new Response(JSON.stringify(entry.value || []), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    }
  });
}


async function getReposAndWriteToKv() {
  if (!GH_TOKEN) {
    console.error("GH_TOKEN not found");
    return;
  }

  const octokit = new Octokit({ auth: GH_TOKEN });

  try{
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

  await kv.set(["repos"], cleanedData);
  console.log("Data synced to KV")
  } catch (err) {
    console.error("Failed to fetch GH repos:", err);
  }
};


getReposAndWriteToKv();
