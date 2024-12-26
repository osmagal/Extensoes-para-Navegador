**Como Integrar Apps Script com Gemini para Análise de Texto**

Integrar o Google Apps Script com o modelo Gemini, da Google AI, é uma maneira poderosa de realizar análises de texto automatizadas. Este guia detalha como configurar e usar essa integração.

---

### **Obtenha a Chave de API do Gemini**
Antes de começar, você precisa de uma chave de API do Gemini. Siga estas etapas:  
1. Acesse o [Google AI Studio](https://aistudio.google.com/prompts/new_chat).  
2. Gere sua chave de API e salve-a em local seguro.

---

### **Configuração do Código no Apps Script**
Utilize o código abaixo para configurar sua integração. Este exemplo mostra como enviar um prompt e obter uma resposta do Gemini.

```javascript
// Substitua pela sua chave de API
const GEMINI_API_KEY = 'SUA_CHAVE_DE_API';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Função para chamar a API Gemini
 * @param {string} prompt O texto a ser enviado para o Gemini
 * @param {string} maxTokens Número máximo de tokens na resposta (padrão: 2500)
 * @param {string} temperature Parâmetro de temperatura (padrão: 0.7)
 * @return {string} Texto gerado pela API
 */
function GM(prompt, maxTokens = 2500, temperature = 0.7) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Por favor, forneça um prompt válido.');
  }

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: temperature
    }
  };

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    payload: JSON.stringify(requestBody),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, options);
    const responseData = JSON.parse(response.getContentText());

    if (response.getResponseCode() !== 200) {
      throw new Error(`Erro na API: ${responseData.error?.message || 'Erro desconhecido'}`);
    }

    const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      throw new Error('Formato inesperado na resposta da API.');
    }

    return generatedText;
  } catch (error) {
    Logger.log(`Erro: ${error.message}`);
    return `Erro: ${error.message}`;
  }
}
```

---

### **Como Usar a Função GM no Apps Script**
1. Acesse o Google Apps Script.  
2. Cole o código acima no editor.  
3. Salve e execute a função `GM` com o prompt desejado como parâmetro.  

---

### **Parâmetros Customizáveis**
- **Prompt:** O texto que será analisado pelo Gemini.  
- **MaxTokens:** Limita o número de tokens na resposta.  
- **Temperature:** Controla a criatividade das respostas. Valores mais baixos tornam o texto mais objetivo.  

---

### **Exemplo de Uso Prático**
```javascript
function exemploDeUso() {
  const resultado = GM('Forneça um resumo detalhado sobre sustentabilidade ambiental.', 1500, 0.6);
  Logger.log(resultado);
}
```
Este exemplo envia uma solicitação para o Gemini e registra a resposta.

---

### **Vantagens da Integração**
- **Automação:** Processa textos extensos em segundos.  
- **Flexibilidade:** Personalize prompts para atender às suas necessidades.  
- **Eficiência:** Economize tempo com análises automatizadas.

---

### **Considerações Finais**
A integração do Apps Script com o Gemini oferece uma abordagem eficaz para análise de texto. Com poucos ajustes, você pode adaptar essa solução para diversos casos de uso, como relatórios, insights e resumos. Experimente agora e veja os benefícios dessa poderosa integração!  

**⭐ Dica:** Não compartilhe sua chave de API publicamente para evitar usos não autorizados.
