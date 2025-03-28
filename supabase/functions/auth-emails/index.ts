
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type EmailType = 'SIGNUP' | 'INVITE' | 'MAGIC_LINK' | 'RECOVERY';

interface EmailParams {
  email_type: EmailType;
  email: string;
  site_url: string;
  username?: string;
  redirect_to?: string;
}

// Email templates
const getSignUpTemplate = (params: EmailParams, actionLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify your email for Plug Jerseys</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { border: 1px solid #e4e4e4; border-radius: 8px; padding: 20px; }
    .logo { text-align: center; margin-bottom: 20px; }
    .btn { display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>Plug Jerseys</h1>
    </div>
    <p>Hello${params.username ? ' ' + params.username : ''},</p>
    <p>Thank you for signing up with Plug Jerseys! Please verify your email address by clicking the button below:</p>
    <p style="text-align: center;">
      <a href="${actionLink}" class="btn">Verify Email Address</a>
    </p>
    <p>Or copy and paste this URL into your browser:</p>
    <p style="word-break: break-all;">${actionLink}</p>
    <p>If you didn't sign up for an account, you can safely ignore this email.</p>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Plug Jerseys. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const getPasswordRecoveryTemplate = (params: EmailParams, actionLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset your password for Plug Jerseys</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { border: 1px solid #e4e4e4; border-radius: 8px; padding: 20px; }
    .logo { text-align: center; margin-bottom: 20px; }
    .btn { display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>Plug Jerseys</h1>
    </div>
    <p>Hello,</p>
    <p>We received a request to reset your password. Click the button below to set a new password:</p>
    <p style="text-align: center;">
      <a href="${actionLink}" class="btn">Reset Password</a>
    </p>
    <p>Or copy and paste this URL into your browser:</p>
    <p style="word-break: break-all;">${actionLink}</p>
    <p>If you didn't request a password reset, you can safely ignore this email.</p>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Plug Jerseys. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const getMagicLinkTemplate = (params: EmailParams, actionLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Magic Link for Plug Jerseys</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { border: 1px solid #e4e4e4; border-radius: 8px; padding: 20px; }
    .logo { text-align: center; margin-bottom: 20px; }
    .btn { display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>Plug Jerseys</h1>
    </div>
    <p>Hello,</p>
    <p>Use the button below to securely sign in to your Plug Jerseys account:</p>
    <p style="text-align: center;">
      <a href="${actionLink}" class="btn">Sign In</a>
    </p>
    <p>Or copy and paste this URL into your browser:</p>
    <p style="word-break: break-all;">${actionLink}</p>
    <p>This link will expire in 24 hours. If you didn't request this link, you can safely ignore this email.</p>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Plug Jerseys. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const getInviteTemplate = (params: EmailParams, actionLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>You've been invited to Plug Jerseys</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { border: 1px solid #e4e4e4; border-radius: 8px; padding: 20px; }
    .logo { text-align: center; margin-bottom: 20px; }
    .btn { display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>Plug Jerseys</h1>
    </div>
    <p>Hello,</p>
    <p>You've been invited to join Plug Jerseys. Click the button below to accept your invitation and create your account:</p>
    <p style="text-align: center;">
      <a href="${actionLink}" class="btn">Accept Invitation</a>
    </p>
    <p>Or copy and paste this URL into your browser:</p>
    <p style="word-break: break-all;">${actionLink}</p>
    <p>This invitation will expire in 7 days.</p>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Plug Jerseys. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      // Use service_role key to bypass RLS
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    const { email_type, email, username, site_url, redirect_to } = await req.json() as EmailParams;
    const redirectTo = redirect_to || site_url;
    
    // Generate the email action link
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: email_type.toLowerCase() as 'signup' | 'recovery' | 'invite' | 'magiclink',
      email,
      options: {
        redirectTo,
      }
    });

    if (error) {
      console.error('Error generating link:', error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Get the action link from the response
    const actionLink = data.properties.action_link;
    
    // Generate the appropriate email template based on the type
    let htmlContent = '';
    
    switch (email_type) {
      case 'SIGNUP':
        htmlContent = getSignUpTemplate({ email_type, email, username, site_url, redirect_to }, actionLink);
        break;
      case 'RECOVERY':
        htmlContent = getPasswordRecoveryTemplate({ email_type, email, site_url, redirect_to }, actionLink);
        break;
      case 'MAGIC_LINK':
        htmlContent = getMagicLinkTemplate({ email_type, email, site_url, redirect_to }, actionLink);
        break;
      case 'INVITE':
        htmlContent = getInviteTemplate({ email_type, email, site_url, redirect_to }, actionLink);
        break;
      default:
        return new Response(JSON.stringify({ error: 'Invalid email type' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
    }

    // Here you would typically send the email using a service like SendGrid, Resend, etc.
    // For now, we'll just return the HTML content for testing
    return new Response(JSON.stringify({ 
      success: true, 
      action_link: actionLink,
      html: htmlContent 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in auth-emails function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
