import {createTransport} from 'nodemailer';
import config from '../../config/config.js'
import logger from '../../utils/logger/logger.winston.js';


const transport = createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth:{
        user: config.EMAIL,
        pass: config.PASSWORD
    },
    host: config.HOST,
    tls: {rejectUnauthorized: false}
});

class MailSender{
    constructor(){
    }
        sendMailTicket = async (userData, ticketGenerate) =>{
            try {
                //console.log('consola mailing',userData, ticketGenerate)
                const user = userData.first_name
                const {code, purchaseDataTime, amount, purchaser} = ticketGenerate
                //console.log('user mailing',user)
                const  message = {
                    from: config.EMAIL,
                    to: "r1k4rd0g@gmail.com",//user.EMAIL,
                    subject: 'Confirmación de compra',
                    html:`<p> Hola ${user},<br>
                    acabas de confirmar tu compra! <br>
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
            throw new Error (error.message, errorsDictionary.ERROR_TO_CREATE)
            }
        }
}


const mailSender = new MailSender();
export default mailSender;