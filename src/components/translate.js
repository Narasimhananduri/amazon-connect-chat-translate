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


// import { Predictions } from '@aws-amplify/predictions';

async function ProcessChatText(content, sourceLang, tagretLang) {
    // let transcriptMessage = await Predictions.convert({
    //     translateText: {
    //         source: {
    //             text: content,
    //             language: sourceLang, // defaults configured on aws-exports.js
    //         },
    //         targetLanguage: tagretLang
    //     }
    // });

    // Custom API version
    let response = await fetch('https://your-custom-api-url/translate', {
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

    // Simulate same structure as original Amplify response
    let transcriptMessage = {
        text: {
            translatedText: data.translatedText,
            sourceLanguage: data.sourceLanguage,
            targetLanguage: data.targetLanguage,
        },
    };

    return transcriptMessage.text;
}

export default ProcessChatText;
