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

/**
 * @swagger
 * /api/v1/users/update:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file
 *               background:
 *                 type: string
 *                 format: binary
 *                 description: Background picture file
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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
