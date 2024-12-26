// Botão para seleção do arquivo PDF.
document.getElementById("select-pdf").addEventListener("click", async () => {
    // Abre o seletor de arquivos.
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";

    input.onchange = (event) => {

        const file = event.target.files[0];

        if (file) {
            // Leitura do arquivo PDF.
            const reader = new FileReader();
            reader.onload = async function () {
                const typedArray = new Uint8Array(reader.result);

                // Usa a biblioteca PDF.js para processar o PDF.
                const pdf = await pdfjsLib.getDocument(typedArray).promise;
                console.log(pdf._pdfInfo.numPages);

                var pageContent = '';//Armazena o conteúdo de cada página

                // Opção 1: Verifica o conteúdo de cada página e atribui a cada posição do vetor.
                for (var i = 1; i <= pdf._pdfInfo.numPages; i++){

                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const dataPage = textContent.items.map((item) => item.str).join(" ");
                    pageContent += dataPage;

                }

                console.log(pageContent);

                // Opção 2
                // Extrai dados da página 1.
                // const page1 = await pdf.getPage(1);
                // const textContent1 = await page1.getTextContent();

                // const dataPage1 = textContent1.items.map((item) => item.str).join(" ");
                // console.log(dataPage1);

                // Extrai dados da página 2.
                // const page2 = await pdf.getPage(2);
                // const textContent2 = await page2.getTextContent();
                // const dataPage2 = textContent2.items.map((item) => item.str).join(" ");

                // pageContent.push(dataPage1);
                // pageContent.push(dataPage2);

                const resp = await getResponseFromAPI(`
                Analise o seguinte texto, devolva um breve resumo sobre o conteúdo, escreva em português.

                ${pageContent}
                `
                );

                const output = document.getElementById("output");
                output.value = await resp.response;

            };

            reader.readAsArrayBuffer(file);
        }
    };

    input.click();
});


async function getResponseFromAPI(inputText) {
    try {
        // Faz a requisição à API com o texto fornecido.
        const response = await fetch("https://script.google.com/macros/s/'ID_DO_SEU_APPS_SCRIPT'/exec", {
            method: "POST", // Método POST para enviar dados.
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: inputText }) // Envia o texto como JSON.
        });

        // Verifica se a resposta foi bem-sucedida.
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        // Converte a resposta para JSON.
        const data = await response.json();

        // Exibe o resultado no console.
        console.log("Resposta da API:", data);

        // Retorna o JSON no formato desejado.
        return {
            response: data.response || "Resposta não disponível"
        };
    } catch (error) {
        console.error("Erro ao obter resposta do servidor: ", error);
        return { response: "Erro ao processar a solicitação" };
    }
}