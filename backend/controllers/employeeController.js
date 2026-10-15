import mongoose from 'mongoose';
import Employee from '../models/Employee.js';

// Regex for basic email format validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @desc    Create a new employee
 * @route   POST /api/employees
 * @access  Public
 */
export const createEmployee = async (req, res, next) => {
  try {
    const { name, email, designation } = req.body;

    // Validate presence of required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Employee name is required',
        field: 'name',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Employee email is required',
        field: 'email',
      });
    }

    if (!designation || !designation.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Employee designation is required',
        field: 'designation',
      });
    }

    // Validate email format
    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address format',
        field: 'email',
      });
    }

    // Reject duplicate email proactively
    const existingEmployee = await Employee.findOne({ email: trimmedEmail });
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: `An employee with the email '${trimmedEmail}' already exists`,
        field: 'email',
      });
    }

    // Create employee record
    const employee = await Employee.create({
      name: name.trim(),
      email: trimmedEmail,
      designation: designation.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all employees with pagination, search, and sorting
 * @route   GET /api/employees
 * @access  Public
 */
export const getEmployees = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
    const search = (req.query.search || '').trim();
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    // Allowed sort fields
    const validSortFields = ['name', 'email', 'designation', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    // Construct search filter
    const query = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { designation: searchRegex },
      ];
    }

    // Server-side counts and pagination
    const totalRecords = await Employee.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const skip = (page - 1) * limit;

    const employees = await Employee.find(query)
      .sort({ [sortField]: order })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalRecords,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get employee statistics (counts, designations)
 * @route   GET /api/employees/stats
 * @access  Public
 */
export const getEmployeeStats = async (req, res, next) => {
  try {
    const totalRecords = await Employee.countDocuments();
    const uniqueDesignations = await Employee.distinct('designation');
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCount = await Employee.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    return res.status(200).json({
      success: true,
      data: {
        totalEmployees: totalRecords,
        uniqueDesignationsCount: uniqueDesignations.length,
        recentEmployeesCount: recentCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single employee by MongoDB ID
 * @route   GET /api/employees/:id
 * @access  Public
 */
export const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid employee ID format: '${id}'`,
      });
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing employee
 * @route   PUT /api/employees/:id
 * @access  Public
 */
export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, designation } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid employee ID format: '${id}'`,
      });
    }

    // Validate fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Employee name is required',
        field: 'name',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Employee email is required',
        field: 'email',
      });
    }

    if (!designation || !designation.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Employee designation is required',
        field: 'designation',
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address format',
        field: 'email',
      });
    }

    // Check if another employee already has this email
    const duplicateEmailUser = await Employee.findOne({
      email: trimmedEmail,
      _id: { $ne: id },
    });

    if (duplicateEmailUser) {
      return res.status(409).json({
        success: false,
        message: `The email '${trimmedEmail}' is already assigned to another employee`,
        field: 'email',
      });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        email: trimmedEmail,
        designation: designation.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an employee by ID
 * @route   DELETE /api/employees/:id
 * @access  Public
 */
export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid employee ID format: '${id}'`,
      });
    }

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: { id: employee._id },
    });
  } catch (error) {
    next(error);
  }
};
