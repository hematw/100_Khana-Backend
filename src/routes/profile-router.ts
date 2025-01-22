import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile";
import multer from "multer";

const storage = multer.diskStorage({
  filename(req, file, cb) {
    cb(null, Date.now()+ "_" + file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/profiles");
  },
});
const upload = multer({ storage });

const profileRouter = Router();

// Route for updating profile
profileRouter.patch("/update", upload.single("profileImage"), updateProfile);

// Route for get profile by id param
profileRouter.get("/:id", getProfile);

export default profileRouter;
