const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const emailTemplates = {

  welcomeEmail: (full_name) => ({
    subject: 'Welcome to Campus Voice Portal — TMSL',
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
        <div style="background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); padding: 40px 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: -0.5px;">🏛️ Campus Voice Portal</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Techno Main Salt Lake — TMSL</p>
        </div>
        <div style="background: white; padding: 40px 32px;">
          <h2 style="color: #1a365d; margin-top: 0;">Welcome, ${full_name}! 👋</h2>
          <p style="color: #475569; line-height: 1.6; font-size: 15px;">
            Your account has been successfully created on the <strong>Campus Voice Management Portal</strong>.
            You can now raise and track campus complaints, view notices, check events, and more.
          </p>
          <div style="background: #f1f5f9; border-left: 4px solid #2563eb; border-radius: 4px; padding: 16px 20px; margin: 24px 0;">
            <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6;">
              ✅ Submit complaints<br>
              📋 Track resolution status<br>
              📢 View campus notices & events<br>
              🔧 Report maintenance issues
            </p>
          </div>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.FRONTEND_URL || 'https://college-complain-management.vercel.app'}"
               style="background: linear-gradient(135deg, #1a365d, #2563eb); color: white; padding: 14px 36px;
                      border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;
                      display: inline-block;">
              Login to Portal →
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 13px; text-align: center; margin: 0;">
            This is an automated email. Please do not reply.
          </p>
        </div>
        <div style="background: #1e293b; padding: 20px 32px; text-align: center;">
          <p style="color: #64748b; margin: 0; font-size: 12px;">© 2026 Campus Voice Portal • Techno Main Salt Lake</p>
        </div>
      </div>
    `
  }),

  loginAlert: (full_name, loginTime, ipAddress) => ({
    subject: 'New Login Detected — Campus Voice Portal',
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
        <div style="background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); padding: 40px 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: -0.5px;">🏛️ Campus Voice Portal</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Security Alert</p>
        </div>
        <div style="background: white; padding: 40px 32px;">
          <h2 style="color: #1a365d; margin-top: 0;">New Login Detected 🔐</h2>
          <p style="color: #475569; font-size: 15px;">Hi <strong>${full_name}</strong>,</p>
          <p style="color: #475569; line-height: 1.6; font-size: 15px;">
            We detected a new login to your Campus Voice Portal account. Here are the details:
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px 24px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 120px;">🕐 Time</td>
                <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${loginTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">🌐 IP Address</td>
                <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${ipAddress}</td>
              </tr>
            </table>
          </div>
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px 20px; margin: 0 0 24px;">
            <p style="margin: 0; color: #dc2626; font-size: 14px; font-weight: 500;">
              ⚠️ If this wasn't you, please reset your password immediately by contacting the admin.
            </p>
          </div>
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'https://college-complain-management.vercel.app'}"
               style="background: linear-gradient(135deg, #1a365d, #2563eb); color: white; padding: 12px 28px;
                      border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;
                      display: inline-block;">
              Go to Portal →
            </a>
          </div>
        </div>
        <div style="background: #1e293b; padding: 20px 32px; text-align: center;">
          <p style="color: #64748b; margin: 0; font-size: 12px;">© 2026 Campus Voice Portal • Techno Main Salt Lake</p>
        </div>
      </div>
    `
  })
};

const sendEmail = async (to, template) => {
  // Silently skip if email credentials are not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email skipped — EMAIL_USER/EMAIL_PASS not configured');
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject: template.subject,
      html: template.html
    });
    console.log('Email sent to ' + to + ': ' + template.subject);
  } catch (error) {
    // Never crash the server over a failed email
    console.error('Email send failed (non-fatal):', error.message);
  }
};

module.exports = { sendEmail, emailTemplates };
