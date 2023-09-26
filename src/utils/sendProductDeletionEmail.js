import nodemailer from "nodemailer";

const sendProductDeletionEmail = async (userEmail, productName) => {
  try {
     const transporter = nodemailer.createTransport({
          service: "gmail",
          port: 587,
          auth: {
               user: "venturelliquimey@gmail.com",
               pass: "qgbjqxagvkewmkbp",
          },
     });

    // Detalles del correo
    const mailOptions = {
      from: "Tienda Node",
      to: userEmail,
      subject: "Notificación de eliminación de producto premium",
      text: `El producto ${productName} ha sido eliminado de tu cuenta premium.`,
    };

    // Envío del correo
    await transporter.sendMail(mailOptions);

    console.log(`Correo de notificación enviado a ${userEmail}`);
  } catch (error) {
    console.error("Error al enviar el correo de notificación:", error);
  }
};

export { sendProductDeletionEmail };
