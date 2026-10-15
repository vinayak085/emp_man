import express from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployeeStats,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';

const router = express.Router();

// Stats route must be defined before /:id to avoid ID conflict
router.get('/stats', getEmployeeStats);

// Main collection routes
router.route('/')
  .post(createEmployee)
  .get(getEmployees);

// Individual employee routes by ID
router.route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;
