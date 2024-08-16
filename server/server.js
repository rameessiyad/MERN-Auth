import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';

import connectDB from './db/db.js';
import userRouter from './routes/userRoute.js'

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParser());

//end points
app.use('/api/users', userRouter);

//error handle middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started on port ${PORT}`)
});
