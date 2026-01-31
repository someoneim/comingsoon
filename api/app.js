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

// Health check (recommended)
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

export default app;
