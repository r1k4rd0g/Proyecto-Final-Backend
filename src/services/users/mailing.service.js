import { createTransport } from 'nodemailer';
import config from '../../config/config.js'
import logger from '../../utils/logger/logger.winston.js';
import { errorsDictionary } from '../../utils/errors.dictionary.js';


const transport = createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: config.EMAIL,
        pass: config.PASSWORD
    },
    host: config.HOST,
    tls: { rejectUnauthorized: false }
});

class MailSender {
    constructor() {
    }
    sendMailTicket = async (userData, ticketGenerate) => {
        try {
            //console.log('consola mailing',userData, ticketGenerate)
            const user = userData.first_name
            const { code, purchaseDataTime, amount, purchaser } = ticketGenerate
            //console.log('user mailing',user)
            const message = {
                from: config.EMAIL,
                to: purchaser.email,
                subject: 'Confirmación de compra',
                html: `<p> Hola ${user},<br>
                    Acabas de confirmar tu compra! <br>
                    Se generó el ticket siguiente:<br>
                    <strong>Código de ticket:</strong> ${code}<br>
                    <strong>Time:</strong> ${purchaseDataTime}<br>
                    <strong>Importe total de ticket:</strong> ${amount}<br>
                    <strong>Datos de comprador:</strong> ${purchaser.email}<br>
                    Muchas gracias!
                    </p>`
            };
            //console.log('message', message)
            return await transport.sendMail(message)
        } catch (error) {
            logger.error('entró en el catch - mailing.service - sendMailTicket: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_TO_CREATE)
        }
    }

    sendResetPass = async (email, resetLink) => {
        try {
            const message = {
                from: config.EMAIL,
                to: email,
                subject: 'Restablecer Contraseña',
                html: `Haz click en este enlace para restablecer tu contraseña: ${resetLink}`
            };
            const mailSend = await transport.sendMail(message);
            logger.info ('Email enviado: ' + mailSend)
            return mailSend;
        } catch (error) {
            logger.error('entró en el catch - mailing.service - sendResetPass: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_TO_CREATE)
        }
    }
    userDelete = async (user)=>{
        try {
            const email = user.email;
            const nombre = user.first_name;
            const apellido = user.last_name;
            const message = {
                from: config.EMAIL,
                to: email,
                subject: 'Cuenta eliminada',
                html: `Estimado/a ${nombre} ${apellido}, Debito a tu tiempo de inactividad, tu cuenta con el correo ${email}, fue eliminada. Muchas gracias.`
            };
            const mailSend = await transport.sendMail(message);
            logger.info ('Email enviado: ' + mailSend)
            return mailSend;
        } catch (error) {
            logger.error('entró en el catch - mailing.service - userDelete: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_TO_CREATE)
        }
    }
    deleteProd = async (productSearch, user, emailOwner) =>{
        try {
            const  howDelete = user.email;
            const ownerEmail = emailOwner;

            const message={
                from: config.EMAIL,
                to: ownerEmail,
                subject: 'Producto eliminado',
                html: `<p> El producto que se detalla a continuación: <br> ${productSearch} <br> fue eliminado por ${howDelete}.</p>`
            }
            const mailSend = await transport.sendMail(message);
            logger.info('Email enviado: ' + mailSend)
            return mailSend;
        } catch (error) {
            logger.error('entró en el catch - mailing.service - deleteProd: ' + error)
            throw new Error(error.message, errorsDictionary.ERROR_TO_CREATE)
        }
    }
}


const mailSender = new MailSender();
export default mailSender;