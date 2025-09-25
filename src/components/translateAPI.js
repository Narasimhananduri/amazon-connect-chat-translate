// import { post } from '@aws-amplify/api';
// //async function ProcessChatTextAPI(content, sourceLang, targetLang, terminologyNames)
// async function ProcessChatTextAPI(content, sourceLang, targetLang) {
//     const apiName = 'amazonTranslateAPI';
//     const path = '/translate';
//     const myInit = { // OPTIONAL
//         body: { 'content': content, 'sourceLang': sourceLang, 'targetLang': targetLang },
//         //body: { 'content': content, 'sourceLang': sourceLang, 'targetLang': targetLang, 'terminologyNames': terminologyNames },
//         headers: {
//         }, // OPTIONAL
//     };
//     console.log("ProcessChatTextAPI: ", content);
//     console.log("ProcessChatTextAPI: ", sourceLang);
//     console.log("ProcessChatTextAPI: ", targetLang);
//     //console.log("ProcessChatTextAPI: ", terminologyNames);
//     console.log("ProcessChatTextAPI: ", path);
//     console.log("ProcessChatTextAPI: ", myInit);
//     console.log("API Name: ", apiName);
//     try {
//         const result = await post({
//             apiName,
//             path,
//             options: myInit,
//         }).response
//         console.log("Translated Message Payload: ", result);
//         const res = result.body
//         console.log("Translated Message: ", res);
//         const resp = await res.json();
//         console.log("Response: ", resp);
//         return resp;
//     }
//     catch (error) {
//         console.error("ProcessChatTextAPI: ", error);
//         return error;
//     }
// }
// export default ProcessChatTextAPI


// async function ProcessChatTextAPI(content, sourceLang, targetLang) {
//     const endpoint = 'https://37kq2m4kba.execute-api.us-east-1.amazonaws.com/dev'; // Replace with your real endpoint
//     const myInit = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             content: content,
//             sourceLang: sourceLang,
//             targetLang: targetLang
//         })
//     };

//     console.log("ProcessChatTextAPI: ", content);
//     console.log("ProcessChatTextAPI: ", sourceLang);
//     console.log("ProcessChatTextAPI: ", targetLang);
//     console.log("ProcessChatTextAPI: ", endpoint);
//     console.log("ProcessChatTextAPI: ", myInit);

//     try {
//         const result = await fetch(endpoint, myInit);
//         console.log("Translated Message Payload: ", result);

//         const res = await result.json();
//         console.log("Translated Message: ", res);

//         return res; // Expected to be: { translatedText, sourceLanguage, targetLanguage }
//     } catch (error) {
//         console.error("ProcessChatTextAPI: ", error);
//         return {
//             error: 'Translation failed',
//             translatedText: content // fallback
//         };
//     }
// }

// export default ProcessChatTextAPI;
async function ProcessChatTextAPI(content, sourceLang, targetLang) {
  const endpoint = 'https://37kq2m4kba.execute-api.us-east-1.amazonaws.com/dev'; // Replace with your real endpoint
 
  const myInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: content,
      sourceLang: sourceLang,
      targetLang: targetLang,
    }),
  };
 
  console.log("ProcessChatTextAPI: ", content);
  console.log("ProcessChatTextAPI: ", sourceLang);
  console.log("ProcessChatTextAPI: ", targetLang);
  console.log("ProcessChatTextAPI: ", endpoint);
  console.log("ProcessChatTextAPI: ", myInit);
 
  try {
    const result = await fetch(endpoint, myInit);
    const rawData = await result.json();
 
    console.log("Raw API Response: ", rawData);
 
    // API Gateway wraps body as a string → parse it
    const parsedBody =
      typeof rawData.body === 'string' ? JSON.parse(rawData.body) : rawData;
 
    console.log("Parsed API Body: ", parsedBody);
 
    // Return same format as Amplify Predictions (string only)
    return parsedBody.translatedText || content;
  } catch (error) {
    console.error("ProcessChatTextAPI Error: ", error);
    return content; // fallback to original
  }
}
 
export default ProcessChatTextAPI;
