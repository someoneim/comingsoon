import app from "./app.js";
import connectDB from "./db.js";
import dotenv from "dotenv";

// Load env vars if in local development
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server live on port ${PORT}`);
});
