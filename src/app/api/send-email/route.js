// Location: app/api/send-email/route.js

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  // 🪵 LOG: API endpoint has been hit.
  console.log("[API] /api/send-email POST route hit.");

  // 🪵 LOG: Verify that environment variables are being loaded.
  // ⚠️ WARNING: NEVER log your EMAIL_APP_PASSWORD for security reasons.
  console.log(`[API] Sending from: ${process.env.EMAIL_USER}`);
  console.log(`[API] Sending to: ${process.env.EMAIL_TO}`);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // This must be an App Password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: "💕 Password Entered Successfully - Gift Order Notification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #ec4899, #be185d); border-radius: 15px; color: white;">
          <h1 style="text-align: center; color: #fce7f3; margin-bottom: 30px;">🎉 Great News! 🎉</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #fce7f3;">
            Someone just entered the correct password on your love message website! 💕
          </p>
          <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0; color: #fce7f3;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="font-size: 16px; color: #fce7f3;">
            🎁 <strong>Action Required:</strong> Time to order that special gift as promised!
          </p>
        </div>
      `,
      text: `🎉 Password Successfully Entered! 🎉\nSomeone just entered the correct password on your love message website!\nTime: ${new Date().toLocaleString()}\nAction Required: Time to order that special gift as promised!`,
    };

    // 🪵 LOG: About to send mail with the following options.
    console.log("[API] Attempting to send email with Nodemailer...");

    // This `info` object is crucial for debugging.
    const info = await transporter.sendMail(mailOptions);

    // 🪵 LOG: Log the success response from the email provider (Gmail).
    console.log("[API] Email sent successfully! Nodemailer response:", info);
    // The `info.response` should contain a "250 2.0.0 OK" message from Gmail.
    // The `info.messageId` is the unique ID for the sent email.

    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
      nodemailerResponse: info.response,
    });
  } catch (error) {
    // 🪵 LOG: Log the entire error object for detailed diagnostics.
    console.error("[API] Email sending failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email",
        // Return the actual error message in the response for debugging.
        error: error.message,
        // You might want to log the full error stack on the server but not send it to the client.
        // For example: error: process.env.NODE_ENV === 'development' ? error.stack : 'An internal error occurred'
      },
      { status: 500 }
    );
  }
}
