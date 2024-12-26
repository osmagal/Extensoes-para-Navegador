# **Extensão para Navegador Chrome: Como Buscar CNPJ com Facilidade**  

Se você precisa consultar dados de CNPJ com rapidez e praticidade, criar uma extensão para o navegador Chrome pode ser a solução ideal. Descubra como implementar uma ferramenta simples e eficiente utilizando HTML, CSS e JavaScript.  

---

## **O que é a extensão para buscar CNPJ?**  

Uma extensão para o Chrome permite realizar consultas rápidas a partir do navegador. Neste caso, a funcionalidade está focada em buscar informações detalhadas de um CNPJ diretamente da API, proporcionando agilidade para quem trabalha com dados empresariais.  

---

## **Como funciona a extensão?**  

A extensão utiliza:  

1. **HTML e CSS** para criar uma interface amigável.  
2. **JavaScript** para conectar-se à API de consulta.  
3. Arquivo **manifest.json** para configurar permissões e propriedades.  

### **Passo a passo do funcionamento**  

1. O usuário insere o CNPJ no campo de entrada.  
2. A extensão envia o CNPJ para a API configurada.  
3. Os dados retornados são exibidos em tempo real na interface.  

---

## **Estrutura do código da extensão**  

### **Arquivo HTML: Interface básica**  

```html  
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <form>
        <input type="text" class="input" placeholder="Digite o CNPJ">
        <button class="button">Buscar CNPJ</button>
    </form>
    <div class="resultado"></div>
    <script src="./script.js"></script>
</body>
</html>
```  

O arquivo HTML cria o layout com campos para inserção e exibição de resultados.  

---

### **Arquivo CSS: Estilização**  

```css  
body {
    width: 400px;
}

form {
    background-color: #f8f8f8;
    width: 90%;
    display: flex;
    padding: 20px;
    flex-direction: column;
    align-items: center;
}

.input {
    width: 82%;
    padding: 15px;
    outline: none;
    border-radius: 5px;
    border: 1px solid #ddd;
}

.button {
    width: 90%;
    padding: 15px;
    border: none;
    border-radius: 5px;
    margin-top: 15px;
    background-color: #453fc3;
    color: white;
    font-weight: 700;
    cursor: pointer;
}

.button:hover {
    background-color: #3f3389;
}
```  

O arquivo CSS garante uma interface atraente e responsiva.  

---

### **Arquivo JavaScript: Consulta à API**  

```javascript  
// Seleciona o formulário e o campo de entrada
const form = document.querySelector('form');
const input = document.querySelector('.input');
const resultado = document.querySelector('.resultado');

// Adiciona o evento de submit ao formulário
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cnpj = input.value.trim().replace(/\D/g, '');
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
```  

O script conecta a extensão à API e retorna os dados formatados.  

---

### **Manifest.json: Configurações**  

```json  
{
    "name": "Buscar CNPJ",
    "description": "Busca dados de CNPJ da API ReceitaWS",
    "version": "1.0",
    "manifest_version": 3,
    "permissions": [
        "activeTab", 
        "scripting"
    ],
    "host_permissions": [
        "https://*/*",
        "http://*/*"
    ],
    "action": {
        "default_popup": "index.html",
        "default_icon": "cnpj.png"
    }
}
```  

Esse arquivo define permissões e parâmetros da extensão.  

---

## **Conclusão**  

Criar uma extensão para buscar CNPJ no navegador Chrome é prático e acessível. Com essas orientações, você pode desenvolver uma ferramenta funcional que otimiza tarefas diárias. Personalize o código para atender às suas necessidades específicas.
