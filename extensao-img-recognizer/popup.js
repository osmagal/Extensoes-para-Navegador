// Botão para seleção do arquivo PDF.
document.querySelector(".file").addEventListener("change", async () => {
    // Abre o seletor de arquivos.
        
        const file = document.querySelector(".file").files[0];
        document.querySelector(".input").value = "";

        document.querySelector("#loading").style.display = "flex";
        document.querySelector("#output").style.display = "none";

        if (file) {

            let fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = async function () {
                const b64 = fr.result.split("base64,")[1];
                const resp = await getResponseFromAPI({ content: b64, name: file.name, type: file.type});
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
    const url = document.querySelector(".input").value;
    document.querySelector(".file").value = "";

    document.querySelector("#loading").style.display = "flex";
    document.querySelector("#output").style.display = "none";

    if (url){

        await verificarArquivoPorURL(url).then(async informacoes => {
            const tipoArquivo = informacoes.tipo;
            const nomeArquivo = informacoes.nome;
        
            console.log('Tipo do arquivo:', tipoArquivo);
            console.log('Nome do arquivo:', nomeArquivo);

            let resp;
            const output = document.getElementById("output");

            console.log('Tipo do arquivo:', tipoArquivo);

            if (tipoArquivo && tipoArquivo.includes("image/")) {
                console.log('Imagem');
                // Use as variáveis tipoArquivo e nomeArquivo conforme necessário
                const b64 = await convertToBase64(url);
                resp = await getResponseFromAPI({ content: b64, name: nomeArquivo, type: tipoArquivo});
                // Exibe a resposta na tela.
                
                output.value = resp;

            } else {
                // Condição que atende arquivos pdf passados por url
                resp = await getResponseFromAPI({ url_file: url });
                output.value = resp;
            }
            
            document.querySelector("#loading").style.display = "none";
            document.querySelector("#output").style.display = "flex";
          })
          .catch(error => {
            console.error('Erro ao verificar o arquivo:', error);
          });

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

async function getResponseFromAPI(file) {
    try {
        // Faz a requisição à API com o texto fornecido.
        const response = await fetch("https://script.google.com/macros/s/AKfycbzNkbcFer9ENipAdWlfVsA3K2cdgrrLUjT2Gze2RlxP_YGt-f6QMTnchmLbQZR_jkQf/exec", {
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

function verificarArquivoPorURL(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, true);
    
        xhr.onload = function() {
          if (xhr.status === 200) {
            const contentType = xhr.getResponseHeader('Content-Type');
            const nomeArquivo = url.split('/').pop();
    
            resolve({
              tipo: contentType,
              nome: nomeArquivo
            });
          } else {
            reject(new Error(`Erro ao obter informações do arquivo: ${xhr.statusText}`));
          }
        };
    
        xhr.onerror = function() {
          reject(new Error('Erro de rede:', xhr.statusText));
        };
    
        xhr.send();
      });
}
