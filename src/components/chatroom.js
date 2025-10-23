// import React, { useEffect, useRef, useState } from 'react';
// import './chatroom.css';
// import Message from './message.js';
// //import translateText from './translate'
// import translateTextAPI from './translateAPI'
// import { addChat, useGlobalState } from '../store/state';

// const Chatroom = (props) => {

//     const [Chats] = useGlobalState('Chats');
//     const currentContactId = useGlobalState('currentContactId');
//     const [newMessage, setNewMessage] = useState("");
//     const [languageTranslate] = useGlobalState('languageTranslate');
//     const [languageOptions] = useGlobalState('languageOptions');
//     const agentUsername = 'AGENT';
//     const messageEl = useRef(null);
//     const input = useRef(null);
    
//     function getKeyByValue(object) {
//         let obj = languageTranslate.find(o => o.contactId === currentContactId[0]);
//         if(obj === undefined) {
//             return
//           } else {
//                 return Object.keys(object).find(key => object[key] === obj.lang);
//         }
        
//     }

//     const sendMessage = async(session, content) => {
//         const awsSdkResponse = await session.sendMessage({
//             contentType: "text/plain",
//             message: content
//         });
//         const { AbsoluteTime, Id } = awsSdkResponse.data;
//         console.log(AbsoluteTime, Id);
//     }

//     useEffect(() => {

//         // this ensures that the chat window will auto scoll to ensure the more recent message is in view
//         if (messageEl) {
//             messageEl.current.addEventListener('DOMNodeInserted', event => {
//                 const { currentTarget: target } = event;
//                 target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
//             });
//         }
//         // this ensure that the input box has the focus on load and after each entry
//         input.current.focus();
//     }, []);


//     async function handleSubmit(event) {
//         event.preventDefault();
//         // if there is no text in the the chat input box, do nothing.
//         if (newMessage === "") {
//             return;
//         }
//         let destLang = languageTranslate.find(o => o.contactId === currentContactId[0]);
//         console.log("destLang: ", destLang);

//         // translate the agent message  ** Swap the below two round if you wnat to test custom termonologies **
//         // let translatedMessage = await translateText(newMessage, 'en', destLang.lang);

//         /***********************************CUSTOM TERMINOLOGY*************************************************    
         
//             To support custom terminologies comment out the line above, and uncomment the below 2 lines 
         
//          ******************************************************************************************************/
//         console.log(newMessage);
//         let translatedMessageAPI = await translateTextAPI(newMessage, 'en', destLang.lang); // Provide a custom terminology created outside of this deployment
//         //let translatedMessageAPI = await translateTextAPI(newMessage, 'en', destLang.lang, ['connectChatTranslate']); // Provide a custom terminology created outside of this deployment
//         let translatedMessage = translatedMessageAPI.TranslatedText

//         console.log(` Original Message: ` + newMessage + `\n Translated Message: ` + translatedMessage);
//         // create the new message to add to Chats.
//         let data2 = {
//             contactId: currentContactId[0],
//             username: agentUsername,
//             content: <p>{newMessage}</p>,
//             translatedMessage: <p>{translatedMessage}</p>, // set to {translatedMessage.TranslatedText} if using custom terminologies
//         };
//         // add the new message to the store
//         addChat(prevMsg => [...prevMsg, data2]);
//         // clear the chat input box
//         setNewMessage("");

        
        
//         const session = retrieveValue(currentContactId[0]);

//         function retrieveValue(key){
//             var value = "";
//             for(var obj in props.session) {
//             for(var item in props.session[obj]) {
//                 if(item === key) {
//                     value = props.session[obj][item];
//                     break;
//                 }
//             }
//             }
//             return value;
//         }
//         sendMessage(session, translatedMessage);
//     }



//     return (
//         <div className="chatroom">
//                 <h3>Translate - ({languageTranslate.map(lang => {if(lang.contactId === currentContactId[0])return lang.lang})}) {getKeyByValue(languageOptions)}</h3>
//                 <ul className="chats" ref={messageEl}>
//                 {
//                         // iterate over the Chats, and only display the messages for the currently active chat session
//                         Chats.map(chat => {
//                             if(chat.contactId === currentContactId[0])
//                                 return<Message chat={chat} user={agentUsername} />
//                             }
//                         )
//                     }
//                 </ul>
//                 <form className="input" onSubmit={handleSubmit} >
//                     <input
//                           ref={input}
//                           maxLength = "1024"
//                           type="text"
//                           value={newMessage}
//                           onChange={e => setNewMessage(e.target.value)}
//                         />
//                     <input type="submit" value="Submit" />
//                 </form>
 
