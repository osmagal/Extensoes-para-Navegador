# Como Criar uma Extensão para Navegador Chrome com API para Buscar CEP

Criar uma extensão para o navegador Chrome que utilize a API ViaCEP para buscar informações de CEP pode ser mais simples do que parece. Este artigo apresenta o passo a passo para configurar e implementar essa funcionalidade.

Por que criar uma extensão para busca de CEP?
Extensões para navegador são ferramentas práticas para automatizar tarefas diárias. Utilizar a API ViaCEP, por exemplo, permite consultar rapidamente informações de endereço a partir de um CEP diretamente no navegador.

Configurando o Manifesto da Extensão
O primeiro passo é criar o arquivo manifest.json. Ele define as permissões e configurações principais da extensão.

json
Copiar código
{
  "manifest_version": 3,
  "name": "Buscar CEP",
  "version": "1.0",
  "description": "Extensão para buscar endereço por CEP usando a API ViaCEP.",
  "permissions": ["scripting", "activeTab"],
  "host_permissions": ["<all urls>"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "cep.png"
  }
}
# Criando o Frontend da Extensão
Para o design e interface, utilizamos um arquivo popup.html. Ele contém o formulário para inserção do CEP e exibição dos resultados.

Estrutura HTML
html
Copiar código
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buscar CEP</title>
</head>
<body>
    <form>
        <label for="input">Digite o CEP:</label>
        <input type="text" id="input" class="input" placeholder="Ex: 01001000" required>
        <button type="submit">Buscar</button>
    </form>
    <div class="resultado"></div>
    <script src="popup.js"></script>
</body>
</html>
Esse formulário coleta o CEP e exibe as informações retornadas pela API.

Implementando a Lógica com JavaScript
Agora, configuramos o arquivo popup.js para gerenciar o envio do CEP e a comunicação com a API ViaCEP.

Código do Arquivo popup.js
javascript
Copiar código
// Seleciona elementos da interface
const form = document.querySelector('form');
const input = document.querySelector('.input');
const resultado = document.querySelector('.resultado');

// Adiciona evento ao formulário
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o comportamento padrão

    // Obtém a aba ativa do navegador
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Injeta a função para buscar CEP
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: buscaCEP,
        args: [input.value], // Passa o CEP como argumento
    }).then(() => {
        console.log("Função injetada com sucesso!");
    });
});

// Função para consultar CEP
function buscaCEP(cep) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao buscar o CEP");
            }
            return response.json();
        })
        .then((data) => {
            // Exibe os dados na página
            const div = document.createElement('div');
            div.textContent = `Endereço: ${data.logradouro}, Bairro: ${data.bairro}, Cidade: ${data.localidade}, Estado: ${data.uf}`;
            document.body.appendChild(div);
        })
        .catch((error) => {
            console.error("Erro na requisição:", error.message);
        });
}

# Esse código realiza a consulta à API ViaCEP e injeta as informações de forma dinâmica no navegador.

Testando sua Extensão
Acesse o navegador Chrome.
Vá para chrome://extensions/.
Ative o modo desenvolvedor.
Carregue a pasta do projeto.
Teste a extensão inserindo um CEP válido.
Conclusão
Criar uma extensão para navegador que busca CEPs utilizando a API ViaCEP é uma excelente forma de aprender sobre desenvolvimento web e APIs. Além disso, essa solução pode ser personalizada para atender a diversas necessidades. Com ferramentas simples e práticas, você pode automatizar processos e otimizar o uso do navegador.
