import { Router } from "express";
import { getProperties, createProperty, getPropertyById, getMyProperties } from "../controllers/properties.ts";
import multer from "multer";
import fs from "fs";
import { trackPropertyView, trackPropertySaved } from "@/controllers/view-and-save-log.ts";

const propertyRouter = Router();

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

propertyRouter.get("/", getProperties);
propertyRouter.use((req, res, next) => {
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
propertyRouter.post("/", upload.array("images"), createProperty);  // Make sure "images" is the key
propertyRouter.get("/my-propertys", getMyProperties);
propertyRouter.get("/:id", getPropertyById);
propertyRouter.put("/:id/views", trackPropertyView);
propertyRouter.put("/:id/save", trackPropertySaved);

export default propertyRouter;
