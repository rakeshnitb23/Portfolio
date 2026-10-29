#!/usr/bin/env node
// Verifies every route in the sitemap is crawlable without JS: spawns `next start`,
// polls until it responds, fetches each route's raw HTML, and asserts a distinctive
// string (from content frontmatter, or a defined expectation for non-content pages)
// appears in the response body. Exits non-zero on any failure.
//
// Every HTML page must also put its canonical tag on the production domain, and
// no response may mention the old placeholder domain.
//
// Usage: npm run build && npm run verify   (verify spawns and tears down its own server)

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const PORT = process.env.VERIFY_PORT || "4173";
const BASE_URL = `http://localhost:${PORT}`;
const MAX_WAIT_MS = 60_000;
// Must match the fallback in src/lib/site.ts.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lazymonk.si";
const STALE_DOMAINS = ["rakeshsingh.dev"];

function readCollection(dir) {
  const full = path.join(ROOT, "content", dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(full, f), "utf8");
      const { data } = matter(raw);
      return { slug, frontmatter: data };
    });
}

async function waitForServer() {
  const start = Date.now();
  while (Date.now() - start < MAX_WAIT_MS) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok || res.status < 500) return true;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not respond within ${MAX_WAIT_MS}ms`);
}

function buildChecks() {
  const checks = [];

  checks.push({ path: "/", expect: "Rakesh Singh" });
  checks.push({ path: "/about", expect: "B.Tech in Computer Science" });
  checks.push({ path: "/resume", expect: "Download PDF" });
  checks.push({ path: "/blogs", expect: "Blogs" });
  checks.push({ path: "/projects", expect: "production-minded systems" });
  checks.push({ path: "/personal-writing", expect: "skills I’m learning" });
  checks.push({ path: "/contact", expect: "Rakesh" });

  for (const p of readCollection("projects")) {
    checks.push({
      path: `/projects/${p.slug}`,
      expect: p.frontmatter.summary,
    });
  }
  for (const p of readCollection("personal")) {
    if (p.frontmatter.placeholder || !p.frontmatter.date) continue;
    checks.push({
      path: `/personal-writing/${p.slug}`,
      expect: p.frontmatter.title,
    });
  }

  checks.push({ path: "/robots.txt", expect: "GPTBot" });
  checks.push({ path: "/sitemap.xml", expect: "<urlset" });
  checks.push({ path: "/llms.txt", expect: "Rakesh Singh" });
  checks.push({ path: "/opengraph-image", expect: "PNG" });

  return checks;
}

async function runChecks() {
  const checks = buildChecks();
  const failures = [];

  for (const { path: routePath, expect } of checks) {
    try {
      const res = await fetch(`${BASE_URL}${routePath}`);
      const body = await res.text();
      if (!res.ok) {
        failures.push(`${routePath}: HTTP ${res.status}`);
        continue;
      }
      const stale = STALE_DOMAINS.find((d) => body.includes(d));
      if (stale) {
        failures.push(`${routePath}: mentions the old domain ${stale}`);
        continue;
      }
      const canonical = body.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
      if (body.includes("<html") && !canonical?.startsWith(SITE_URL)) {
        failures.push(`${routePath}: canonical ${canonical ?? "(none)"} is not on ${SITE_URL}`);
        continue;
      }
      if (!body.includes(expect)) {
        failures.push(
          `${routePath}: missing expected string ${JSON.stringify(
            expect.slice(0, 60)
          )}`
        );
      } else {
        console.log(`[verify-crawlable] OK   ${routePath}`);
      }
    } catch (err) {
      failures.push(`${routePath}: request failed (${err.message})`);
    }
  }

  return failures;
}

async function main() {
  console.log(`[verify-crawlable] starting \`next start\` on port ${PORT}...`);
  // Run Next directly (not via npx) in its own process group, so cleanup can stop
  // the server and everything it forks. On Linux, killing npx alone left the
  // server running with our pipes open, and the script never exited.
  const server = spawn(path.join(ROOT, "node_modules", ".bin", "next"), ["start", "-p", PORT], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env },
    detached: true,
  });

  let serverOutput = "";
  server.stdout.on("data", (d) => (serverOutput += d.toString()));
  server.stderr.on("data", (d) => (serverOutput += d.toString()));

  const cleanup = () => {
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {
      // already gone
    }
  };

  process.on("exit", cleanup);
  process.on("SIGINT", () => {
    cleanup();
    process.exit(1);
  });

  try {
    await waitForServer();
    const failures = await runChecks();

    if (failures.length > 0) {
      console.error("\n[verify-crawlable] FAILED:\n");
      for (const f of failures) console.error(`  - ${f}`);
      process.exitCode = 1;
    } else {
      console.log("\n[verify-crawlable] All routes crawlable. ✔");
      process.exitCode = 0;
    }
  } catch (err) {
    console.error("[verify-crawlable] error:", err.message);
    console.error(serverOutput);
    process.exitCode = 1;
  } finally {
    cleanup();
    // Don't wait on the server's pipes to close; exit with the result now.
    process.exit(process.exitCode);
  }
}

main();
