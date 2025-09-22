import  { Predictions} from '@aws-amplify/predictions';



async function ProcessChatText(content, sourceLang, tagretLang) {

    let transcriptMessage = await Predictions.convert({
        translateText: {
            source: {
                text: content,
                language: sourceLang, // defaults configured on aws-exports.js
                // supported languages https://docs.aws.amazon.com/translate/latest/dg/how-it-works.html#how-it-works-language-codes
            },
            targetLanguage: tagretLang
        }
    });
    return transcriptMessage.text
}
export default ProcessChatText


// import { Predictions } from '@aws-amplify/predictions'; // ❌ no longer needed
 
// async function ProcessChatText(content, sourceLang, tagretLang) {
 
//     // Payload to send to custom API
//     const payload = {
//         text: content,
//         from: sourceLang,
//         to: tagretLang
//     };
 
//     try {
//         // Direct call to custom API
//         const response = await fetch('https://flv38gpj2c.execute-api.us-east-1.amazonaws.com/test/translate', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(payload),
//         });
 
//         const resp = await response.json();
 
//         // Return translated text
//         return resp.translatedText || resp.translation || content;
 
//     } catch (error) {
//         console.error('ProcessChatText API error:', error);
//         return content; // fallback to original
//     }
// }
 
// export default ProcessChatText;
