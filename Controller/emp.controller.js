const createError = require('http-errors');
const mongoose = require('mongoose');

const Empyployee = require('../Models/employee');

module.exports = {
  getEmployee: async (req, res, next) => {
    try {
      const results = await Empyployee.find({}, { __v: 0 });
      // const results = await Product.find({}, { name: 1, price: 1, _id: 0 });
      // const results = await Product.find({ price: 699 }, {});
      res.send(results);
    } catch (error) {
      console.log(error.message);
    }
  },

  createNewEmployee: async (req, res, next) => {
    try {
      const employee = new Empyployee(req.body);
      const result = await employee.save();
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error.name === 'ValidationError') {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  findEmployeeById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const employee = await Empyployee.findById(id);
      // const product = await Product.findOne({ _id: id });
      if (!employee) {
        throw createError(404, 'Employee does not exist.');
      }
      res.send(employee);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Employee id'));
        return;
      }
      next(error);
    }
  },

  updateAEmployee: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };

      const result = await Empyployee.findByIdAndUpdate(id, updates, options);
      if (!result) {
        throw createError(404, 'Employee does not exist');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        return next(createError(400, 'Invalid Employee Id'));
      }

      next(error);
    }
  },

  deleteAEmployee: async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await Empyployee.findByIdAndDelete(id);
      // console.log(result);
      if (!result) {
        throw createError(404, 'Employee does not exist.');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Employee id'));
        return;
      }
      next(error);
    }
  }
};