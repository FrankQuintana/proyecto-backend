import dotenv from 'dotenv';

dotenv.config();

export default {
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    port: process.env.PORT || 8080
};