import express from 'express';
import dotenv from 'dotenv';
import climaRouter from './router.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(climaRouter);




// Rota de teste para verificar se o servidor está funcionando
app.get('/test', (req, res) => {
    res.status(200).send({ 
        success: true, 
        message: 'Servidor está funcionando!',
        timestamp: new Date().toISOString()
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
    console.log('=================================');
    console.log('Teste a rota: http://localhost:3000/test');
});