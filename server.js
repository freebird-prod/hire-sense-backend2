import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config'; 
import mailRoutes from './routes/mailRoutes.js';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/mail', mailRoutes);

app.get('/', (req, res) => {
    res.send('Mail sender backend is running!');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

