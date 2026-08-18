const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { validateStudentInput } = require('../middleware/validation');

// POST /api/students - Register a new student
router.post('/', validateStudentInput, studentController.registerStudent);

// GET /api/students - Get all students
router.get('/', studentController.getAllStudents);

// GET /api/students/:id - Get student by ID or registration_id
router.get('/:id', studentController.getStudentById);

// PUT /api/students/:id - Update student by ID
router.put('/:id', validateStudentInput, studentController.updateStudent);

// DELETE /api/students/:id - Delete student by ID
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
