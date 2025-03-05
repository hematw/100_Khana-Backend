import { Router } from "express";
import { getProperty, createProperty } from "../controllers/properties";
import multer from "multer";
import fs from "fs";

const homeRouter = Router();

// Ensure the upload directory exists
const uploadDir = "./public/uploads/properties";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Initialize Multer Middleware
const upload = multer({ storage });

homeRouter.get("/", getProperty);
homeRouter.use((req, res, next) => {
  // Convert fields like 'category[0]', 'category[1]' into an array
  for (const key in req.body) {
    if (key.includes("[")) {
      const newKey = key.split("[")[0];
      if (!req.body[newKey]) {
        req.body[newKey] = [];
      }
      req.body[newKey].push(req.body[key]);
      delete req.body[key];
    }
  }
  next();
});
homeRouter.post("/", upload.array("images"), createProperty);  // Make sure "images" is the key

export default homeRouter;