//             </div>
//     );
// };


// export default Chatroom;


// import React, { useEffect, useRef, useState } from 'react';
// import './chatroom.css';
// import Message from './message.js';
// //import translateText from './translate'
// import translateTextAPI from './translateAPI'
// import { addChat, useGlobalState } from '../store/state';

// // Import the isVoiceContact function from wherever you put it
// import { isVoiceContact } from './ccp.js'; 

// const Chatroom = (props) => {

//     const [Chats] = useGlobalState('Chats');
//     const currentContactId = useGlobalState('currentContactId');
//     const [newMessage, setNewMessage] = useState("");
//     const [languageTranslate] = useGlobalState('languageTranslate');
//     const [languageOptions] = useGlobalState('languageOptions');
//     const agentUsername = 'AGENT';
//     const messageEl = useRef(null);
//     const input = useRef(null);

//     // Helper to get language code key by value
//     function getKeyByValue(object) {
//         let obj = languageTranslate.find(o => o.contactId === currentContactId[0]);
//         if (obj === undefined) {
//             return;
//         } else {
//             return Object.keys(object).find(key => object[key] === obj.lang);
//         }
//     }

//     const sendMessage = async (session, content) => {
//         const awsSdkResponse = await session.sendMessage({
//             contentType: "text/plain",
//             message: content
//         });
//         const { AbsoluteTime, Id } = awsSdkResponse.data;
//         console.log(AbsoluteTime, Id);
//     }

//     useEffect(() => {
//         // Auto scroll chat window to bottom on new messages
//         if (messageEl) {
//             messageEl.current.addEventListener('DOMNodeInserted', event => {
//                 const { currentTarget: target } = event;
//                 target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
//             });
//         }
//         // Focus on input box initially and after each message send
//         input.current.focus();
//     }, []);

//     async function handleSubmit(event) {
//         event.preventDefault();

//         if (newMessage === "") {
//             return;
//         }

//         let destLang = languageTranslate.find(o => o.contactId === currentContactId[0]);
//         console.log("destLang: ", destLang);

//         // Check if the contact is voice or not
//         // We get the contact object from props.session by currentContactId
//         const session = retrieveValue(currentContactId[0]);
//         const contact = getContactFromSession(session); // You may want to implement this to get actual contact object
        
//         // If contact object is available, check media type
//         const isVoice = contact ? isVoiceContact(contact) : false;
//         console.log("Is voice contact? ", isVoice);

//         // Translate message via API
//         let translatedMessageAPI = await translateTextAPI(newMessage, 'en', destLang.lang);
//         let translatedMessage = translatedMessageAPI.TranslatedText;

//         console.log(`Original Message: ${newMessage}`);
//         console.log(`Translated Message: ${translatedMessage}`);

//         if (isVoice) {
//             // For voice contacts: call your API to get audio etc.
//             // Assuming you have some function to send text and get audio from your backend
//             const audioResponse = await fetchAudioFromApi(translatedMessage);

//             // You can then add the audio base64 or URL to your chat UI
//             let data2 = {
//                 contactId: currentContactId[0],
//                 username: agentUsername,
//                 content: <p>{newMessage}</p>,
//                 translatedMessage: <audio controls src={`data:audio/mp3;base64,${audioResponse.audio}`} />
//             };
//             addChat(prevMsg => [...prevMsg, data2]);
//         } else {
//             // For chat contacts, just add the translated text
//             let data2 = {
//                 contactId: currentContactId[0],
//                 username: agentUsername,
//                 content: <p>{newMessage}</p>,
//                 translatedMessage: <p>{translatedMessage}</p>,
//             };
//             addChat(prevMsg => [...prevMsg, data2]);
//         }

//         setNewMessage("");

//         sendMessage(session, translatedMessage);
//     }

//     // Helper to get session from props.session by contactId
//     function retrieveValue(key) {
//         var value = "";
//         for (var obj in props.session) {
//             for (var item in props.session[obj]) {
//                 if (item === key) {
//                     value = props.session[obj][item];
//                     break;
//                 }
//             }
//         }
//         return value;
//     }

