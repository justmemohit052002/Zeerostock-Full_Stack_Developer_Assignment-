import pool from "../db/connection.js";

export const getAllStudents = async (
  page,
  limit,
  search = ""
) => {
  const offset = (page - 1) * limit;

  let query = `SELECT * FROM students`;
  let countQuery = `SELECT COUNT(*) FROM students`;
  const params = [];

  if (search) {
    query += `
      WHERE full_name ILIKE $1
      OR email ILIKE $1
    `;

    countQuery += `
      WHERE full_name ILIKE $1
      OR email ILIKE $1
    `;

    params.push(`%${search}%`);
  }

  query += `
    ORDER BY id
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2}
  `;

  const studentsResult = await pool.query(
    query,
    [...params, limit, offset]
  );

  const countResult = await pool.query(
    countQuery,
    params
  );

  return {
    students: studentsResult.rows,
    totalRecords: parseInt(
      countResult.rows[0].count
    ),
  };
};

export const createStudent = async (
  full_name,
  email,
  age
) => {
  const result = await pool.query(
    `
    INSERT INTO students(
      full_name,
      email,
      age
    )
    VALUES($1,$2,$3)
    RETURNING *
    `,
    [full_name, email, age]
  );

  return result.rows[0];
};

export const getStudentById = async (id) => {
  const studentResult = await pool.query(
    `
    SELECT *
    FROM students
    WHERE id = $1
    `,
    [id]
  );

  if (studentResult.rows.length === 0) {
    return null;
  }

  const marksResult = await pool.query(
    `
    SELECT
      id,
      subject,
      marks
    FROM marks
    WHERE student_id = $1
    `,
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
    `
    UPDATE students
    SET
      full_name = $1,
      email = $2,
      age = $3
    WHERE id = $4
    RETURNING *
    `,
    [full_name, email, age, id]
  );

  return result.rows[0];
};

export const deleteStudent = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM students
    WHERE id = $1
    RETURNING *
    `,
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
    `
    INSERT INTO marks(
      student_id,
      subject,
      marks
    )
    VALUES($1,$2,$3)
    RETURNING *
    `,
    [studentId, subject, marks]
  );

  return result.rows[0];
};

export const updateMarks = async (
  markId,
  subject,
  marks
) => {
  const result = await pool.query(
    `
    UPDATE marks
    SET
      subject = $1,
      marks = $2
    WHERE id = $3
    RETURNING *
    `,
    [subject, marks, markId]
  );

  return result.rows[0];
};

export const deleteMarks = async (
  markId
) => {
  const result = await pool.query(
    `
    DELETE FROM marks
    WHERE id = $1
    RETURNING *
    `,
    [markId]
  );

  return result.rows[0];
};

