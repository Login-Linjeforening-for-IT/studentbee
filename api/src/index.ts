import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use('/api', router);

// Catch-all route to handle undefined paths
app.use((_, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found on this server. Please refer to the API documentation for more information.'
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});