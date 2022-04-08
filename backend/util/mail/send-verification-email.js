const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (toLocation, fromLocation, jwt_token) => {
  const link = `${process.env.FRONTEND_URL}/verify-email?token=${jwt_token}`;

  const message = {
    to: toLocation,
    from: fromLocation,
    subject: "Verify your email for Redddit Demo Project",
    text: "Please go to this link to verify your email for the Redddit Demo Project.",
    html: `<html><p>Please click on this link to verify your email for the Redddit Demo Project.</p><a clicktracking="off" href=${link}>${link}</a></html>`
  };

  try {
    const response = await sgMail.send(message);
    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = sendVerificationEmail;
