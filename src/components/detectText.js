// import { Predictions } from '@aws-amplify/predictions';

// async function DetectChatText(content) {

//     let detectLang = Predictions.interpret({
//         text: {
//             source: {
//                 text: content,
//             },
//             type: 'language'
//         }
//     })
//     return detectLang
// }

// export default DetectChatText

async function DetectChatText(content) {
  try {
    const response = await fetch('https://7k1up84d6h.execute-api.us-east-1.amazonaws.com/prod/detect-language', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
       text: {
            source: {
                text: content,
            },
            type: 'language'
        }
      }),
    });

    const data = await response.json();

    // The API returns { detectedLanguage: 'fr' }
    return {
      textInterpretation: {
        language: data.detectedLanguage || 'en', // default to 'en' if missing
      },
    };
  } catch (error) {
    console.error('Language detection failed:', error);
    // Fallback to 'en' if error
    return {
      textInterpretation: {
        language: 'en',
      },
    };
  }
}

export default DetectChatText;
