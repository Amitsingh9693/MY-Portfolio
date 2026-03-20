import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Route for LeetCode Stats (Backend Proxy to avoid CORS)
  app.get("/api/leetcode/:username", async (req, res) => {
    const { username } = req.params;
    try {
      // Fetch from multiple sources to be robust
      // 1. Basic stats from leetcode-stats-api
      const basicRes = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
      const basicData = await basicRes.json();
      
      // 2. Contest stats from alfa-leetcode-api
      let contestData = null;
      try {
        const contestRes = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/contest`);
        if (contestRes.ok) contestData = await contestRes.json();
      } catch (e) {
        console.warn("Contest API failed for", username);
      }

      // 3. Calendar stats for streak calculation
      let calendarData = null;
      try {
        const calendarRes = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar`);
        if (calendarRes.ok) calendarData = await calendarRes.json();
      } catch (e) {
        console.warn("Calendar API failed for", username);
      }

      res.json({
        basic: basicData,
        contest: contestData,
        calendar: calendarData
      });
    } catch (error) {
      console.error("Error fetching LeetCode stats:", error);
      res.status(500).json({ error: "Failed to fetch LeetCode stats" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
