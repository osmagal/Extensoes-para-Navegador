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

            if (tipoArquivo && tipoArquivo.includes("image/")) {
                console.log('Imagem por URL');
                
                // Use as variáveis tipoArquivo e nomeArquivo conforme necessário
                const b64 = await convertToBase64(url);

                // Faz a requisição à API com o texto fornecido.
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