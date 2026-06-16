import pool from "../db/connection.js";

export const getAllStudents = async (page, limit) => {
  const offset = (page - 1) * limit;

  const studentsResult = await pool.query(
    `SELECT *
     FROM students
     ORDER BY id
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM students`
  );

  return {
    students: studentsResult.rows,
    totalRecords: parseInt(countResult.rows[0].count),
  };
};

export const createStudent = async (full_name, email, age) => {
  const result = await pool.query(
    `INSERT INTO students(full_name,email,age)
     VALUES($1,$2,$3)
     RETURNING *`,
    [full_name, email, age]
  );

  return result.rows[0];
};

export const getStudentById = async (id) => {
  const studentResult = await pool.query(
    `SELECT *
     FROM students
     WHERE id = $1`,
    [id]
  );

  if (studentResult.rows.length === 0) {
    return null;
  }

  const marksResult = await pool.query(
    `SELECT subject, marks
     FROM marks
     WHERE student_id = $1`,
    [id]
  );

  return {
    ...studentResult.rows[0],
    marks: marksResult.rows,
  };
};

export const updateStudent = async (
  id,
  full_name,
  email,
  age
) => {
  const result = await pool.query(
    `UPDATE students
     SET full_name = $1,
         email = $2,
         age = $3
     WHERE id = $4
     RETURNING *`,
    [full_name, email, age, id]
  );

  return result.rows[0];
};

export const deleteStudent = async (id) => {
  const result = await pool.query(
    `DELETE FROM students
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};

export const addMarks = async (
  studentId,
  subject,
  marks
) => {
  const result = await pool.query(
    `INSERT INTO marks(student_id, subject, marks)
     VALUES($1, $2, $3)
     RETURNING *`,
    [studentId, subject, marks]
  );

  return result.rows[0];
};