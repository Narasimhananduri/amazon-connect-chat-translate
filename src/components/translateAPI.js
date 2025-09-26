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

async function ProcessChatTextAPI(content, sourceLang, targetLang) {
    const endpoint = 'https://37kq2m4kba.execute-api.us-east-1.amazonaws.com/dev'; // Replace with your real endpoint

    const myInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: content,
            sourceLang: sourceLang,
            targetLang: targetLang
        })
    };

    console.log("ProcessChatTextAPI: ", content);
    console.log("ProcessChatTextAPI: ", sourceLang);
    console.log("ProcessChatTextAPI: ", targetLang);
    console.log("ProcessChatTextAPI: ", endpoint);
    console.log("ProcessChatTextAPI: ", myInit);

    try {
        const result = await fetch(endpoint, myInit);
        const data = await result.json();

        console.log("Translated Message Payload: ", data);

        // ✅ Return full object to mimic AWS response
        const response = {
            translatedText: data.translatedText || content,
            sourceLanguage: sourceLang,
            targetLanguage: targetLang
        };

        console.log("Final Translated Message: ", response);
        return response;

    } catch (error) {
        console.error("ProcessChatTextAPI Error: ", error);

        // ✅ Fallback to original format on error
        return {
            translatedText: content, // return original text
            sourceLanguage: sourceLang,
            targetLanguage: targetLang
        };
    }
}

export default ProcessChatTextAPI;
