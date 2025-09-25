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
    const response = await fetch('https://37kq2m4kba.execute-api.us-east-1.amazonaws.com/dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: content,
        sourceLang: sourceLang,
        targetLang: targetLang,
      }),
    });
 
    const data = await response.json();
 
    // Normalize to Amplify-style response
    return {
      text: {
        translatedText: data.translatedText || content,
      },
    };
  } catch (error) {
    console.error('Translation failed:', error);
    return {
      text: {
        translatedText: content, // fallback to original if error
      },
    };
  }
}
 
export default ProcessChatText;
