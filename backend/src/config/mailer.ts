import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendOtpEmail = async (email: string, name: string, otp: string) => {
    const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a0a; border-radius: 16px; overflow: hidden; border: 1px solid #27272a;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px;">GLOBAL MEDIA SPORTS</h1>
        </div>
        <div style="padding: 32px 24px; text-align: center;">
            <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 8px;">Hi <span style="color: #ffffff; font-weight: 600;">${name}</span>,</p>
            <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 24px;">Use the code below to verify your email address:</p>
            <div style="background: #18181b; border: 2px solid #dc2626; border-radius: 12px; padding: 20px; margin: 0 auto; display: inline-block;">
                <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #ffffff;">${otp}</span>
            </div>
            <p style="color: #71717a; font-size: 12px; margin: 24px 0 0;">This code expires in <strong style="color: #a1a1aa;">10 minutes</strong>.</p>
            <p style="color: #71717a; font-size: 12px; margin: 8px 0 0;">If you didn't request this, please ignore this email.</p>
        </div>
        <div style="border-top: 1px solid #27272a; padding: 16px 24px; text-align: center;">
            <p style="color: #52525b; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Global Media Sports. All rights reserved.</p>
        </div>
    </div>`;

    await transporter.sendMail({
        from: `"Global Media Sports" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: `${otp} — Your Verification Code`,
        html,
    });
};

export default transporter;
