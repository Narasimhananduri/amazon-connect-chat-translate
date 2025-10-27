// import React, { useEffect, useState } from 'react';
// import { Grid } from 'semantic-ui-react';
// import  { Amplify }  from 'aws-amplify';
// import awsconfig from '../aws-exports';
// import Chatroom from './chatroom';
// import translateText from './translate'
// import detectText from './detectText'
// import { addChat, setLanguageTranslate, clearChat, useGlobalState, setCurrentContactId } from '../store/state';

// Amplify.configure(awsconfig);

// const Ccp = () => {
//     const [languageTranslate] = useGlobalState('languageTranslate');
//     var localLanguageTranslate = [];
//     const [Chats] = useGlobalState('Chats');
//     const [lang, setLang] = useState("");
//     const [currentContactId] = useGlobalState('currentContactId');
//     const [languageOptions] = useGlobalState('languageOptions');
//     const [agentChatSessionState, setAgentChatSessionState] = useState([]);
//     const [setRefreshChild] = useState([]);

//     console.log(lang)
//     console.log(currentContactId)
//     //console.log(Chats)

//     // *******
//     // Subscribe to the chat session
//     // *******
//     function getEvents(contact, agentChatSession) {
//         console.log(agentChatSession);
//         contact.getAgentConnection().getMediaController().then(controller => {
//             controller.onMessage(messageData => {
//                 if (messageData.chatDetails.participantId === messageData.data.ParticipantId) {
//                     console.log(`CDEBUG ===> Agent ${messageData.data.DisplayName} Says`,
//                         messageData.data.Content)
//                 }
//                 else {
//                     console.log(`CDEBUG ===> Customer ${messageData.data.DisplayName} Says`,messageData.data.Content);
//                     processChatText(messageData.data.Content, messageData.data.Type, messageData.data.ContactId );
//                 }
//             })
//         })
//     }
//     // *******
//     // Processing the incoming chat from the Customer
//     // *******
//     async function processChatText(content, type, contactId) {
//         // Check if we know the language for this contactId, if not use dectectText(). This process means we only perform comprehend language detection at most once.
//         console.log(type);
//         let textLang = '';
//           for(var i = 0; i < languageTranslate.length; i++) {
//                 if (languageTranslate[i].contactId === contactId) {
//                     textLang = languageTranslate[i].lang
//                      break
//                 } 
//         }
//         // If the contatId was not found in the store, or the store is empty, perform dectText API to comprehend
//         if (localLanguageTranslate.length === 0 || textLang === ''){
//             let tempLang = await detectText(content);
//             textLang = tempLang.textInterpretation.language
//         }


//          // Update (or Add if new contactId) the store with the the language code
//          function upsert(array, item) { // (1)
//             const i = array.findIndex(_item => _item.contactId === item.contactId);
//             if (i > -1) array[i] = item; // (2)
//             else array.push(item);
//           }
//         upsert(languageTranslate, {contactId: contactId, lang: textLang})
//         setLanguageTranslate(languageTranslate);
                
//         // Translate the customer message into English.
//         let translatedMessage = await translateText(content, textLang, 'en');
//         console.log(`CDEBUG ===>  Original Message: ` + content + `\n Translated Message: ` + translatedMessage);
//         // create the new message to add to Chats.
//         let data2 = {
//             contactId: contactId,
//             username: 'customer',
//             content: <p>{content}</p>,
//             translatedMessage: <p>{translatedMessage}</p>
//         };
//         // Add the new message to the store
//         addChat(prevMsg => [...prevMsg, data2]);
//     }

//     // *******
//     // Subscribing to CCP events. See : https://github.com/aws/amazon-connect-streams/blob/master/Documentation.md
//     // *******
//     function subscribeConnectEvents() {
//         window.connect.core.onViewContact(function(event) {
//             var contactId = event.contactId;
//             console.log("CDEBUG ===> onViewContact", contactId)
//             setCurrentContactId(contactId);    
//           });

//         console.log("CDEBUG ===> subscribeConnectEvents");

