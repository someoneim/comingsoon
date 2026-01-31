import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Railway / proxy support
app.set("trust proxy", true);

app.use(
    cors({
        origin: [
            "https://app.example.com",
            "https://example.com"
            // TODO: Add your localhost or frontend URL here for development
        ],
        credentials: true
    })
);

// Health check
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// Serve Frontend (Monolith)
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from dist
app.use(express.static(path.join(__dirname, "../dist")));

// Catch-all route for SPA (React Router)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

export default app;
