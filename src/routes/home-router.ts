import { Router } from "express";
import { getProperty, createProperty } from "../controllers/home";
import multer from "multer";

const homeRouter = Router();
const storage = multer.diskStorage({
  filename(req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/homes");
  },
});
const upload = multer({ storage });

homeRouter.get("/", getProperty);
homeRouter.post("/",upload.array("images"), createProperty);

export default homeRouter;
