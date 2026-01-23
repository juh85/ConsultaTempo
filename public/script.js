let timeout = null;

// Função para buscar a previsão do tempo
async function previsaoTempo() {
    const cidadeInput = document.getElementById('cidade');
    const resultado = document.getElementById('resultado');

    const cidade = cidadeInput.value.trim();

    if (!cidade) {
        resultado.innerHTML = '<p>Digite o nome de uma cidade.</p>';
        return;
    }

    try {
        const url = `/clima/${encodeURIComponent(cidade)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error('Erro ao buscar dados');
        }

        // Verifica se os dados necessários existem
        if (!data.cidade || data.temperatura === undefined) {
            resultado.innerHTML = '<p>Dados incompletos recebidos da API.</p>';
            return;
        }

        resultado.innerHTML = `
            <p><strong>Previsão do tempo para ${data.cidade}</strong></p>
            <p>Temperatura: ${data.temperatura}°C</p>
            <p>Sensação térmica: ${data.sensacao}°C</p>
            <p>Descrição: ${data.descricao}</p>
            <p>Umidade: ${data.umidade}%</p>
        `;
    } catch (error) {
        resultado.innerHTML = '<p>Não foi possível buscar a previsão.</p>';
        console.error('Erro ao buscar previsão:', error)
    }
}

