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
//     console.log("Response payload:", detectLang);
//     return detectLang
// }

// export default DetectChatText

// detecttext.js

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

          type: 'language',

        },

      }),

    });
 
    // Step 1: API Gateway response

    const data = await response.json();
 
    // Step 2: Parse the stringified body

    const parsedBody = JSON.parse(data.body);
 
    // Step 3: Normalize into Amplify-style response

    return {

      textInterpretation: {

        language: parsedBody.detectedLanguage || 'en', // fallback to 'en'

      },

    };
 
  } catch (error) {

    console.error('Language detection failed:', error);

    return {

      textInterpretation: {

        language: 'en',

      },

    };

  }

}
export default DetectChatText
// async function DetectChatText(content) {
//   try {
//     const response = await fetch('https://7k1up84d6h.execute-api.us-east-1.amazonaws.com/prod/detect-language', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ 
//        text: {
//             source: {
//                 text: content,
//             },
//             type: 'language'
//         }
//       }),
//     });

//     const data = await response.json();

//     // The API returns { detectedLanguage: 'fr' }
//     return {
//       textInterpretation: {
//         language: data.detectedLanguage || 'en', // default to 'en' if missing
//       },
//     };
//   } catch (error) {
//     console.error('Language detection failed:', error);
//     // Fallback to 'en' if error
//     return {
//       textInterpretation: {
//         language: 'en',
//       },
//     };
//   }
// }

// export default DetectChatText;
