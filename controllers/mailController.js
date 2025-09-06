import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * @param {string} name
 * @param {string} role
 * @param {string[]} skills
 * @returns {string}
 */
const createHtmlBody = (name, role, skills) => {
  return `
    <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 20px auto; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f9f9f9; padding: 20px; border-bottom: 1px solid #dddddd;">
        <h2 style="margin: 0; color: #1a1a1a; font-size: 24px;">Opportunity at HireSense AI</h2>
      </div>
      <div style="padding: 25px;">
        <p style="margin-bottom: 20px; font-size: 16px;">Dear <strong>${name}</strong>,</p>
        <p style="margin-bottom: 20px; font-size: 16px;">We've had the opportunity to review your profile and were highly impressed with your qualifications and experience.</p>
        <p style="margin-bottom: 20px; font-size: 16px;">Based on your skills in <strong>${skills.join(
          ", "
        )}</strong>, we believe you are an excellent fit for the role of <strong>"${role}"</strong>.</p>
        <p style="margin-bottom: 25px; font-size: 16px;">We would love to discuss this opportunity further. Please reply to this email to let us know if you are interested in moving forward.</p>
        <p style="margin: 0; font-size: 16px;">Best Regards,</p>
        <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: bold;">The HireSense AI Team</p>
      </div>
      <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #dddddd;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} HireSense AI. All rights reserved.</p>
      </div>
    </div>
  `;
};

/**
 * @description
 * @route POST /api/mail/send-mail
 */
export const sendMail = async (req, res) => {
  const { name, email, role, skills } = req.body;

  if (!name || !email || !role || !skills) {
    return res
      .status(400)
      .json({
        message: "Missing required fields: name, email, role, and skills.",
      });
  }

  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL,
    subject: `An Opportunity for the role of ${role}`,
    html: createHtmlBody(name, role, skills),
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: `Email sent successfully to ${email}` });
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.body : error
    );
    res.status(500).json({ message: "Failed to send email." });
  }
};

/**
 * @description
 * @route POST /api/mail/send-all-mails
 */
export const sendAllMails = async (req, res) => {
  const { candidates } = req.body;

  if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
    return res
      .status(400)
      .json({
        message: "Candidate list is required and must be a non-empty array.",
      });
  }
  const messages = candidates.map((candidate) => ({
    to: candidate.email,
    from: process.env.SENDER_EMAIL,
    subject: `An Opportunity for the role of ${candidate.role}`,
    html: createHtmlBody(candidate.name, candidate.role, candidate.skills),
  }));

  try {
    await sgMail.send(messages);
    res.status(200).json({ message: "All emails sent successfully." });
  } catch (error) {
    console.error(
      "Error sending bulk emails:",
      error.response ? error.response.body : error
    );
    res.status(500).json({ message: "Failed to send all emails." });
  }
};
