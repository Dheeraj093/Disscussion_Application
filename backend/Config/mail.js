const nodemailer = require('nodemailer');
exports.generateOTP = (otp_length = 6) => {
	
    let OTP = '';
    for(let i = 1 ; i<=otp_length ;i++)
    {
    	const randomVal = Math.round(Math.random()*9);
    	OTP+=randomVal;
    }
    
    return OTP;
}

exports.generateMailTransporter = () => nodemailer.createTransport({
 	 
 	 host: "smtp-relay.brevo.com",
     port: 587,
  	 auth: {
     user: "dheerajrajput1232@gmail.com",
     pass: "Dv5AJ3TBChnzx6fp"
  	}
  });