// Seleciona o formulário e o campo de entrada
const form = document.querySelector('form');
const input = document.querySelector('.input');
const resultado = document.querySelector('.resultado');

// Adiciona o evento de submit ao formulário
form.addEventListener('submit', async (event) => {

    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtém a aba ativa
    const tab = await chrome.tabs.query({ active: true, currentWindow: true});

    // Injeta o script na página atual, passando o CEP como argumento
    chrome.scripting.executeScript({
        target: { tabId: tab[0].id },
        func: buscaCEP,
        args: [input.value], // Passa o CEP como argumento
    }).then(
        () => console.log("injected a function")
    );
    
});

// Função para consultar o CEP
function buscaCEP(cep) {
    // URL da API ViaCEP
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    // Faz a requisição para a API
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao buscar o CEP");
            }
            return response.json(); // Converte a resposta para JSON
        })
        .then((data) => {
            // Exibe os dados no console
            console.log("Dados do CEP:", data);

            // Exemplo de uso dos dados na página
            const div = document.createElement('div');
            div.textContent = `Endereço: ${data.logradouro}, Bairro: ${data.bairro}, Cidade: ${data.localidade}, Estado: ${data.uf}`;
            document.body.appendChild(div);
        })
        .catch((error) => {
            console.error("Erro na requisição:", error.message);
        });
}