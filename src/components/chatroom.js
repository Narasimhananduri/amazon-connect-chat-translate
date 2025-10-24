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
//     const [mediaType] = useGlobalState('mediaType');
//     console.log("Current global mediaType:", mediaType);
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
// // import translateText from './translate'
// import translateTextAPI from './translateAPI'
// import { addChat, useGlobalState } from '../store/state';

// const Chatroom = (props) => {
//   const [Chats] = useGlobalState('Chats');
//   const currentContactId = useGlobalState('currentContactId');
//   const [newMessage, setNewMessage] = useState("");
//   const [languageTranslate] = useGlobalState('languageTranslate');
//   const [languageOptions] = useGlobalState('languageOptions');
//   const [mediaType] = useGlobalState('mediaType');

//   console.log("Current global mediaType:", mediaType);
//   console.log("props.session content:", JSON.stringify(props.session, null, 2)); // Debug session structure

//   const agentUsername = 'AGENT';
//   const messageEl = useRef(null);
//   const input = useRef(null);

//   function getKeyByValue(object) {
//     let obj = languageTranslate.find(o => o.contactId === currentContactId[0]);
//     if (obj === undefined) {
//       return;
//     } else {
//       return Object.keys(object).find(key => object[key] === obj.lang);
//     }
//   }

//   // Revised session retrieval function
//   const getSession = (contactId) => {
//     if (!contactId || !props.session) return null;

//     // props.session may be an array or object of session objects
//     for (const sessionObj of Object.values(props.session)) {
//       if (sessionObj && sessionObj[contactId]) {
//         return sessionObj[contactId];
//       }
//     }
//     return null;
//   };

//   const sendMessage = async (session, content, contentType = "text/plain") => {
//     if (!session || typeof session.sendMessage !== 'function') {
//       console.error("Invalid session or sendMessage method not found");
//       return;
//     }

//     try {
//       const awsSdkResponse = await session.sendMessage({
//         contentType: contentType,
//         message: content
//       });
//       const { AbsoluteTime, Id } = awsSdkResponse.data;
//       console.log("Message sent at:", AbsoluteTime, "ID:", Id);
//     } catch (error) {
//       console.error("sendMessage failed:", error);
//     }
//   };

//   useEffect(() => {
//     // auto-scroll and focus input
//     if (messageEl.current) {
//       messageEl.current.addEventListener('DOMNodeInserted', event => {
//         const { currentTarget: target } = event;
//         target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
//       });
//     }
//     if (input.current) input.current.focus();
//   }, []);

//   async function handleSubmit(event) {
//     event.preventDefault();
//     if (newMessage === "") return;

//     let destLang = languageTranslate.find(o => o.contactId === currentContactId[0]);
//     if (!destLang) {
//       console.warn("Destination language not found for current contact, defaulting to 'en'");
//       destLang = { lang: 'en' };
//     }
//     console.log("destLang: ", destLang);

//     console.log("User message:", newMessage);
//     let translatedMessageAPI = await translateTextAPI(newMessage, 'en', destLang.lang);
//     let translatedMessage = translatedMessageAPI.TranslatedText;

//     console.log(`Original Message: ${newMessage}\nTranslated Message: ${translatedMessage}`);

//     // create the new message object for UI display
//     let data2 = {
//       contactId: currentContactId[0],
//       username: agentUsername,
//       content: <p>{newMessage}</p>,
//       translatedMessage: <p>{translatedMessage}</p>,
//     };

//     addChat(prevMsg => [...prevMsg, data2]);
//     setNewMessage("");

//     const session = getSession(currentContactId[0]);
//     console.log("retrieved session:", session);

//     if (!session) {
//       console.error("Session not found for contact ID:", currentContactId[0]);
//       return; // Abort if session is invalid
//     }

//     // ------------------- 🔊 Added Logic for Voice Mode -------------------
//     try {
//       if (mediaType[0] === "voice") {
//         console.log("Media type is voice, calling Polly API...");

//         const pollyResponse = await fetch("https://nq47hkuui2.execute-api.us-east-1.amazonaws.com/test/polly", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             text: translatedMessage,
//             languageCode: destLang.lang
//           })
//         });

//         const pollyData = await pollyResponse.json();
//         if (pollyData && pollyData.audio) {
//           console.log("Polly API success — sending audio message to Connect.");

//           // ✅ Convert Base64 audio to Uint8Array before sending
//           const audioBytes = Uint8Array.from(atob(pollyData.audio), c => c.charCodeAt(0));

//           // Send the audio as voice message
//           await sendMessage(session, audioBytes, "audio/mpeg");

//           // Optional: add an audio playback in chat window
//           const audioElement = (
//             <audio controls src={`data:audio/mp3;base64,${pollyData.audio}`} />
//           );

//           let voiceData = {
//             contactId: currentContactId[0],
//             username: agentUsername,
//             content: <p>{newMessage}</p>,
//             translatedMessage: audioElement,
//           };

//           addChat(prevMsg => [...prevMsg, voiceData]);
//         } else {
//           console.warn("Polly API did not return audio, sending text fallback.");
//           await sendMessage(session, translatedMessage);
//         }
//       } else {
//         // Default: text chat
//         await sendMessage(session, translatedMessage);
//       }
//     } catch (error) {
//       console.error("Error during Polly voice message handling:", error);
//       await sendMessage(session, translatedMessage); // fallback
//     }
//     // ---------------------------------------------------------------------
//   }

