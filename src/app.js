import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser';


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Hello World!');
    });
app.use('/api', userRoutes);

export default app;