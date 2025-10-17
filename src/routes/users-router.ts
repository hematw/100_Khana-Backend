import { Router } from "express";
import { getUser, updateUser } from "../controllers/users.ts";
import multer from "multer";

const storage = multer.diskStorage({
  filename(req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/profiles");
  },
});
const upload = multer({ storage });

const userRouter = Router();

// Route for updating profile
userRouter.patch(
  "/update",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  updateUser
);

// Route for get profile by id param
userRouter
  .route("/:id")
  .get(getUser)
  .patch(
    upload.fields([
      { name: "profile", maxCount: 1 },
      { name: "background", maxCount: 1 },
    ]),
    updateUser
  );

export default userRouter;
