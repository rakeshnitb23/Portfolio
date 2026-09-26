#!/usr/bin/env node
// Verifies every route in the sitemap is crawlable without JS: spawns `next start`,
// polls until it responds, fetches each route's raw HTML, and asserts a distinctive
// string (from content frontmatter, or a defined expectation for non-content pages)
// appears in the response body. Exits non-zero on any failure.
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
  checks.push({ path: "/about", expect: "Bachelor of Technology" });
  checks.push({ path: "/projects", expect: "production-minded systems" });
  checks.push({ path: "/writing", expect: "retrieval, reliability" });
  checks.push({ path: "/contact", expect: "Rakesh" });

  for (const p of readCollection("projects")) {
    checks.push({
      path: `/projects/${p.slug}`,
      expect: p.frontmatter.summary,
    });
  }
  for (const p of readCollection("writing")) {
    checks.push({
      path: `/writing/${p.slug}`,
      expect: p.frontmatter.summary,
    });
  }

  checks.push({ path: "/robots.txt", expect: "GPTBot" });
  checks.push({ path: "/sitemap.xml", expect: "<urlset" });
  checks.push({ path: "/llms.txt", expect: "Rakesh Singh" });

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
  const server = spawn("npx", ["next", "start", "-p", PORT], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env },
  });

  let serverOutput = "";
  server.stdout.on("data", (d) => (serverOutput += d.toString()));
  server.stderr.on("data", (d) => (serverOutput += d.toString()));

  const cleanup = () => {
    server.kill("SIGTERM");
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
  }
}

main();
