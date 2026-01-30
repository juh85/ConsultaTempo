let timeout = null;


async function previsaoTempo() {
    const cidadeInput = document.getElementById('cidade');
    const resultado = document.getElementById('resultado');

    const cidade = cidadeInput.value.trim();

    // Limpa e esconde o resultado inicialmente
    resultado.innerHTML = '';
    resultado.style.display = 'none';

    if (!cidade) {
        resultado.innerHTML = '<p>Digite o nome de uma cidade.</p>';
        resultado.style.display = 'block';
        return;
    }

    try {
        const url = `/clima/${encodeURIComponent(cidade)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            resultado.innerHTML = '<p>Não foi possível buscar a previsão.</p>';
            resultado.style.display = 'block';
            return;
        }

        // Verifica se os dados necessários existem
        if (!data.cidade || data.temperatura === undefined) {
            resultado.innerHTML = '<p>Dados incompletos recebidos da API.</p>';
            resultado.style.display = 'block';
            return;
        }

        // Mostra o resultado com os dados do clima
        resultado.style.display = 'block';
        resultado.innerHTML = `
            <p><strong>Previsão do tempo para ${data.cidade}</strong></p>
            <p>Temperatura: ${data.temperatura}°C</p>
            <p>Sensação térmica: ${data.sensacao}°C</p>
            <p>Descrição: ${data.descricao}</p>
            <p>Umidade: ${data.umidade}%</p>
        `;
        // trocar imagem
    trocarImagem(data.descricao);

    } catch (error) {
        resultado.innerHTML = '<p>Não foi possível buscar a previsão.</p>';
        resultado.style.display = 'block';
        console.error('Erro ao buscar previsão:', error);
    }
    
    
}


// função autocomplete
const inputCidade = document.getElementById('cidade');
const sugestacoes = document.getElementById('sugestoes');

let debounceTimer = null;

// Evento de digitar
inputCidade.addEventListener('input', () => {
    const valor = inputCidade.value.trim();

    sugestacoes.innerHTML = '';
    sugestacoes.style.display = 'none';

    if (valor.length < 2) return;

clearTimeout(debounceTimer);

debounceTimer = setTimeout(() => {
    buscarSugestoes(valor);
}, 300);

});

// Função para buscar sugestões
async function buscarSugestoes(termo) {
    try {
        const response = await fetch(`/cidades/${encodeURIComponent(termo)}`);
        
        if (!response.ok) {
            sugestacoes.style.display = 'none';
            sugestacoes.innerHTML = '';
            return; // Se houver erro, não exibe nada
        }

        const data = await response.json();

        // Verifica se é um array (sucesso) ou objeto de erro
        if (!Array.isArray(data)) {
            sugestacoes.style.display = 'none';
            sugestacoes.innerHTML = '';
            return;
        }

        sugestacoes.innerHTML = '';

        if (data.length === 0) {
            sugestacoes.style.display = 'none';
            return; // Não há cidades encontradas
        }

        // Mostra a lista de sugestões
        sugestacoes.style.display = 'block';

        data.forEach(cidade => {
            const li = document.createElement('li');

            li.innerHTML = `
                <strong>${cidade.nome}</strong>
                ${cidade.estado ? ' - ' + cidade.estado : ''}
                (${cidade.pais})
            `;

            li.addEventListener('click', () => {
                inputCidade.value = cidade.nome;
                sugestacoes.innerHTML = '';
                sugestacoes.style.display = 'none';
            });

            sugestacoes.appendChild(li);
        });

    } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
        sugestacoes.style.display = 'none';
        sugestacoes.innerHTML = '';
    }
}

// Fecha sugestões ao clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('#cidade') && !e.target.closest('#sugestoes')) {
        sugestacoes.innerHTML = '';
        sugestacoes.style.display = 'none';
    }
});


// função para trocar imagem
function trocarImagem(descricao) {
    if(!descricao) {
        console.warn('Descrição não fornecida');
        return;
    }

    const imgPadrao = document.getElementById('img-padrao');
    const imgClima = document.getElementById('img-clima');

    if(!imgPadrao || !imgClima) {
        console.warn('Divs de imagem não encontradas');
        return;
    }

    const desc = descricao.toLowerCase().trim();
    console.log('Descrição recebida:', desc);
    
    // Nome do arquivo SEM extensão
    let imagem = 'padraoClear';

    
    if (desc.includes('tempestade') || desc.includes('trovoada') || desc.includes('storm') || desc.includes('thunderstorm')) {
        imagem = 'storm';
    }
    
    else if (desc.includes('neve') || desc.includes('snow')) {
        imagem = 'snow';
    }
    
    else if (desc.includes('chuva') || desc.includes('rain') || desc.includes('chuvoso') || desc.includes('garoa') || desc.includes('drizzle')) {
        imagem = 'rain';
    }
    
    else if (desc.includes('nublado') || desc.includes('nuvens') || desc.includes('cloud') || 
             desc.includes('encoberto') || desc.includes('overcast')) {
        imagem = 'cloudSky';
    }
    
    else if (desc.includes('limpo') || desc.includes('clear') || desc.includes('céu limpo') || 
             desc.includes('ensolarado') || desc.includes('sol') || desc.includes('sunny')) {
        imagem = 'clearSky';
    }

    console.log('Imagem selecionada:', imagem);

    // Caminho completo da imagem
    const caminhoImagem = `/imagens/${imagem}.jpg`;
    
    // carregar a imagem antes de mostrar
    const img = new Image();
    img.src = caminhoImagem;

    img.onload = () => {
        console.log('Imagem carregada com sucesso:', caminhoImagem);
        imgClima.style.backgroundImage = `url(${caminhoImagem})`;

        // esconde imagem padrao e mostra imagem do clima
        imgPadrao.classList.remove('img-ativo');
        imgPadrao.classList.add('img');
        imgClima.classList.remove('img');
        imgClima.classList.add('img-ativo');
        
        console.log('Classes aplicadas - imgPadrao:', imgPadrao.className, 'imgClima:', imgClima.className);
    }
    
    img.onerror = () => {
        console.error('Erro ao carregar imagem do clima:', caminhoImagem);
        // Mantém a imagem padrão se houver erro
    };

}