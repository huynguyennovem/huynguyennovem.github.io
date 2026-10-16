const SITE_KEY = "__site__";
const MAX_PATH_LENGTH = 200;
const PATH_PATTERN = /^\/[A-Za-z0-9/_.-]*$/;

const json = (body, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

function normalizePath(raw) {
  if (!raw || raw.length > MAX_PATH_LENGTH || !PATH_PATTERN.test(raw) || raw.includes("..")) {
    return null;
  }
  const path = raw.replace(/index\.html$/, "");
  return path.endsWith("/") ? path : `${path}/`;
}

const increment = (db, path) =>
  db
    .prepare(
      "INSERT INTO visits (path, count) VALUES (?, 1) ON CONFLICT(path) DO UPDATE SET count = count + 1 RETURNING count"
    )
    .bind(path);

async function hit(db, path) {
  const [page, site] = await db.batch([increment(db, path), increment(db, SITE_KEY)]);
  return { page: page.results[0].count, site: site.results[0].count };
}

async function read(db, path) {
  const { results } = await db
    .prepare("SELECT path, count FROM visits WHERE path IN (?, ?)")
    .bind(path, SITE_KEY)
    .all();
  const counts = Object.fromEntries(results.map((row) => [row.path, row.count]));
  return { page: counts[path] ?? 0, site: counts[SITE_KEY] ?? 0 };
}

export default {
  async fetch(request, env) {
    const { searchParams } = new URL(request.url);
    const path = normalizePath(searchParams.get("path"));
    if (!path) return json({ error: "invalid path" }, 400);

    switch (request.method) {
      case "POST":
        return json(await hit(env.DB, path));
      case "GET":
        return json(await read(env.DB, path));
      default:
        return json({ error: "method not allowed" }, 405);
    }
  },
};
