async function getResponseFromAPI(file) {
    try {
        // Faz a requisição à API com o texto fornecido.
        const response = await fetch("https://script.google.com/macros/s/YOUR_ID_APPS_SCRIPT/exec", {
            method: "POST", // Método POST para enviar dados.
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                file: file.content,
                name: file.name,
                type: file.type,
                url: file.url_file
            }) // Envia o texto como JSON.
        });

        // Verifica se a resposta foi bem-sucedida.
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        // Converte a resposta para JSON.
        const data = await response.text();

        // Exibe o resultado no console.
        //console.log("Resposta da API:", data);

        // Retorna o JSON no formato desejado.
        return data.trim() || "Resposta não disponível";
    } catch (error) {
        console.error("Erro ao obter resposta do servidor: ", error);
        return "Erro ao processar a solicitação";
    }
}