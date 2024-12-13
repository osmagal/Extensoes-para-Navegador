// Seleciona o formulário e o campo de entrada
const form = document.querySelector('form');
const input = document.querySelector('.input');
const resultado = document.querySelector('.resultado');

// Adiciona o evento de submit ao formulário
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const cnpj = input.value.trim().replace(/\D/g, ''); // Remove caracteres não numéricos
    if (!cnpj) {
        resultado.textContent = "Por favor, insira um CNPJ válido.";
        resultado.style.color = "red";
        return;
    }

    const dadosCNPJ = await buscaCNPJ(cnpj);

    if (!dadosCNPJ) {
        resultado.textContent = "CNPJ não encontrado ou erro na consulta. Tente novamente.";
        resultado.style.color = "red";
        return;
    }

    // Exibe os dados no elemento 'resultado'
    resultado.style.padding = "18px";
    resultado.style.fontSize = "12px";
    resultado.style.fontWeight = "700";
    resultado.style.color = "black";

    resultado.innerHTML = `
        <p><strong>Razão Social:</strong> ${dadosCNPJ.company.name}</p>
        <p><strong>Fantasia:</strong> ${dadosCNPJ.alias || 'N/A'}</p>
        <p><strong>CNPJ:</strong> ${dadosCNPJ.taxId}</p>
        <p><strong>Status:</strong> ${dadosCNPJ.status.text}</p>
        <p><strong>Atividade Principal:</strong> ${dadosCNPJ.mainActivity.text}</p>
        <p><strong>Telefone:</strong> ${dadosCNPJ.phones.map(phone => `(${phone.area}) ${phone.number}`).join(', ') || 'N/A'}</p>
        <p><strong>E-mail:</strong> ${dadosCNPJ.emails.map(email => email.address).join(', ') || 'N/A'}</p>
        <p><strong>Endereço:</strong> ${dadosCNPJ.address.street}, ${dadosCNPJ.address.number}, ${dadosCNPJ.address.district}, ${dadosCNPJ.address.city} - ${dadosCNPJ.address.state}, CEP: ${dadosCNPJ.address.zip}</p>
    `;
});

// Função para consultar o CNPJ
async function buscaCNPJ(cnpj) {
    try {
        const url = `https://open.cnpja.com/office/${cnpj}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erro ao buscar dados na API');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro na função buscaCNPJ:", error.message);
        return null;
    }
}
