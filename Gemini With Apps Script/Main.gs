// Função principal para tratar requisições POST, parâmetro texto com até 2500 caracteres.
function doPost(e) {
  try {
    // Loga os parâmetros recebidos para depuração.
    Logger.log(e.postData.contents);

    // Converte o corpo da requisição em JSON.
    const requestData = JSON.parse(e.postData.contents);

    // Obtém o texto enviado pelo cliente.
    const inputText = requestData.text;

    // Processa o texto e retorna a resposta.
    const jsonResponse = getContent(inputText);

    // Cria e retorna uma resposta JSON.
    return ContentService
      .createTextOutput(JSON.stringify(jsonResponse))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Captura e retorna erros como resposta JSON.
    Logger.log("Erro no processamento: " + error.message);
    return ContentService
      .createTextOutput(JSON.stringify({ response: "Erro no servidor" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Função para processar o texto e gerar a resposta.
function getContent(text) {
  // Simula o processamento (substitua por sua lógica real).
  const processedResponse = GM(text);

  // Retorna a resposta formatada.
  return {
    response: processedResponse
  };
}