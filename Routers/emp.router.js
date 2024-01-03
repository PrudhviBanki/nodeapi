const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const conn = mongoose.connection;
let photoBucket;

const Empyployee = require('../Models/employee');
conn.once('open', () => {
  // Initialize the GridFS stream
  let db= mongoose.connections[0].db
  photoBucket = new  mongoose.mongo.GridFSBucket(db,{
    bucketName: 'photos',
  })
 
});


const EmployeeController = require('../Controller/emp.controller');
const { any } = require('../Middileware/upload');

//Get a list of all employees
router.get('/', EmployeeController.getEmployee);

//Create a new employee
router.post('/', EmployeeController.createNewEmployee);

//Get a product by id
router.get('/:id', EmployeeController.findEmployeeById);

//Update a employee by id
router.patch('/:id', EmployeeController.updateAEmployee);

//Delete a employee by id
router.delete('/:id', EmployeeController.deleteAEmployee);

// get emplyoee pic
router.get('/photos/:filename', async(req, res) => {
    const filename = req.params.filename;
    try {
    const photo = await Empyployee.findOne({ image: filename });
    console.log('Requested filename:', photo.image);
    res.set('Content-Type', 'image/png');
    const readstream = photoBucket.openDownloadStreamByName(filename); // Use openDownloadStreamByName to create a read stream
    readstream.on('error', (error) => {
        console.error('Error reading file from GridFS:', error);
        return res.status(404).json({ error: 'File not found' });
      });
      
      // Pipe the readstream to the response
      readstream.pipe(res);
    } catch (error) {
        // Handle any errors that occur during the query
        res.status(500).json({ error: 'Internal server error' });
      }
  });

module.exports = router;