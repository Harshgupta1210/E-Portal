const path = require('path');
const Register = require('../model/register');
const Lawyer = require('../model/lawyer');
const CaseForm = require('../model/case');
const Complaint = require('../model/complaint')
const Document = require('../model/document')
const { exec } = require('child_process');
const Otp = require('../model/otp');
module.exports.register = function(req,res){
    
    const filePath = path.join(__dirname, 'lawyer', 'register.html'); // Path to your index.html file
    res.sendFile(filePath);
}
module.exports.logging = (req,res)=>{
    const filePath = path.join(__dirname, 'lawyer', 'login.html'); // Path to your index.html file
    res.sendFile(filePath);
}
module.exports.number = (req,res)=>{
  const filePath = path.join(__dirname, 'lawyer', 'bar_no.html'); // Path to your index.html file
  res.sendFile(filePath);
}
module.exports.complaint = (req,res)=>{
  const filePath = path.join(__dirname, 'lawyer', 'complaint.html'); // Path to your index.html file
    res.sendFile(filePath);
}
module.exports.document = (req,res)=>{
  const filePath = path.join(__dirname, 'lawyer', 'document.html'); // Path to your index.html file
    res.sendFile(filePath);
}
module.exports.meeting = (req,res)=>{
  const filepath = path.join(__dirname,'Video Conference','room.html');
  res.sendFile(filepath);
}
module.exports.lobby = (req,res)=>{
  const filePath = path.join(__dirname,'Video Conference','lobby.html'); // Path to your index.html file
  res.sendFile(filePath);
}
module.exports.email = (req,res)=>{
  const filePath = path.join(__dirname,'lawyer','forget_password.html');
  res.sendFile(filePath)
}
module.exports.new_password = (req,res)=>{
  const filePath = path.join(__dirname,'lawyer','new_password.html');
  res.sendFile(filePath)
}

module.exports.numbers = (req,res)=>{
  const dataToSave =  {
    name:req.body.name,
    dob:req.body.dob,
    gender:req.body.gender,
    state:req.body.state,
    bar_association_no:req.body.bar_association_no
}
Lawyer.create(dataToSave)
    .then(() => {
      res.redirect('back'); // Redirecting after successful insertion
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error saving lawyer data', error: error.message });
    });
}

module.exports.lawyer_register = async (req, res) => {
	const { email, bar_association_no, name } = req.body;
  
	try {
	  // Log the received bar_association_no
	  console.log("Received Bar Association No:", bar_association_no);
  
	  // Check if the user is already registered as a lawyer
	  const existingLawyer = await Register.findOne({ email }).exec();
	  const existingBarNo = await Lawyer.findOne({ bar_association_no }).exec();
  
	  console.log("Existing Bar No:", existingBarNo);
  
	  // If no matching bar_association_no is found, return an error
	  if (!existingBarNo) {
		return res.status(400).json({ message: 'Bar association number not found' });
	  }
  
	  // Compare the names and bar_association_no
	  const lowerName = name.toLowerCase();
	  if (existingBarNo.bar_association_no === bar_association_no && existingBarNo.name.toLowerCase() === lowerName) {
		const dataToSave = {
		  name: req.body.name,
		  dob: req.body.dob,
		  email: req.body.email,
		  phone: req.body.phone,
		  gender: req.body.gender,
		  state: req.body.state,
		  bar_association_no: req.body.bar_association_no,
		  password: req.body.password,
		  confirm_password: req.body.confirm_password
		};
		await Register.create(dataToSave);
		return res.redirect('/lawyer/face');
	  } else {
		return res.status(400).json({ message: 'Bar association number or name does not match' });
	  }
  
	} catch (error) {
	  return res.status(500).json({ message: 'Internal server error', error: error.message });
	}
  };
  


module.exports.lawyer_login =(req,res)=>{
  const submittedEmail  = req.body
  Register.findOne({email: submittedEmail.email})
  .then(existingUser=>{
    if(existingUser){
      if(existingUser.password === submittedEmail.password){
        res.cookie('lawyer_id',existingUser.id);
        // res.redirect('/lawyer/dashboard_lawyer')
        // res.render('../controllers/lawyer/new_dashboard')
        res.redirect('/lawyer/Dashboard_lawyer');
        console.log('join')
        return
      }else{
        res.redirect('/lawyer/logging')
        console.log("wrong pass")
        return;
        // return res.status(500).json({ message: 'Wrong password:'});
      }
    }
    else{
      res.redirect('/lawyer/logging')
      console.log('not register with proper data')
      return;
      }
    })
    .catch(error=>{
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }) 
}

module.exports.case = (req,res)=>{
  const dataToSave = {
    district:req.body.district,
    court:req.body.court,
    matter:req.body.matter,
    case_type:req.body.case_type,
    mact:req.body.mact,
  }
  CaseForm.create(dataToSave)
  return res.redirect('/lawyer/complaint')
}
module.exports.complaintBox = (req,res)=>{
  const dataToSave = {
    Complainant_name:req.body.Complainant_name,
    phone:req.body.phone,
    com_relation:req.body.com_relation,
    address:req.body.address,
    relative_name:req.body.relative_name,
    state:req.body.state,
    dob:req.body.dob,
    comp_district:req.body.comp_district,
    comp_age:req.body.comp_age,
    comp_village:req.body.comp_village,
    gender:req.body.gender,
    ward:req.body.ward,
    caste:req.body.caste,
    pincode:req.body.pincode
  }
  Complaint.create(dataToSave)
  return res.redirect('/lawyer/document');
}
module.exports.documentBox = (req,res)=>{
  const dataToSave = {
    Defendent_name:req.body.Defendent_name,
    phone_def:req.body.phone_def,
    gender:req.body.gender,
    address:req.body.address,
    email:req.body.email,
    district:req.body.district,
    Fir_copy:req.body.Fir_copy,
    vakalatnama:req.body.vakalatnama,
    Affidavit:req.body.Affidavit
  }
  Document.create(dataToSave)
  return res.redirect('/lawyer/Dashboard_lawyer');
}
module.exports.Dashboard_lawyer = (req,res)=>{
  Complaint.find({})
  .then(documents => {
    // Handle the fetched documents
    res.render('../controllers/lawyer/dashboard_lawyer', { documents });
  })
  .catch(err => {
    console.error('Error fetching documents:', err);
    // Handle the error
  });
}
module.exports.face = (req,res)=>{
  // const pythonScript = '/E-Court/E-portal/FaceId/face.py';
  const pythonScript = path.join(__dirname, 'FaceId', 'face.py');
  exec(`python ${pythonScript}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing Python script: ${err}`);
      res.status(500).send('Error executing Python script');
      return;
    }
    console.log(`Python script output: ${stdout}`);
    return res.redirect('/lawyer/logging')
  });
}
module.exports.verify_img = (req,res)=>{
  // const pythonScript = '/E-Court/E-portal/FaceId/verify_lawyer.py';
  const pythonScript = path.join(__dirname, 'FaceId', 'verify_lawyer.py');
  exec(`python ${pythonScript}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing Python script: ${err}`);
      res.status(500).send('Error executing Python script');
      return;
    }
    console.log(`Python script output: ${stdout}`);
    return res.redirect('/lawyer/meeting')
  });
}
