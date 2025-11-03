import { defineEventHandler, readBody } from 'h3'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { full_name, email, phone, apartamet_type } = body

  if (!email || !full_name) {
    event.res.statusCode = 400
    return { error: 'Full Name and Email address are required.' }
  }

  try {
    // Отправляем письмо на свою почту
    await resend.emails.send({
      from: 'iconic@resend.dev',
      to: ['v.kushnir22@gmail.com'],
      subject: 'Iconic New Interest',
      text: `Full Name: ${full_name}\nEmail: ${email}\nPhone: ${phone}\nApartamet_type: ${apartamet_type}`,
    })

    return { success: true }
  } catch (err) {
    console.error('Error sending email:', err)
    event.res.statusCode = 500
    return { error: 'Error sending email' }
  }

  return { success: true }
})
