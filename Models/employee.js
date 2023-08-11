const mangose =require('mongoose')
const Schema = mangose.Schema;

const EmpyployeeSchema = new Schema({
    name:String,
    role:String,
    age:Number,
    dateofjoin:String,
    image:String
})

const Empyployee = mangose.model('employee',EmpyployeeSchema);

module.exports=Empyployee;