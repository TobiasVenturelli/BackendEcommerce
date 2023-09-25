import nodemailer from "nodemailer";

const sendNotificationEmail = async (email) => {
     try {

          const transporter = nodemailer.createTransport({
               service: "gmail",
               port: 587,
               auth: {
                    user: "venturelliquimey@gmail.com",
                    pass: "qgbjqxagvkewmkbp",
               },
          });
          // Envía el correo de notificación
          await transporter.sendMail({
               from: "Tienda Node",
               to: email,
               subject: "Tu cuenta ha sido eliminada por inactividad",
               text: "Lamentamos informarte que tu cuenta ha sido eliminada debido a la inactividad en nuestro servicio.",
          });
     } catch (error) {
          console.error("Error al enviar el correo de notificación:", error);
     }
};

export {sendNotificationEmail}
