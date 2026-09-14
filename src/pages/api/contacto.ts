import type { APIRoute } from "astro";
import nodemailer from "nodemailer";
import type { ContactoFormPayload } from "../../types/contacto.ts";

export const prerender = false;

const CONTACT_TO = "hola@umbralcomunicacion.com.ar";

function isValidPayload(data: Partial<ContactoFormPayload>): data is ContactoFormPayload {
  return (
    typeof data.nombre === "string" &&
    data.nombre.trim().length > 0 &&
    typeof data.apellido === "string" &&
    data.apellido.trim().length > 0 &&
    typeof data.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    typeof data.mensaje === "string" &&
    data.mensaje.trim().length > 0
  );
}

export const POST: APIRoute = async ({ request }) => {
  let data: Partial<ContactoFormPayload>;

  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "invalid_json" }), {
      status: 400,
    });
  }

  if (!isValidPayload(data)) {
    return new Response(JSON.stringify({ ok: false, error: "invalid_payload" }), {
      status: 400,
    });
  }

  const { nombre, apellido, email, mensaje } = data;

  const transporter = nodemailer.createTransport({
    host: import.meta.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(import.meta.env.SMTP_PORT ?? 465),
    secure: true,
    auth: {
      user: import.meta.env.SMTP_USER,
      pass: import.meta.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Formulario Umbral" <${import.meta.env.SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: email,
      subject: `Nuevo mensaje de ${nombre} ${apellido}`,
      text: `Nombre: ${nombre} ${apellido}\nEmail: ${email}\n\n${mensaje}`,
      html: `<p><strong>Nombre:</strong> ${nombre} ${apellido}</p><p><strong>Email:</strong> ${email}</p><p><strong>Mensaje:</strong></p><p>${mensaje.replace(/\n/g, "<br />")}</p>`,
    });
  } catch (error) {
    console.error("Error enviando email de contacto:", error);
    return new Response(JSON.stringify({ ok: false, error: "send_failed" }), {
      status: 502,
    });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
