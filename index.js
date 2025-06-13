import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { ErrorMiddleware } from "./middlewares/Error.js";
import course from "./routes/course.js";
import user from "./routes/user.js";
import admin from "./routes/admin.js";
import { connectDB } from "./config/database.js";

config({
  path: "./.env",
});

const app = express();

// Middleware
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://digital-world-with-vaishnavi-fronte-vert.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api", course);
app.use("/api", user);
app.use("/api", admin);

// Increase timeout for all routes
app.use((req, res, next) => {
  req.setTimeout(600000); // 10 minutes
  res.setTimeout(600000); // 10 minutes
  next();
});

// Error handling
app.use(ErrorMiddleware);

// Connect to database
connectDB();

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || 5000}`);
});
