module.exports = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eeeeee;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #4a6cf7;
    }
    .content {
      padding: 30px 20px;
      line-height: 1.6;
    }
    .otp-box {
      font-size: 32px;
      font-weight: bold;
      text-align: center;
      letter-spacing: 5px;
      color: #4a6cf7;
      padding: 15px;
      margin: 25px 0;
      background-color: #f0f5ff;
      border-radius: 6px;
      border-left: 4px solid #4a6cf7;
    }
    .message {
      margin-bottom: 25px;
      font-size: 16px;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      font-size: 14px;
      color: #777777;
      border-top: 1px solid #eeeeee;
    }
    .button {
      display: inline-block;
      background-color: #4a6cf7;
      color: white;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 4px;
      font-weight: 500;
      margin: 20px 0;
    }
    .expiry {
      font-size: 14px;
      color: #ff3e3e;
      text-align: center;
      margin-top: 5px;
    }
    .info {
      background-color: #fff8e1;
      padding: 15px;
      border-radius: 6px;
      margin: 25px 0 15px;
      font-size: 14px;
      border-left: 4px solid #ffc107;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Hello World</div>
    </div>
    <div class="content">
      <div class="message">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Please use the following OTP to complete the process:</p>
      </div>
      <div class="otp-box">{otp}</div>
      <div class="expiry">This code will expire in 15 minutes</div>
      <div class="info">
        If you didn't request this password reset, please ignore this email or contact support if you have concerns.
      </div>
    </div>
    <div class="footer">
      <p>&copy; 2025 YourCompany. All rights reserved.</p>
      <p>This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;
