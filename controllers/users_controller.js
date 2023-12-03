const path = require('path');
const Register_client = require('../model/register1');
const { exec } = require('child_process');
module.exports.register = function(req,res){
    
    const filePath = path.join(__dirname, 'client', 'register_client.html'); // Path to your index.html file
    res.sendFile(filePath);
}
module.exports.logging = (req,res)=>{
    const filePath = path.join(__dirname, 'client', 'login_client.html'); // Path to your index.html file
    res.sendFile(filePath);
}

module.exports.client_register = (req,res)=>{
    const dataToSave = {
        name:req.body.name,
        dob:req.body.dob,
        email:req.body.email,
        phone:req.body.phone,
        gender:req.body.gender,
        state:req.body.state,
        password:req.body.password,
        confirm_password:req.body.confirm_password,
      }
      const submittedEmail  = req.body
      Register_client.findOne({email: submittedEmail.email})
      .then(existingUser=>{
        if(existingUser){
          // return res.status(200).json({ message: 'Already Register' });
          return res.redirect('/client/register')
        }
        else{
          Register_client.create(dataToSave)
          // res.status(200).json({ message: 'Thank you for register' });
          return res.redirect('/client/face')
        }
      })
      .catch(error=>{
        return res.status(500).json({ message: 'Internal server error', error: error.message });
      }) 
}


module.exports.client_login = (req,res)=>{
  const submittedEmail  = req.body
  Register_client.findOne({email: submittedEmail.email})
  .then(existingUser=>{
    if(existingUser){
      if(existingUser.password === submittedEmail.password){
        res.cookie('client_id',existingUser.id);
        res.redirect('/client/dashboard_client')
        return
      }else{
        return res.redirect('/client/logging')
        // return res.status(500).json({ message: 'Wrong password:'});
      }
    }
    else{
      return res.redirect('/client/logging')
      }
    })
    .catch(error=>{
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }) 
}
module.exports.face = (req,res)=>{
  const pythonScript = '/E-portal/E-portal/FaceId/face_client.py';
  exec(`python ${pythonScript}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing Python script: ${err}`);
      // res.status(500).send('Error executing Python script');
      return;
    }
    console.log(`Python script output: ${stdout}`);
    return res.redirect('/client/logging')
  });
}

module.exports.Dashboard_client = (req,res)=>{
  res.render('../controllers/client/dashboard_client');
  return
}