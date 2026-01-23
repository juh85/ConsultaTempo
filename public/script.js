let timeout = null;

// Função para buscar a previsão do tempo
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