//     // Placeholder for getting contact object from session or props (implement as needed)
//     function getContactFromSession(session) {
//         // This depends on how your session object structure is.
//         // For now return null or session.contact if exists
//         return session && session.contact ? session.contact : null;
//     }

//     // Placeholder for fetching audio from your API, pass the text and get back audio base64 string
//     async function fetchAudioFromApi(text) {
//         // Replace with your actual API call
//         const response = await fetch('https://nq47hkuui2.execute-api.us-east-1.amazonaws.com/test/polly', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ text })
//         });
//         const data = await response.json();
//         return data;
//     }

//     return (
//         <div className="chatroom">
//             <h3>Translate - ({languageTranslate.map(lang => { if (lang.contactId === currentContactId[0]) return lang.lang })}) {getKeyByValue(languageOptions)}</h3>
//             <ul className="chats" ref={messageEl}>
//                 {
//                     Chats.map(chat => {
//                         if (chat.contactId === currentContactId[0])
//                             return <Message chat={chat} user={agentUsername} />
//                     }
//                     )
//                 }
//             </ul>
//             <form className="input" onSubmit={handleSubmit} >
//                 <input
//                     ref={input}
//                     maxLength="1024"
//                     type="text"
//                     value={newMessage}
//                     onChange={e => setNewMessage(e.target.value)}
//                 />
//                 <input type="submit" value="Submit" />
//             </form>
//         </div>
//     );
// };

// export default Chatroom;




import React, { useEffect, useRef, useState } from 'react';
import './chatroom.css';
import Message from './message.js';
import translateTextAPI from './translateAPI';
import { addChat, useGlobalState } from '../store/state';

// Import the isVoiceContact function
import { isVoiceContact } from './ccp.js';

