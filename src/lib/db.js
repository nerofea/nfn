import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // set this in your .env
});

// Get branding by streamId
export async function getBrandingByStreamId(streamId) {
  const res = await pool.query(
    `SELECT * FROM stream_branding WHERE stream_id = $1`,
    [streamId]
  );
  return res.rows[0] || null;
}

// Insert or update branding (safe for first-time or update use)
export async function upsertBranding(streamId, updates) {
  const { bg_url } = updates;
  await pool.query(
    `INSERT INTO stream_branding (stream_id, bg_img)
     VALUES ($1, $2)
     ON CONFLICT (stream_id)
     DO UPDATE SET bg_img = EXCLUDED.bg_img`,
    [streamId, bg_url]
  );
}