//         // If this is a chat session
//         if (window.connect.ChatSession) {
//             console.log("CDEBUG ===> Subscribing to Connect Contact Events for chats");
//             window.connect.contact(contact => {

//                 // This is invoked when CCP is ringing
//                 contact.onConnecting(() => {
//                     console.log("CDEBUG ===> onConnecting() >> contactId: ", contact.contactId);
//                     let contactAttributes = contact.getAttributes();
//                     console.log("CDEBUG ===> contactAttributes: ", JSON.stringify(contactAttributes));
//                     let contactQueue = contact.getQueue();
//                     console.log("CDEBUG ===> contactQueue: ", contactQueue);
//                 });

//                 // This is invoked when the chat is accepted
//                 contact.onAccepted(async() => {
//                     console.log("CDEBUG ===> onAccepted: ", contact);
//                     const cnn = contact.getConnections().find(cnn => cnn.getType() === window.connect.ConnectionType.AGENT);
//                     const agentChatSession = await cnn.getMediaController();
//                     setCurrentContactId(contact.contactId)
//                     console.log("CDEBUG ===> agentChatSession ", agentChatSession)
//                     // Save the session to props, this is required to send messages within the chatroom.js
//                     setAgentChatSessionState(agentChatSessionState => [...agentChatSessionState, {[contact.contactId] : agentChatSession}])
                
//                     // Get the language from the attributes, if the value is valid then add to the store
//                     localLanguageTranslate = contact.getAttributes().x_lang.value
//                     if (Object.keys(languageOptions).find(key => languageOptions[key] === localLanguageTranslate) !== undefined){
//                         console.log("CDEBUG ===> Setting lang code from attribites:", localLanguageTranslate)
//                         languageTranslate.push({contactId: contact.contactId, lang: localLanguageTranslate})
//                         setLanguageTranslate(languageTranslate);
//                         setRefreshChild('updated') // Workaround to force a refresh of the chatroom UI to show the updated language based on contact attribute.
                
//                     }
//                     console.log("CDEBUG ===> onAccepted, languageTranslate ", languageTranslate)
                    
//                 });

//                 // This is invoked when the customer and agent are connected
//                 contact.onConnected(async() => {
//                     console.log("CDEBUG ===> onConnected() >> contactId: ", contact.contactId);
//                     const cnn = contact.getConnections().find(cnn => cnn.getType() === window.connect.ConnectionType.AGENT);
//                     const agentChatSession = await cnn.getMediaController();
//                     getEvents(contact, agentChatSession);
//                 });

//                 // This is invoked when new agent data is available
//                 contact.onRefresh(() => {
//                     console.log("CDEBUG ===> onRefresh() >> contactId: ", contact.contactId);
//                 });

//                 // This is invoked when the agent moves to ACW
//                 contact.onEnded(() => {
//                     console.log("CDEBUG ===> onEnded() >> contactId: ", contact.contactId);
//                     setLang('');
//                 });
                
//                 // This is invoked when the agent moves out of ACW to a different state
//                 contact.onDestroy(() => {
//                     console.log("CDEBUG ===> onDestroy() >> contactId: ", contact.contactId);
//                     // TODO need to remove the previous chats from the store
//                     //clearChat()
//                     setCurrentContactId('');
//                     clearChat();
//                 });
//             });

//             /* 
//             **** Subscribe to the agent API **** 
//             See : https://github.com/aws/amazon-connect-streams/blob/master/Documentation.md
//             */

//             console.log("CDEBUG ===> Subscribing to Connect Agent Events");
//             window.connect.agent((agent) => {
//                 agent.onStateChange((agentStateChange) => {
//                     // On agent state change, update the React state.
//                     let state = agentStateChange.newState;
//                     console.log("CDEBUG ===> New State: ", state);

//                 });

//             });
//         }
//         else {
//             console.log("CDEBUG ===> waiting 3s");
//             setTimeout(function() { subscribeConnectEvents(); }, 3000);
//         }
//     };


