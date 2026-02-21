export default function getDesignedEmail({
  brandName,
  accentColor,
  primaryColor,
  secondaryColor,
  otp,
  minutesValid,
  supportEmail,
}) {
  const year = new Date().getFullYear();

  return `
  <div style="margin:0; padding:0; background-color:${primaryColor}; font-family:Arial, Helvetica, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

      <!-- Header -->
      <tr>
        <td style="background-color:${secondaryColor}; padding:20px; text-align:center;">
          <h2 style="color:${accentColor}; margin:0;">${brandName}</h2>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px; color:${secondaryColor};">
          <h3 style="margin-top:0;">Password Reset Request</h3>

          <p style="font-size:15px; line-height:1.6; margin:12px 0;">
            Hello,
          </p>

          <p style="font-size:15px; line-height:1.6; margin:12px 0;">
            We received a request to reset your password. Please use the verification code below to continue.
          </p>

          <!-- OTP Box -->
          <div style="text-align:center; margin:28px 0;">
            <span style="
              display:inline-block;
              padding:15px 30px;
              font-size:28px;
              font-weight:bold;
              letter-spacing:4px;
              background-color:${accentColor};
              color:#ffffff;
              border-radius:10px;
            ">
              ${otp}
            </span>
          </div>

          <p style="font-size:14px; line-height:1.6; margin:12px 0; color:#555;">
            This code is valid for <strong>${minutesValid} minutes</strong>.
            If you did not request a password reset, you can safely ignore this email.
          </p>

          <hr style="border:none; border-top:1px solid #eee; margin:26px 0;" />

          <p style="font-size:13px; line-height:1.6; margin:0; color:#777;">
            For your security, please do not share this code with anyone.
          </p>

          ${
            supportEmail
              ? `<p style="font-size:13px; line-height:1.6; margin:10px 0 0; color:#777;">
                   Need help? Contact us at <a href="mailto:${supportEmail}" style="color:${accentColor}; text-decoration:none;">${supportEmail}</a>.
                 </p>`
              : ""
          }
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background-color:${primaryColor}; text-align:center; padding:15px; font-size:12px; color:${secondaryColor};">
          © ${year} ${brandName}. All rights reserved.
        </td>
      </tr>
    </table>
  </div>
  `;
}