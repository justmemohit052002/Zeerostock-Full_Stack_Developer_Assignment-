import * as studentService from "../services/studentService.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getAllStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be greater than 0",
      });
    }

    const result = await studentService.getAllStudents(
      page,
      limit
    );

    const totalPages = Math.ceil(
      result.totalRecords / limit
    );

    res.status(200).json({
      success: true,
      data: result.students,
      pagination: {
        totalRecords: result.totalRecords,
        currentPage: page,
        totalPages,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student id",
      });
    }

    const student = await studentService.getStudentById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    const { full_name, email, age } = req.body;

    const fullName = full_name?.trim();
    const userEmail = email?.trim();

    if (!fullName || !userEmail || age === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (age <= 0) {
      return res.status(400).json({
        success: false,
        message: "Age must be greater than 0",
      });
    }

    const student = await studentService.createStudent(
      fullName,
      userEmail,
      age
    );

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, email, age } = req.body;

    const fullName = full_name?.trim();
    const userEmail = email?.trim();

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student id",
      });
    }

    if (!fullName || !userEmail || age === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (age <= 0) {
      return res.status(400).json({
        success: false,
        message: "Age must be greater than 0",
      });
    }

    const student = await studentService.updateStudent(
      id,
      fullName,
      userEmail,
      age
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student id",
      });
    }

    const student = await studentService.deleteStudent(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

export const addMarks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject, marks } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student id",
      });
    }

    if (!subject || marks === undefined) {
      return res.status(400).json({
        success: false,
        message: "Subject and marks are required",
      });
    }

    if (isNaN(marks)) {
      return res.status(400).json({
        success: false,
        message: "Marks must be a number",
      });
    }

    if (marks < 0 || marks > 100) {
      return res.status(400).json({
        success: false,
        message: "Marks must be between 0 and 100",
      });
    }

    const student = await studentService.getStudentById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const result = await studentService.addMarks(
      id,
      subject.trim(),
      marks
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};