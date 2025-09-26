// import  { Predictions} from '@aws-amplify/predictions';



// async function ProcessChatText(content, sourceLang, tagretLang) {

//     let transcriptMessage = await Predictions.convert({
//         translateText: {
//             source: {
//                 text: content,
//                 language: sourceLang, // defaults configured on aws-exports.js
//                 // supported languages https://docs.aws.amazon.com/translate/latest/dg/how-it-works.html#how-it-works-language-codes
//             },
//             targetLanguage: tagretLang
//         }
//     });
//     return transcriptMessage.text
// }
// export default ProcessChatText


async function ProcessChatText(content, sourceLang, targetLang) {
  try {
    let response = await fetch('https://37kq2m4kba.execute-api.us-east-1.amazonaws.com/dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content,
        sourceLang: sourceLang,
        targetLang: targetLang,
      }),
    });
 
    let data = await response.json();
 
    // Match Amplify Predictions return format:
    // transcriptMessage.text must be a string (translated text only)
    let transcriptMessage = {
      text: data.translatedText || content, // fallback to original
    };
 
    return transcriptMessage.text;
  } catch (error) {
    console.error('Custom translation API failed:', error);
    return content; // fallback to original if error
  }
}
 
export default ProcessChatText;