const Chatroom = (props) => {
    const [Chats] = useGlobalState('Chats');
    const currentContactId = useGlobalState('currentContactId');
    const [newMessage, setNewMessage] = useState("");
    const [languageTranslate] = useGlobalState('languageTranslate');
    const [languageOptions] = useGlobalState('languageOptions');
    const agentUsername = 'AGENT';
    const messageEl = useRef(null);
    const input = useRef(null);

    // 🔹 Debug ID prefix for easy tracking
    const DBG_PREFIX = "[CHATROOM-DEBUG]";

    // Helper: Get language key by value
    function getKeyByValue(object) {
        let obj = languageTranslate.find(o => o.contactId === currentContactId[0]);
        if (obj === undefined) return;
        return Object.keys(object).find(key => object[key] === obj.lang);
    }

    // Scroll chat to bottom
    useEffect(() => {
        if (messageEl.current) {
            messageEl.current.addEventListener('DOMNodeInserted', event => {
                const { currentTarget: target } = event;
                target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
            });
        }
        input.current.focus();
    }, []);

    // 🧠 Helper: Get session from props.session by contactId
    function retrieveValue(key) {
        console.log(`${DBG_PREFIX} Retrieving session for contactId:`, key);
        var value = "";
        for (var obj in props.session) {
            for (var item in props.session[obj]) {
                if (item === key) {
                    value = props.session[obj][item];
                    console.log(`${DBG_PREFIX} Found session for ${key}:`, value);
                    break;
                }
            }
        }
        return value;
    }

    // 🧠 Helper: Get contact object from session
    function getContactFromSession(session) {
        console.log(`${DBG_PREFIX} Getting contact from session:`, session);
        return session && session.contact ? session.contact : null;
    }

    // 🧠 Helper: Fetch audio from your Polly API
    async function fetchAudioFromApi(text) {
        console.log(`${DBG_PREFIX} Fetching audio from API for text:`, text);
        try {
            const response = await fetch(
                'https://n2.execute-api.us-east-1.amazonaws.com/test/polly',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                }
            );

            console.log(`${DBG_PREFIX} Polly API response status:`, response.status);
            if (!response.ok) {
                console.error(`${DBG_PREFIX} Polly API failed:`, response.statusText);
                return null;
            }

            const data = await response.json();
            console.log(`${DBG_PREFIX} Polly API JSON Response:`, data);
            return data;
        } catch (err) {
            console.error(`${DBG_PREFIX} Polly API Error:`, err);
            return null;
        }
    }

    // 🧠 Helper: Send message to session
    const sendMessage = async (session, content) => {
        console.log(`${DBG_PREFIX} Sending message to AWS session:`, content);
        try {
            const awsSdkResponse = await session.sendMessage({
                contentType: "text/plain",
                message: content
            });
            const { AbsoluteTime, Id } = awsSdkResponse.data;
            console.log(`${DBG_PREFIX} Message sent successfully. Time: ${AbsoluteTime}, ID: ${Id}`);
        } catch (err) {
            console.error(`${DBG_PREFIX} Failed to send message via session:`, err);
        }
    };

    // 🧠 Submit message handler
    async function handleSubmit(event) {
        event.preventDefault();
        console.log(`${DBG_PREFIX} handleSubmit triggered`);

        if (newMessage.trim() === "") {
            console.warn(`${DBG_PREFIX} No message to send.`);
            return;
        }

        let destLang = languageTranslate.find(o => o.contactId === currentContactId[0]);
        console.log(`${DBG_PREFIX} Destination language:`, destLang);

        const session = retrieveValue(currentContactId[0]);
        const contact = getContactFromSession(session);
        console.log(`${DBG_PREFIX} Contact object retrieved:`, contact);

        // 🔍 Check if voice contact
        const isVoice = contact ? isVoiceContact(contact) : false;
        console.log(`${DBG_PREFIX} isVoiceContact returned:`, isVoice);

        // 🧠 Translate message
        console.log(`${DBG_PREFIX} Translating message via API...`);
        let translatedMessageAPI = await translateTextAPI(newMessage, 'en', destLang?.lang || 'en');
        console.log(`${DBG_PREFIX} Translation API response:`, translatedMessageAPI);

        let translatedMessage = translatedMessageAPI?.TranslatedText || newMessage;
        console.log(`${DBG_PREFIX} Translated Message:`, translatedMessage);

        if (isVoice) {
            console.log(`${DBG_PREFIX} Voice contact detected. Fetching Polly audio...`);
            const audioResponse = await fetchAudioFromApi(translatedMessage);

            if (audioResponse && audioResponse.audio) {
                console.log(`${DBG_PREFIX} Received audio from API. Length:`, audioResponse.audio.length);
                const audioSrc = `data:audio/mp3;base64,${audioResponse.audio}`;

                let data2 = {
                    contactId: currentContactId[0],
                    username: agentUsername,
                    content: <p>{newMessage}</p>,
                    translatedMessage: (
                        <audio
                            controls
                            autoPlay
                            src={audioSrc}
                            onPlay={() => console.log(`${DBG_PREFIX} Audio is playing`)}
                            onError={(e) => console.error(`${DBG_PREFIX} Audio failed to play`, e)}
                        />
                    ),
                };

                console.log(`${DBG_PREFIX} Adding audio message to chat UI...`);
                addChat(prevMsg => [...prevMsg, data2]);
            } else {
                console.error(`${DBG_PREFIX} No valid audio received from API.`);
            }
        } else {
            console.log(`${DBG_PREFIX} Text contact detected. Adding translated message to chat UI...`);
            let data2 = {
                contactId: currentContactId[0],
                username: agentUsername,
                content: <p>{newMessage}</p>,
                translatedMessage: <p>{translatedMessage}</p>,
            };
            addChat(prevMsg => [...prevMsg, data2]);
        }

        setNewMessage("");
        console.log(`${DBG_PREFIX} Message input cleared. Sending translated message via session.`);
        if (session) await sendMessage(session, translatedMessage);
        else console.error(`${DBG_PREFIX} No valid session found for sending message.`);
    }

    return (
        <div className="chatroom">
            <h3>
                Translate - (
                {languageTranslate.map(lang => {
                    if (lang.contactId === currentContactId[0]) return lang.lang;
                    return null;
                })}
                ) {getKeyByValue(languageOptions)}
            </h3>

            <ul className="chats" ref={messageEl}>
                {Chats.map(chat => {
                    if (chat.contactId === currentContactId[0])
                        return <Message key={Math.random()} chat={chat} user={agentUsername} />;
                    return null;
                })}
            </ul>

            <form className="input" onSubmit={handleSubmit}>
                <input
                    ref={input}
                    maxLength="1024"
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default Chatroom;



