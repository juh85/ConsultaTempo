import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/clima/:cidade', async (req, res) => {
    // Decodifica a cidade (converte %20 em espaço, etc)
    const cidade = decodeURIComponent(req.params.cidade);
    const apiKey = process.env.API_KEY; // chave no arquivo .env
    
    // Codifica a cidade para usar na URL da API
    const cidadeEncoded = encodeURIComponent(cidade);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidadeEncoded}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const response = await axios.get(url);

        res.status(200).json({
            cidade: response.data.name,
            temperatura: response.data.main.temp,
            sensacao: response.data.main.feels_like,
            descricao: response.data.weather[0].description,
            umidade: response.data.main.humidity
        });

    } catch (error) {
        // Melhora o tratamento de erro 
        console.error('Erro ao buscar clima:', error.response?.data || error.message);
        
        if (error.response) {
            // Erro da API (ex: cidade não encontrada, API key inválida)
            res.status(error.response.status).json({ 
                error: 'Erro ao buscar clima',
                status: error.response.status
            });
        } else if (error.request) {
            // Erro de conexão
            res.status(500).json({ 
                error: 'Erro de conexão com a API do clima'
            });
        } else {
            // Outro erro
            res.status(500).json({ 
                error: 'Erro ao buscar clima'
            });
        }
    }
});



export default router;