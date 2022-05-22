const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendPasswordResetEmail = async (
  toLocation,
  fromLocation,
  jwt_reset_token,
  userId
) => {
  const link = `${process.env.FRONTEND_URL}/new-password?token=${jwt_reset_token}&userId=${userId}`;

  const message = {
    to: toLocation,
    from: fromLocation,
    subject: "Password reset for Redddit Demo Project",
    text: "Please go to this link to reset your password in the Redddit Demo Project.",
    html: `<html><p>Please click on this link to reset your password in the Redddit Demo Project.</p><a clicktracking="off" href="${link}">${link}</a></html>`,
  };

  try {
    const response = await sgMail.send(message);
    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = sendPasswordResetEmail;
