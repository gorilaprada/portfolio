import { serveDir } from "jsr:@std/http/file-server";

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
