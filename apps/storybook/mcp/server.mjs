import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, resolve, sep } from "node:path";
import { Readable } from "node:stream";
import { createStorybookMcpHandler } from "@storybook/mcp";

const manifestsPath =
  process.env.STORYBOOK_MANIFESTS ?? "/var/www/storybook/manifests";
const port = Number(process.env.PORT ?? 13316);

function resolveManifestTarget(path) {
  const normalized = path.replace(/^\.?\//, "");
  if (normalized.startsWith("manifests/")) {
    return {
      base: manifestsPath,
      rel: normalized.slice("manifests/".length),
    };
  }

  return { base: dirname(manifestsPath), rel: normalized };
}

function resolveManifestFile(base, rel) {
  const resolvedBase = resolve(base);
  const resolved = resolve(resolvedBase, rel);
  if (resolved !== resolvedBase && !resolved.startsWith(resolvedBase + sep)) {
    throw new Error(`Refusing to read manifest outside base: ${rel}`);
  }
  return resolved;
}

const storybookMcpHandler = await createStorybookMcpHandler({
  manifestProvider: async (_request, path) => {
    const { base, rel } = resolveManifestTarget(path);
    return readFile(resolveManifestFile(base, rel), "utf8");
  },
});

function headerEntries(headers) {
  const entries = [];
  for (const [name, value] of Object.entries(headers)) {
    if (value === undefined) continue;
    entries.push([name, Array.isArray(value) ? value.join(", ") : value]);
  }
  return entries;
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    if (url.pathname !== "/mcp") {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    const request = new Request(url, {
      method: req.method,
      headers: headerEntries(req.headers),
      body: req.method === "GET" || req.method === "HEAD" ? undefined : body,
    });
    const response = await storybookMcpHandler(request);
    const headers = Object.fromEntries(response.headers.entries());
    res.writeHead(response.status, headers);
    if (!response.body) {
      res.end();
      return;
    }
    Readable.fromWeb(response.body).pipe(res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    }
    res.end("MCP request failed");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Storybook docs MCP listening on http://127.0.0.1:${port}/mcp`);
});
