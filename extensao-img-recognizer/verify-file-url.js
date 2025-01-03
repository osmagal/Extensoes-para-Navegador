function verificarArquivoPorURL(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, true);

        xhr.onload = function () {
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

        xhr.onerror = function () {
            reject(new Error('Erro de rede:', xhr.statusText));
        };

        xhr.send();
    });
}
