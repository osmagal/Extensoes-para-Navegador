// Botão para seleção do arquivo PDF.
document.querySelector(".file").addEventListener("change", async () => {
    // Abre o seletor de arquivos.
        
        const file = document.querySelector(".file").files[0];

        document.querySelector("#loading").style.display = "flex";
        document.querySelector("#output").style.display = "none";

        if (file) {

            let fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = async function () {
                const b64 = fr.result.split("base64,")[1];
                const resp = await getResponseFromAPI(b64, file);
                // Exibe a resposta na tela.
                const output = document.getElementById("output");
                output.value = resp;
                document.querySelector("#loading").style.display = "none";
                document.querySelector("#output").style.display = "flex";
            }
        }else{
            
            document.querySelector("#loading").style.display = "none";
            document.querySelector("#output").style.display = "flex";
            document.querySelector("#output").value = "Insira uma URL válida";
        }
});

document.querySelector(".input").addEventListener("change", async () => {
    const urlImg = document.querySelector(".input").value;

    document.querySelector("#loading").style.display = "flex";
    document.querySelector("#output").style.display = "none";

    if (urlImg){
        
        const b64 = await convertToBase64(urlImg);
        const resp = await getResponseFromAPI(b64, { name: "image.jpg", type: "image/jpeg" });
        // Exibe a resposta na tela.
        const output = document.getElementById("output");
        output.value = resp;
        document.querySelector("#loading").style.display = "none";
        document.querySelector("#output").style.display = "flex";

    }else{
            
        document.querySelector("#loading").style.display = "none";
        document.querySelector("#output").style.display = "flex";
        document.querySelector("#output").value = "Insira uma URL válida";
    }
});

async function convertToBase64(url) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
    return base64String;
}

async function getResponseFromAPI(imgB64, file) {
    try {
        // Faz a requisição à API com o texto fornecido.
        const response = await fetch("https://script.google.com/macros/s/YOUR_KEY_APPS_SCRIPT/exec", {
            method: "POST", // Método POST para enviar dados.
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                file: imgB64,
                name: file.name,
                type: file.type
            }) // Envia o texto como JSON.
        });

        // Verifica se a resposta foi bem-sucedida.
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        // Converte a resposta para JSON.
        const data = await response.text();

        // Exibe o resultado no console.
        console.log("Resposta da API:", data);

        // Retorna o JSON no formato desejado.
        return data.trim() || "Resposta não disponível";
    } catch (error) {
        console.error("Erro ao obter resposta do servidor: ", error);
        return "Erro ao processar a solicitação";
    }
}