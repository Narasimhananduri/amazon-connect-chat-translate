import { post } from '@aws-amplify/api';
//async function ProcessChatTextAPI(content, sourceLang, targetLang, terminologyNames)
async function ProcessChatTextAPI(content, sourceLang, targetLang) {
    const apiName = 'amazonTranslateAPI';
    const path = '/translate';
    const myInit = { // OPTIONAL
        body: { 'content': content, 'sourceLang': sourceLang, 'targetLang': targetLang },
        //body: { 'content': content, 'sourceLang': sourceLang, 'targetLang': targetLang, 'terminologyNames': terminologyNames },
        headers: {
        }, // OPTIONAL
    };
    console.log("ProcessChatTextAPI: ", content);
    console.log("ProcessChatTextAPI: ", sourceLang);
    console.log("ProcessChatTextAPI: ", targetLang);
    //console.log("ProcessChatTextAPI: ", terminologyNames);
    console.log("ProcessChatTextAPI: ", path);
    console.log("ProcessChatTextAPI: ", myInit);
    console.log("API Name: ", apiName);
    try {
        const result = await post({
            apiName,
            path,
            options: myInit,
        }).response
        console.log("Translated Message Payload: ", result);
        const res = result.body
        console.log("Translated Message: ", res);
        const resp = await res.json();
        console.log("Response: ", resp);
        return resp;
    }
    catch (error) {
        console.error("ProcessChatTextAPI: ", error);
        return error;
    }
}
export default ProcessChatTextAPI


// src/utils/ProcessChatTextAPI.js

// 🔁 Remove this AWS import (no longer needed)
// import { post } from '@aws-amplify/api';

// async function ProcessChatTextAPI(content, sourceLang, targetLang) {
//     const apiName = 'amazonTranslateAPI'; // ❗ Kept for logging only
//     const path = '/translate'; // ❗ Kept for logging only

//     const myInit = {
//         body: { 'content': content, 'sourceLang': sourceLang, 'targetLang': targetLang },
//         headers: {}, // Optional headers (empty unless needed)
//     };

//     console.log("ProcessChatTextAPI: ", content);
//     console.log("ProcessChatTextAPI: ", sourceLang);
//     console.log("ProcessChatTextAPI: ", targetLang);
//     console.log("ProcessChatTextAPI: ", path);
//     console.log("ProcessChatTextAPI: ", myInit);
//     console.log("API Name: ", apiName);

//     try {
//         // 🔁 Replace AWS Amplify post() with standard fetch() call
//         const response = await fetch('https://flv38gpj2c.execute-api.us-east-1.amazonaws.com/test/translate', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 ...myInit.headers, // In case you want to add custom headers later
//             },
//             body: JSON.stringify(myInit.body),
//         });

//         console.log("Translated Message Payload: ", response);

//         const res = response.body;
//         console.log("Translated Message: ", res);

//         const resp = await response.json();
//         console.log("Response: ", resp);

//         return resp;
//     } catch (error) {
//         console.error("ProcessChatTextAPI: ", error);
//         return error;
//     }
// }

// export default ProcessChatTextAPI;




