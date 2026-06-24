import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoute from './routes/userRoute.js';
import messageRoute from './routes/messageRouter.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json()); 
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true }));
const corsOption = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOption));



// Routes
app.use('/api/v1/user',userRoute);
app.use('/api/v1/message', messageRoute);

app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
}); 