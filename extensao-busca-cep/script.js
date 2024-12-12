// Seleciona o formulário e os campos de entrada e resultado
const form = document.querySelector('form');
const input = document.querySelector('.input');
const resultado = document.querySelector('.resultado');

// Adiciona o evento de submit ao formulário
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const cep = input.value.trim();

    // Validação básica do CEP
    if (!/^\d{5}-?\d{3}$/.test(cep)) {
        resultado.textContent = "Por favor, insira um CEP válido.";
        resultado.style.color = "red";
        return;
    }

    // Obtém os dados do CEP
    const dadosCEP = await buscaCEP(cep);

    if (!dadosCEP || dadosCEP.erro) {
        resultado.textContent = "CEP não encontrado. Verifique e tente novamente.";
        resultado.style.color = "red";
        return;
    }

    // Obtém a aba ativa
    chrome.tabs.query({ active: true, currentWindow: true }, function (){
        const resultado = document.querySelector('.resultado') || document.createElement('div');
        resultado.className = 'resultado';
        resultado.style.padding = "18px";
        resultado.style.fontSize = "12px";
        resultado.style.fontWeight = "700";
        resultado.style.color = "black";
        resultado.style.border = "1px solid #ddd";
        resultado.style.marginTop = "10px";
        resultado.textContent = `${dadosCEP.logradouro}, ${dadosCEP.bairro}, ${dadosCEP.localidade}, ${dadosCEP.uf}, Brasil, ${dadosCEP.cep}`;
        document.body.appendChild(resultado);
    });

    
});

// Função para consultar o CEP
async function buscaCEP(cep) {
    try {
        // Remove caracteres extras do CEP
        const sanitizedCEP = cep.replace(/\D/g, '');
        const url = `https://viacep.com.br/ws/${sanitizedCEP}/json/`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erro ao buscar dados na API');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Erro na função buscaCEP:", error.message);
        return null;
    }
}
