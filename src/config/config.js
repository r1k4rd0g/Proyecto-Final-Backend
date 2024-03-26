import 'dotenv/config';

export default {
    MONGO_URL: process.env.MONGO_URL,
    PORT:process.env.PORT,
    PERSISTENCE:process.env.PERSISTENCE,
    SECRET_KEY_JWT:process.env.SECRET_KEY_JWT,
    clientID : process.env.CLIENTID,
    clientSecret : process.env.CLIENTSECRET,
    NODE_ENV: process.env.NODE_ENV,
    EMAIL : process.env.EMAIL,
    PASSWORD : process.env.PASSWORD,
    NAME : process.env.NAME,
    HOST : process.env.HOST
}