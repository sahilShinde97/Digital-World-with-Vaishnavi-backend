import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import {
  addLectures,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllStats,
  getAllUser,
  updateRole,
} from "../controllers/admin.js";
import uploadFiles from '../middlewares/multer.js';
import uploadToCloudinary from '../middlewares/cloudinaryUpload.js';

const router = express.Router();

// Course routes
router.post('/course/new', isAuth, isAdmin, uploadFiles.single('image'), uploadToCloudinary, createCourse);
router.post('/course/:id', isAuth, isAdmin, uploadFiles.single('video'), uploadToCloudinary, addLectures);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);

// Stats and user management routes
router.get("/stats", isAuth, isAdmin, getAllStats);
router.get("/users", isAuth, isAdmin, getAllUser);
router.put("/user/:id", isAuth, isAdmin, updateRole);

export default router;
