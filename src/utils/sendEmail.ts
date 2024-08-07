import EmailTemplate from '@/components/email-template';
import { ApiResponse } from '@/types/ApiResponse';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
    username: string,
    email: string,
    verificationToken: string
}

export async function sendEmail({username, email, verificationToken} : EmailData) : Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'User Verification Mail',
      react: EmailTemplate({username,verificationToken})
    });

    return {
        success: true,
        message: "Verfication Email sent" 
    }
  } catch (error) {
    console.error("Verification Email could not be sent", error)
    return {
        success: false,
        message: "Failed to send verification email"
    }
  }
}
