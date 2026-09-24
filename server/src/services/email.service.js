import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Envoie une notification email quand un visiteur soumet le formulaire de contact.
 * N'échoue pas silencieusement le reste du flux si l'email n'est pas configuré.
 */
export async function sendContactNotification({ to, name, email, subject, message }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('EMAIL_USER/EMAIL_PASS non configurés — notification email ignorée.');
    return;
  }

  const mailer = getTransporter();
  await mailer.sendMail({
    from: `"Portfolio — Formulaire de contact" <${process.env.EMAIL_USER}>`,
    to,
    replyTo: email,
    subject: `Nouveau message : ${subject || 'Sans objet'}`,
    text: `De : ${name} (${email})\n\n${message}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px;">
        <p><strong>${name}</strong> (${email}) vous a envoyé un message depuis votre portfolio :</p>
        <p style="background:#F4F1EA; padding:12px; border-radius:8px;">${message.replace(/\n/g, '<br>')}</p>
      </div>`,
  });
}