//     // ***** 
//     // Loading CCP
//     // *****
//     useEffect(() => {
//         const connectUrl = process.env.REACT_APP_CONNECT_INSTANCE_URL;
//         window.connect.agentApp.initApp(
//             "ccp",
//             "ccp-container",
//             connectUrl + "/connect/ccp-v2/", { 
//                 ccpParams: { 
//                     region: process.env.REACT_APP_CONNECT_REGION,
//                     pageOptions: {                  // optional
//                         enableAudioDeviceSettings: true, // optional, defaults to 'false'
//                         enablePhoneTypeSettings: true // optional, defaults to 'true'
//                       }
//                 } 
//             }
//         );
//         subscribeConnectEvents();
//     }, []);


//     return (
//         <main>
//           <Grid columns='equal' stackable padded>
//           <Grid.Row>
//             {/* CCP window will load here */}
//             <div id="ccp-container"></div>
//             {/* Translate window will laod here. We pass the agent state to be able to use this to push messages to CCP */}
//             <div id="chatroom" ><Chatroom session={agentChatSessionState}/> </div> 
//             </Grid.Row>
//           </Grid>
//         </main>
//     );
// };

// export default Ccp;


//voice added 

//voice added ended here



import React, { useEffect, useState, useRef } from 'react';
import { Grid } from 'semantic-ui-react';
import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';
import Chatroom from './chatroom';
import translateText from './translate';
import detectText from './detectText';
import {
    addChat,
    setLanguageTranslate,
    clearChat,
    useGlobalState,
    setCurrentContactId,
    setMediaType
} from '../store/state';

Amplify.configure(awsconfig);



