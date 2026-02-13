import Brevo from "@getbrevo/brevo";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = {
      sender: {
        name: "Hotel Management",
        email: process.env.BREVO_SENDER_EMAIL, // must be verified in Brevo
      },
      to: [
        {
          email: to,
        },
      ],
      subject: subject,
      htmlContent: html,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error("Brevo email error:", error.response?.body || error.message);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;
