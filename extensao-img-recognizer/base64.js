async function convertToBase64(url) {
    // Carrega a imagem para verificar suas dimensões
    const image = new Image();
    image.src = url;

    return new Promise((resolve, reject) => {
        image.onload = async () => {
            // Verifica se a largura da imagem é maior que 1000px
            if (image.width > 1000) {
                // Cria um canvas para redimensionar a imagem
                const canvas = document.createElement('canvas');
                const scaleFactor = 1000 / image.width; // Calcula a escala
                canvas.width = 1000;
                canvas.height = image.height * scaleFactor;

                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0, canvas.width, canvas.height);

                // Converte a imagem redimensionada para base64
                const resizedBase64 = canvas.toDataURL('image/jpeg'); // Pode alterar o formato se necessário

                // Remove o prefixo "data:image/jpeg;base64," e resolve a string base64
                resolve(resizedBase64.split(',')[1]);
            } else {
                // Se a largura for menor ou igual a 1000px, converte diretamente
                const response = await fetch(url);
                const buffer = await response.arrayBuffer();
                const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
                resolve(base64String);
            }
        };

        image.onerror = (error) => {
            reject(new Error(`Erro ao carregar a imagem: ${error.message}`));
        };
    });
}