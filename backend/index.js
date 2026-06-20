import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoute from './routes/userRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());    

// Routes
app.use('/api/v1/user',userRoute);

app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
}); 