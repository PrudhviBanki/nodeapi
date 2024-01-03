const express = require('express');
const createError = require('http-errors');
const dotenv = require('dotenv').config();

const upload = require('../Middileware/upload');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Initialize DB
require('../config')();



const Empyployee = require('../Models/employee');
const EmployeeRoute = require('../Routers/emp.router');

app.use('/employees', EmployeeRoute);

app.post('/upload/:id', upload.single("file"), async (req, res) => {
    if (req.file === undefined) return res.send("you must select a file.");
    const imgUrl = req.file.filename;
    try {
        const id = req.params.id;
        const options = { new: true };
        const result = await Empyployee.findByIdAndUpdate(id,  { $set: { image: imgUrl } }, options);
        if (!result) {
          throw createError(404, 'Employee does not exist');
        }
        res.send(result);
      } catch (error) {
        console.log(error.message);
        next(createError(404, 'Not found'));
      }
});
//404 handler and pass to error handler
app.use((req, res, next) => {
  next(createError(404, 'Not found'));
});

//Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});

const PORT =dotenv.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT + '...');
});