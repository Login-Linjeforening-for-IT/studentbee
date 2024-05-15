import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});