// Seleciona o formulário e o campo de entrada
const form = document.querySelector('form');
const input = document.querySelector('.input');
const resultado = document.querySelector('.resultado');

// Adiciona o evento de submit ao formulário
form.addEventListener('submit', async (event) => {

    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtém a aba ativa
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const dadosCNPJ = await buscaCNPJ(input.value);

    // Injeta o script na página atual, passando os dados do CNPJ como argumento
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: executeScript,
        args: [dadosCNPJ], // Passa os dados do CNPJ como argumento
    }).then(
        () => console.log("Mostrando dados do CNPJ")
    );

});

async function executeScript(data) {

    // Exemplo de uso dos dados na página
    const resultado = document.getElementById('resultado');
    resultado.style.padding = "18px";
    resultado.style.fontSize = "12px";
    resultado.style.fontWeight = "700";
    resultado.style.color = "black";

    resultado.textContent = `
        Nome: ${data.nome}\n
        Fantasia: ${data.fantasia}\n
        CNPJ: ${data.cnpj}\n
        Atividade Principal: ${data.atividade_principal[0]?.text}\n
        Endereço: ${data.logradouro}, ${data.numero}, ${data.bairro}, ${data.municipio} - ${data.uf}\n
        Situação: ${data.situacao}
    `;

    return true;
}

// Função para consultar o CNPJ
async function buscaCNPJ(cnpj) {

    try {
        // URL da API pública de consulta de CNPJ (substitua pela API desejada)
        const url = `https://www.receitaws.com.br/v1/cnpj/${cnpj.replace(/\D/g, '')}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erro ao buscar dados na API');
        }
        const data = await response.json();

        if (data.status === 'ERROR') {
            throw new Error(data.message || 'CNPJ inválido ou não encontrado');
        }

        return data;

    } catch (error) {
        console.error("Erro na função buscaCNPJ:", error.message);
        return null;
    }
}