//   return (
//     <div className="chatroom">
//       <h3>
//         Translate - (
//         {languageTranslate.map(lang => {
//           if (lang.contactId === currentContactId[0])
//             return lang.lang;
//           return null;
//         })}
//         ) {getKeyByValue(languageOptions)}
//       </h3>

//       <ul className="chats" ref={messageEl}>
//         {
//           Chats.map(chat => {
//             if (chat.contactId === currentContactId[0])
//               return <Message key={chat.Id || Math.random()} chat={chat} user={agentUsername} />
//             return null;
//           })
//         }
//       </ul>

//       <form className="input" onSubmit={handleSubmit} >
//         <input
//           ref={input}
//           maxLength="1024"
//           type="text"
//           value={newMessage}
//           onChange={e => setNewMessage(e.target.value)}
//         />
//         <input type="submit" value="Submit" />
//       </form>
//     </div>
//   );
// };

// export default Chatroom;
import React, { useEffect, useRef, useState } from 'react';
import './chatroom.css';
import Message from './message.js';
import translateTextAPI from './translateAPI';
import { addChat, useGlobalState } from '../store/state';

const Chatroom = (props) => {
  const [Chats] = useGlobalState('Chats');
  const currentContactIdArray = useGlobalState('currentContactId');
  const contactId = currentContactIdArray[0];
  const [newMessage, setNewMessage] = useState("");
  const [languageTranslate] = useGlobalState('languageTranslate');
  const [languageOptions] = useGlobalState('languageOptions');
  const [mediaType] = useGlobalState('mediaType');

  const agentUsername = 'AGENT';
  const messageEl = useRef(null);
  const input = useRef(null);

  console.log("Current global mediaType:", mediaType);
  console.log("props.session content:", JSON.stringify(props.session, null, 2));

  const getKeyByValue = (object) => {
    const obj = languageTranslate.find(o => o.contactId === contactId);
    if (!obj) return;
    return Object.keys(object).find(key => object[key] === obj.lang);
  };

  const getSession = (contactId) => {
    if (!contactId || !props.session) return null;
    return props.session[contactId] || null;
  };

  const sendMessage = async (session, content, contentType = "text/plain") => {
    if (!session || typeof session.sendMessage !== 'function') {
      console.error("Invalid session or sendMessage method not found");
      return;
    }
    try {
      const awsSdkResponse = await session.sendMessage({ contentType, message: content });
      console.log("Message sent at:", awsSdkResponse.data.AbsoluteTime, "ID:", awsSdkResponse.data.Id);
    } catch (error) {
      console.error("sendMessage failed:", error);
    }
  };

  useEffect(() => {
    if (messageEl.current) {
      messageEl.current.addEventListener('DOMNodeInserted', e => {
        e.currentTarget.scroll({ top: e.currentTarget.scrollHeight, behavior: 'smooth' });
      });
    }
    if (input.current) input.current.focus();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newMessage) return;

    let destLangObj = languageTranslate.find(o => o.contactId === contactId) || { lang: 'en' };
    console.log("destLang:", destLangObj);

    const translatedAPI = await translateTextAPI(newMessage, 'en', destLangObj.lang);
    const translatedMessage = translatedAPI.TranslatedText;
    console.log(`Original: ${newMessage}\nTranslated: ${translatedMessage}`);

    addChat(prev => [...prev, {
      contactId,
      username: agentUsername,
      content: <p>{newMessage}</p>,
      translatedMessage: <p>{translatedMessage}</p>
    }]);

    setNewMessage("");

    const session = getSession(contactId);
    if (!session) {
      console.error("Session not found for contact ID:", contactId);
      return;
    }

    if (mediaType[0] === "voice") {
      try {
        const pollyResponse = await fetch("https://nq47hkuui2.execute-api.us-east-1.amazonaws.com/test/polly", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: translatedMessage, languageCode: destLangObj.lang })
        });
        const pollyData = await pollyResponse.json();
        if (pollyData?.audio) {
          const audioBytes = Uint8Array.from(atob(pollyData.audio), c => c.charCodeAt(0));
          await sendMessage(session, audioBytes, "audio/mpeg");
          addChat(prev => [...prev, {
            contactId,
            username: agentUsername,
            content: <p>{newMessage}</p>,
            translatedMessage: <audio controls src={`data:audio/mp3;base64,${pollyData.audio}`} />
          }]);
        } else {
          await sendMessage(session, translatedMessage);
        }
      } catch (err) {
        console.error("Polly/voice error:", err);
        await sendMessage(session, translatedMessage);
      }
    } else {
      await sendMessage(session, translatedMessage);
    }
  };

  return (
    <div className="chatroom">
      <h3>
        Translate - (
        {languageTranslate.map(lang => lang.contactId === contactId ? lang.lang : null)}
        ) {getKeyByValue(languageOptions)}
      </h3>

      <ul className="chats" ref={messageEl}>
        {Chats.map(chat => chat.contactId === contactId ? <Message key={chat.Id || Math.random()} chat={chat} user={agentUsername} /> : null)}
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