const Ccp = () => {
    const [languageTranslate] = useGlobalState('languageTranslate');
    const [Chats] = useGlobalState('Chats');
    const [lang, setLang] = useState("");
    const [currentContactId] = useGlobalState('currentContactId');
    const [languageOptions] = useGlobalState('languageOptions');
    const [agentChatSessionState, setAgentChatSessionState] = useState([]);
    // const [agentChatSessionState, setAgentChatSessionState] = useState({});
    const [setRefreshChild] = useState([]);
    const [voiceIntervalId, setVoiceIntervalId] = useState(null);
    const lastApiResponseRef = useRef({});
    const processedTranscriptsRef = useRef({});

    console.log("CDEBUG ===> Current language: ", lang);
    console.log("CDEBUG ===> Current contact ID: ", currentContactId);

    function getEvents(contact, agentChatSession) {
        console.log("CDEBUG ===> Getting events for contact: ", contact.contactId);
        contact.getAgentConnection().getMediaController().then(controller => {
            controller.onMessage(messageData => {
                if (messageData.chatDetails.participantId === messageData.data.ParticipantId) {
                    console.log(`CDEBUG ===> Agent ${messageData.data.DisplayName} Says:`, messageData.data.Content);
                } else {
                    console.log(`CDEBUG ===> Customer ${messageData.data.DisplayName} Says:`, messageData.data.Content);
                    processChatText(messageData.data.Content, messageData.data.Type, messageData.data.ContactId);
                }
            })
        })
    }

    async function processChatText(content, type, contactId) {
    console.log("CDEBUG ===> Processing chat text: ", content);

    if (!Array.isArray(languageTranslate)) {
        console.error("CDEBUG ===> languageTranslate is not an array or is undefined", languageTranslate);
        return;
    }

    // Default language to empty string
    let textLang = '';

    // Look for existing language for this contact
    const existingLangObj = languageTranslate.find(item => item.contactId === contactId);
    if (existingLangObj && existingLangObj.lang) {
        textLang = existingLangObj.lang;
    }

    // If language not found, detect it
    if (!textLang) {
        console.log("CDEBUG ===> No language found. Detecting language for:", content);
        try {
            let tempLang = await detectText(content);
            textLang = tempLang.textInterpretation.language;

            // Update global state
            const updatedLanguageTranslate = [...languageTranslate];
            const index = updatedLanguageTranslate.findIndex(item => item.contactId === contactId);
            if (index > -1) {
                updatedLanguageTranslate[index].lang = textLang;
            } else {
                updatedLanguageTranslate.push({ contactId, lang: textLang });
            }
            setLanguageTranslate(updatedLanguageTranslate);

        } catch (err) {
            console.error("CDEBUG ===> Language detection failed:", err);
            textLang = 'en'; // fallback
        }
    }

    // Translate to English
    let translatedMessage = await translateText(content, textLang, 'en');

    console.log(`CDEBUG ===> Original Message: ${content}`);
    console.log(`CDEBUG ===> Translated Message: ${translatedMessage}`);

    let data2 = {
        contactId: contactId,
        username: 'customer',
        content: <p>{content}</p>,
        translatedMessage: <p>{translatedMessage}</p>
    };

    addChat(prevMsg => [...prevMsg, data2]);
}



  
    const fetchVoiceMessages = async (contactId) => {
    try {
        console.log("CDEBUG ===> Fetching voice messages for contactId:", contactId);
 
        const apiUrl = `https://f7505y5ead.execute-api.us-east-1.amazonaws.com/test/getTranscript?contactId=${contactId}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error(`CDEBUG ===> Fetch failed with status: ${response.status} ${response.statusText}`);
            return;
        }
 
        const result = await response.json();
        console.log("CDEBUG ===> API Response:", result);
 
        if (!Array.isArray(result.Transcripts)) {
            console.warn("CDEBUG ===> Invalid or missing Transcripts array", result);
            return;
        }
 
        // stringify to check if the full response changed
        const currentResponseString = JSON.stringify(result.Transcripts);
        const lastResponseString = lastApiResponseRef.current[contactId];
 
        // Skip if nothing changed
        if (currentResponseString === lastResponseString) {
            console.log("CDEBUG ===> API response unchanged, skipping update.");
            return;
        }
 
        // store latest API response for this contact
        lastApiResponseRef.current[contactId] = currentResponseString;
 
        // find only new messages
        const previousMessages = processedTranscriptsRef.current[contactId] || [];
        const previousSet = new Set(previousMessages.map(msg => JSON.stringify(msg)));
        const newMessages = result.Transcripts.filter(msg => !previousSet.has(JSON.stringify(msg)));
 
        if (newMessages.length === 0) {
            console.log("CDEBUG ===> No new messages to process.");
            return;
        }
 
        console.log("CDEBUG ===> New messages to process:", newMessages);
 
        for (const message of newMessages) {
            await processChatText(message, "voice", contactId);
        }
 
        // update the processed transcripts memory
        processedTranscriptsRef.current[contactId] = [
            ...(processedTranscriptsRef.current[contactId] || []),
            ...newMessages,
        ];
 
    } catch (err) {
        console.error("CDEBUG ===> Error fetching voice messages:", err);
    }
};

      const isVoiceContact = (contact) => {
        const mediaType = contact.getType();
        console.log("CDEBUG ===> Contact media type: ", mediaType);
        setMediaType(mediaType);
        return mediaType === 'voice';
    };

    function subscribeConnectEvents() {
        console.log("CDEBUG ===> Subscribing to Connect Contact Events");

        window.connect.core.onViewContact(function (event) {
            var contactId = event.contactId;
            console.log("CDEBUG ===> onViewContact", contactId);
            setCurrentContactId(contactId);
        });

        if (window.connect.ChatSession) {
            console.log("CDEBUG ===> Subscribing to Connect Contact Events for chats");

            window.connect.contact(contact => {
                contact.onConnecting(() => {
                    console.log("CDEBUG ===> onConnecting() >> contactId: ", contact.contactId);
                    let contactAttributes = contact.getAttributes();
                    console.log("CDEBUG ===> contactAttributes: ", JSON.stringify(contactAttributes));
                    let contactQueue = contact.getQueue();
                    console.log("CDEBUG ===> contactQueue: ", contactQueue);
                });

                contact.onAccepted(async () => {
                    console.log("CDEBUG ===> onAccepted: ", contact);
                    const cnn = contact.getConnections().find(cnn => cnn.getType() === window.connect.ConnectionType.AGENT);
                    const agentChatSession = await cnn.getMediaController();
                    setCurrentContactId(contact.contactId);

                    if (isVoiceContact(contact)) {
                        console.log("CDEBUG ===> Voice contact detected. Starting voice message fetch.");

                        const intervalId = setInterval(() => {
                            console.log("CDEBUG ===> Polling for voice messages. ContactId: ", contact.contactId);
                            fetchVoiceMessages(contact.contactId);
                        }, 3000);

                        setVoiceIntervalId(intervalId);
                        console.log("CDEBUG ===> Interval started for contactId: ", contact.contactId);
                    } else {
                        console.log("CDEBUG ===> Non-voice contact. Skipping voice message fetch.");
                        // setAgentChatSessionState(state => ({
                        //                         ...state,
                        //                         [contact.contactId]: agentChatSession
                                              }));
                      // Save the session to props, this is required to send messages within the chatroom.js
                        setAgentChatSessionState(agentChatSessionState => [...agentChatSessionState, {[contact.contactId] : agentChatSession}])

                    }

                    const attrLang = contact.getAttributes().x_lang?.value;
                    if (
                        attrLang &&
                        Object.keys(languageOptions).find(key => languageOptions[key] === attrLang) !== undefined
                    ) {
                        console.log("CDEBUG ===> Setting lang code from attributes:", attrLang);
                        languageTranslate.push({ contactId: contact.contactId, lang: attrLang });
                        setLanguageTranslate(languageTranslate);
                        setRefreshChild('updated');
                    }
                    console.log("CDEBUG ===> onAccepted, languageTranslate ", languageTranslate);
                });

                contact.onConnected(async () => {
                    console.log("CDEBUG ===> onConnected() >> contactId: ", contact.contactId);
                    if (!isVoiceContact(contact)) {
                        const cnn = contact.getConnections().find(cnn => cnn.getType() === window.connect.ConnectionType.AGENT);
                        const agentChatSession = await cnn.getMediaController();
                        getEvents(contact, agentChatSession);
                    }
                });

                contact.onRefresh(() => {
                    console.log("CDEBUG ===> onRefresh() >> contactId: ", contact.contactId);
                });

                contact.onEnded(() => {
                    console.log("CDEBUG ===> onEnded() >> contactId: ", contact.contactId);
                    setLang('');
                });

                contact.onDestroy(() => {
                    console.log("CDEBUG ===> onDestroy() >> contactId: ", contact.contactId);
                    setCurrentContactId('');
                    clearChat();

                    if (voiceIntervalId) {
                        clearInterval(voiceIntervalId);
                        setVoiceIntervalId(null);
                    }
                  // Clean stored transcripts & responses
                    delete lastApiResponseRef.current[contact.contactId];
                    delete processedTranscriptsRef.current[contact.contactId];
                });
            });

            console.log("CDEBUG ===> Subscribing to Connect Agent Events");
            window.connect.agent((agent) => {
                agent.onStateChange((agentStateChange) => {
                    let state = agentStateChange.newState;
                    console.log("CDEBUG ===> New State: ", state);
                });
            });
        } else {
            console.log("CDEBUG ===> waiting 3s");
            setTimeout(function () { subscribeConnectEvents(); }, 3000);
        }
    };

    useEffect(() => {
        const connectUrl = process.env.REACT_APP_CONNECT_INSTANCE_URL;

        if (window.connect && window.connect.agentApp) {
            window.connect.agentApp.initApp(
                "ccp",
                "ccp-container",
                connectUrl + "/connect/ccp-v2/",
                {
                    ccpParams: {
                        region: process.env.REACT_APP_CONNECT_REGION,
                        pageOptions: {
                            enablePhoneTypeSettings: true
                        }
                    }
                }
            );

            subscribeConnectEvents();
        } else {
            console.error("Amazon Connect not loaded.");
        }
    }, []);

    return (
        <main>
            <Grid columns='equal' stackable padded>
                <Grid.Row>
                    <div id="ccp-container"></div>
                    <div id="chatroom"><Chatroom session={agentChatSessionState} /></div>
                </Grid.Row>
            </Grid>
        </main>
    );
};

export default Ccp;


