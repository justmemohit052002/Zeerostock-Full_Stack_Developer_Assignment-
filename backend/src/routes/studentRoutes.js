import express from "express";
import * as studentController from "../controllers/studentController.js";

const router = express.Router();

router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);

router.post("/", studentController.createStudent);

router.put("/:id", studentController.updateStudent);

router.delete("/:id", studentController.deleteStudent);

router.post("/:id/marks", studentController.addMarks);

router.put("/marks/:markId", studentController.updateMarks);
router.delete("/marks/:markId", studentController.deleteMarks);

export default router;