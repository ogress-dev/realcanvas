const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testSMTP() {
  console.log('Testing SMTP connection...\n');
  
  // Check environment variables
  console.log('Environment variables:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Not set');
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✓ Set' : '✗ Not set');
  console.log('');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Email credentials not configured in .env.local');
    process.exit(1);
  }
  
  // Test primary configuration (smtp.hostinger.com)
  console.log('Testing primary SMTP server (smtp.hostinger.com:587)...');
  const primaryTransporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  try {
    await primaryTransporter.verify();
    console.log('✓ Primary SMTP connection successful!\n');
    
    // Try sending a test email
    console.log('Sending test email...');
    const info = await primaryTransporter.sendMail({
      from: `"David Doro Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'SMTP Test Email',
      html: `
        <h2>SMTP Test Successful</h2>
        <p>This is a test email sent at ${new Date().toLocaleString()}</p>
        <p>Your email configuration is working correctly!</p>
      `,
    });
    console.log('✓ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    process.exit(0);
  } catch (primaryError) {
    console.error('✗ Primary SMTP failed:', primaryError.message);
    console.log('');
    
    // Test alternative configuration (smtp.hostinger.com SSL)
    console.log('Testing alternative SMTP server (smtp.hostinger.com:465)...');
    const altTransporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    try {
      await altTransporter.verify();
      console.log('✓ Alternative SMTP connection successful!\n');
      
      // Try sending a test email
      console.log('Sending test email...');
      const info = await altTransporter.sendMail({
        from: `"David Doro Portfolio" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: 'SMTP Test Email',
        html: `
          <h2>SMTP Test Successful</h2>
          <p>This is a test email sent at ${new Date().toLocaleString()}</p>
          <p>Your email configuration is working correctly (via alternative server)!</p>
        `,
      });
      console.log('✓ Test email sent successfully!');
      console.log('Message ID:', info.messageId);
      process.exit(0);
    } catch (altError) {
      console.error('✗ Alternative SMTP also failed:', altError.message);
      console.log('\nBoth SMTP configurations failed. Please check:');
      console.log('1. Email credentials are correct');
      console.log('2. SMTP is enabled in your hosting panel');
      console.log('3. Your IP is not blocked');
      console.log('4. The email account exists and is active');
      process.exit(1);
    }
  }
}

testSMTP();
