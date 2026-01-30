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
            res.status(error.response.status).json({ 
                error: 'Erro ao buscar clima',
                status: error.response.status
            });
        } else if (error.request) {
            res.status(500).json({ 
                error: 'Erro de conexão com a API do clima'
            });
        } else {
            res.status(500).json({ 
                error: 'Erro ao buscar clima'
            });
        }
    }
});

//Rota para buscar cidades
router.get('/cidades/:nome', async (req, res) => {
    const nome = decodeURIComponent(req.params.nome);
    const apiKey = process.env.API_KEY;

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(nome)}&limit=5&appid=${apiKey}`;

    try {
        const response = await axios.get(url);

        const cidades = response.data.map(c => ({
            nome: c.name,
            estado: c.state || '',
            pais: c.country
        }));

        res.json(cidades);
    } catch (error) {
        res.status(500).json({ error:'Erro ao buscar cidades'});
        
    }
});


export default router;