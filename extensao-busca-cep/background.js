chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "processFile") {
        console.log("Processando arquivo no background");

        // Aqui você pode fazer qualquer processamento com o conteúdo do arquivo
        const fileContent = message.fileContent;

        // Exemplo: apenas retorna uma mensagem de sucesso
        sendResponse({
            success: true,
            message: "Arquivo processado com sucesso no background!",
        });
    }
});

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })