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
// import translateTextAPI from './translateAPI';
// import { addChat, useGlobalState } from '../store/state';

// const Chatroom = (props) => {
//   const [Chats] = useGlobalState('Chats');
//   const currentContactId = useGlobalState('currentContactId');
//   const [newMessage, setNewMessage] = useState("");
//   const [languageTranslate] = useGlobalState('languageTranslate');
//   const [languageOptions] = useGlobalState('languageOptions');
//   const [mediaType] = useGlobalState('mediaType'); // "chat" or "voice"
//   const agentUsername = 'AGENT';
//   const messageEl = useRef(null);
//   const input = useRef(null);

//   console.log("Current global mediaType:", mediaType);

//   // Helper to get language key from options
//   function getKeyByValue(object) {
//     const obj = languageTranslate.find(o => o.contactId === currentContactId[0]);
//     if (!obj) return;
//     return Object.keys(object).find(key => object[key] === obj.lang);
//   }

//   // Send message to Connect chat session
//   const sendMessage = async (session, content) => {
//     if (!session || !session.sendMessage) {
//       console.error("Invalid session or sendMessage not found");
//       return;
//     }
//     try {
//       const awsSdkResponse = await session.sendMessage({
//         contentType: "text/plain",
//         message: content,
//       });
//       const { AbsoluteTime, Id } = awsSdkResponse.data;
//       console.log("AWS SDK Message sent:", AbsoluteTime, Id);
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   useEffect(() => {
//     // Auto-scroll chat window
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

//     // Detect target language
//     const destLang = languageTranslate.find(o => o.contactId === currentContactId[0]);
//     console.log("Destination Language Object:", destLang);

//     // Translate agent message
//     const translatedMessageAPI = await translateTextAPI(newMessage, 'en', destLang.lang);
//     const translatedMessage = translatedMessageAPI.TranslatedText;
//     console.log(`Original: ${newMessage} | Translated: ${translatedMessage}`);

//     // Update chat UI locally
//     const newChat = {
//       contactId: currentContactId[0],
//       username: agentUsername,
//       content: <p>{newMessage}</p>,
//       translatedMessage: <p>{translatedMessage}</p>,
//     };
//     addChat(prev => [...prev, newChat]);
//     setNewMessage("");

//     // Retrieve the session for this contact
//     const session = (() => {
//       for (const obj in props.session) {
//         for (const item in props.session[obj]) {
//           if (item === currentContactId[0]) {
//             return props.session[obj][item];
//           }
//         }
//       }
//       return null;
//     })();

//     if (!session) {
//       console.error("Session not found for contact:", currentContactId[0]);
//       return;
//     }

//     // Send text message to Connect
//     await sendMessage(session, translatedMessage);

//     // ✅ Handle voice contact — trigger Lambda
//     try {
//       console.log("MediaType value at runtime:", mediaType);
//       if (mediaType === "voice" || mediaType[0] === "voice") {
//         console.log("Voice contact detected — invoking Lambda for audio playback...");

//         const lambdaUrl = "https://nq47hkuui2.execute-api.us-east-1.amazonaws.com/test/polly"; // TODO: Replace with your API endpoint
//         const payload = {
//           text: translatedMessage,
//           languageCode: destLang.lang,
//           contactId: currentContactId[0],
//         };

//         console.log("Invoking Lambda with payload:", payload);

//         const response = await fetch(lambdaUrl, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });

//         console.log("Fetch raw response:", response);

//         if (!response.ok) {
//           const text = await response.text();
//           throw new Error(`Lambda HTTP ${response.status}: ${text}`);
//         }

//         const data = await response.json();
//         console.log("Lambda invoked successfully:", data);
//       } else {
//         console.log("Not a voice contact — skipping Lambda invocation.");
//       }
//     } catch (err) {
//       console.error("Error invoking Lambda for audio:", err);
//     }
//   }

//   return (
//     <div className="chatroom">
//       <h3>
//         Translate - (
//         {languageTranslate.map(lang =>
//           lang.contactId === currentContactId[0] ? lang.lang : null
//         )}
//         ) {getKeyByValue(languageOptions)}
//       </h3>

//       <ul className="chats" ref={messageEl}>
//         {Chats.map(chat =>
//           chat.contactId === currentContactId[0]
//             ? <Message key={Math.random()} chat={chat} user={agentUsername} />
//             : null
//         )}
//       </ul>

//       <form className="input" onSubmit={handleSubmit}>
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
import { addChat, useGlobalState, setAudioUrl } from '../store/state';
 
const Chatroom = (props) => {
  const [Chats] = useGlobalState('Chats');
  const currentContactId = useGlobalState('currentContactId');
  const [newMessage, setNewMessage] = useState("");
  const [languageTranslate] = useGlobalState('languageTranslate');
  const [languageOptions] = useGlobalState('languageOptions');
  const [mediaType] = useGlobalState('mediaType'); // "chat" or "voice"
  const [audioUrl] = useGlobalState('audioUrl'); // audio url
  const agentUsername = 'AGENT';
  const messageEl = useRef(null);
  const input = useRef(null);
 
  console.log("Current global mediaType:", mediaType);
 
  // Helper to get language key from options
  function getKeyByValue(object) {
    const obj = languageTranslate.find(o => o.contactId === currentContactId[0]);
    if (!obj) return;
    return Object.keys(object).find(key => object[key] === obj.lang);
  }
 
  // Send message to Connect chat session
  const sendMessage = async (session, content) => {
    if (!session || !session.sendMessage) {
      console.error("Invalid session or sendMessage not found");
      return;
    }
    try {
      const awsSdkResponse = await session.sendMessage({
        contentType: "text/plain",
        message: content,
      });
      const { AbsoluteTime, Id } = awsSdkResponse.data;
      console.log("AWS SDK Message sent:", AbsoluteTime, Id);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };
 
  useEffect(() => {
    // Auto-scroll chat window
    if (messageEl.current) {
      messageEl.current.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
    if (input.current) input.current.focus();
  }, []);
 
  async function handleSubmit(event) {
    event.preventDefault();
    if (newMessage === "") return;
 
    // Detect target language
    const destLang = languageTranslate.find(o => o.contactId === currentContactId[0]);
    console.log("Destination Language Object:", destLang);
 
    // Translate agent message
    const translatedMessageAPI = await translateTextAPI(newMessage, 'en', destLang.lang);
    const translatedMessage = translatedMessageAPI.TranslatedText;
    console.log(`Original: ${newMessage} | Translated: ${translatedMessage}`);
 
    // Update chat UI locally
    const newChat = {
      contactId: currentContactId[0],
      username: agentUsername,
      content: <p>{newMessage}</p>,
      translatedMessage: <p>{translatedMessage}</p>,
    };
    addChat(prev => [...prev, newChat]);
    setNewMessage("");
 
    // Retrieve the session for this contact
    const session = (() => {
      for (const obj in props.session) {
        for (const item in props.session[obj]) {
          if (item === currentContactId[0]) {
            return props.session[obj][item];
          }
        }
      }
      return null;
    })();
 
    if (!session) {
      console.warn("⚠️ Session not found for contact:", currentContactId[0]);
      // ⚠️ Don't return — allow code flow to continue to try block
    } else {
      // Still send the message if session exists
      await sendMessage(session, translatedMessage);
    }
 
    // ✅ Always reach this try block now
    try {
      console.log("MediaType value at runtime:", mediaType);
      console.log("🔹 Entering try block for Lambda trigger...");
 
      if (mediaType === "voice" || mediaType[0] === "voice") {
        console.log("Voice contact detected — invoking Lambda for audio playback...");
 
        const lambdaUrl = "https://nq47hkuui2.execute-api.us-east-1.amazonaws.com/test/polly"; // TODO: Replace with your API endpoint
        const payload = {
          text: translatedMessage,
          languageCode: destLang.lang,
          contactId: currentContactId[0],
        };
 
        console.log("Invoking Lambda with payload:", payload);
 
        const response = await fetch(lambdaUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
 
        console.log("Fetch raw response:", response);
 
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Lambda HTTP ${response.status}: ${text}`);
        }
 
        const data = await response.json();
        console.log("✅ Lambda invoked successfully:", data);

         if (data.audioUrl) {
                setAudioUrl('audioUrl', data.audioUrl);
                console.log("Global state audioUrl updated:", data.audioUrl);
                    }      
      } 
         
      else {
        console.log("Not a voice contact — skipping Lambda invocation.");
      }
    } catch (err) {
      console.error("❌ Error invoking Lambda for audio:", err);
    }
  }
 
  return (
<div className="chatroom">
<h3>
        Translate - (
        {languageTranslate.map(lang =>
          lang.contactId === currentContactId[0] ? lang.lang : null
        )}
        ) {getKeyByValue(languageOptions)}
</h3>
 
      <ul className="chats" ref={messageEl}>
        {Chats.map(chat =>
          chat.contactId === currentContactId[0]
            ? <Message key={Math.random()} chat={chat} user={agentUsername} />
            : null
        )}
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
