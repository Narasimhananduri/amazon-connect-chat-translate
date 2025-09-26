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


async function ProcessChatText(content, sourceLang, tagretLang) {

  try {

    let response = await fetch('https://37kq2m4kba.execute-api.us-east-1.amazonaws.com/dev', { 

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

      },

      body: JSON.stringify({

        content: content,

        sourceLang: sourceLang,

        targetLang: tagretLang,

      }),

    });
 
    let data = await response.json();
 
    // If API Gateway wrapped it, parse again

    let parsedBody = data.body ? JSON.parse(data.body) : data;
 
    // Match Amplify Predictions return format

    let transcriptMessage = {

      translatedText: parsedBody.translatedText || content, // main translation

      sourceLanguage: parsedBody.sourceLanguage || sourceLang,

      targetLanguage: parsedBody.targetLanguage || tagretLang,

    };
 
    return transcriptMessage;  // <-- return object like Amplify did

  } catch (error) {

    console.error('Custom translation API failed:', error);

    return {

      translatedText: content,  // fallback

      sourceLanguage: sourceLang,

      targetLanguage: tagretLang,

    };

  }

}
 
export default ProcessChatText;
