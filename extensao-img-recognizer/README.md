# **Como Criar uma Extensão para Chrome que Lê PDFs e Resume o Conteúdo com IA**

## **Introdução à Extensão para Chrome**

Desenvolver uma extensão para o navegador Chrome pode ser uma tarefa desafiadora, mas extremamente recompensadora. Neste artigo, exploraremos como criar uma extensão que lê arquivos PDF, processa o conteúdo e utiliza o Gemini, a IA do Google, para fornecer um resumo conciso e preciso.

---

## **Configuração Inicial do Botão para Seleção de Arquivo**

O primeiro passo é criar um botão que permita ao usuário selecionar o arquivo PDF diretamente no navegador. O trecho abaixo mostra como configurar o evento de clique no botão:

```javascript
document.getElementById("select-pdf").addEventListener("click", async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";

    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            processarPDF(file);
        }
    };

    input.click();
});
```

Essa abordagem utiliza o elemento `<input>` para selecionar arquivos de forma intuitiva e funcional.

---

## **Processamento do Arquivo PDF**

Para extrair o conteúdo do arquivo PDF, usamos a biblioteca PDF.js, uma ferramenta poderosa e prática para lidar com PDFs em JavaScript. O exemplo abaixo destaca o código para processar todas as páginas do documento:

```javascript
const reader = new FileReader();
reader.onload = async function () {
    const typedArray = new Uint8Array(reader.result);
    const pdf = await pdfjsLib.getDocument(typedArray).promise;
    let pageContent = '';

    for (let i = 1; i <= pdf._pdfInfo.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const dataPage = textContent.items.map((item) => item.str).join(" ");
        pageContent += dataPage;
    }

    console.log(pageContent);
    enviarParaGemini(pageContent);
};
reader.readAsArrayBuffer(file);
```

Essa lógica percorre cada página do PDF, extraindo e concatenando o texto.

---

## **Integração com o Gemini**

A integração com a IA Gemini é realizada por meio de uma requisição HTTP para uma API. O código a seguir detalha a chamada e o processamento do retorno:

```javascript
async function getResponseFromAPI(inputText) {
    try {
        const response = await fetch("https://script.google.com/macros/s/SEU_ENDPOINT_AQUI/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: inputText })
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        return { response: data.response || "Resposta não disponível" };
    } catch (error) {
        console.error("Erro ao obter resposta do servidor: ", error);
        return { response: "Erro ao processar a solicitação" };
    }
}
```

Após extrair o conteúdo do PDF, ele é enviado ao endpoint configurado para obter o resumo gerado pela IA.

---

## **Exibição do Resultado**

Por fim, o resumo é exibido ao usuário em um campo de saída, permitindo acesso rápido e fácil ao conteúdo sintetizado:

```javascript
const output = document.getElementById("output");
output.value = await resp.response;
```

Essa abordagem melhora a experiência do usuário, oferecendo resultados imediatos e precisos.

---

## **Conclusão**

Combinando tecnologias modernas como PDF.js e a IA Gemini, é possível criar soluções inovadoras que otimizam processos. Este projeto demonstra como as extensões para Chrome podem transformar tarefas complexas em experiências simples e eficientes.

Explore essas técnicas e leve suas habilidades de desenvolvimento ao próximo nível!
