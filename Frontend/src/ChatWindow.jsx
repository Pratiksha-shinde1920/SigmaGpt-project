import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // ✅ CHANGE #1: Get API URL from environment variable (for Render)
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

    const getReply = async () => {
        // ✅ CHANGE #2: Add input validation
        if (!prompt.trim()) {
            console.log("Empty message, not sending");
            return;
        }

        setLoading(true);
        setNewChat(false);

        console.log("message: ", prompt, " threadId: ", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            // ✅ CHANGE #3: Use API_URL from environment instead of hardcoded localhost
            const response = await fetch(`${API_URL}/chat`, options);

            // ✅ CHANGE #4: Check if response is OK
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const res = await response.json();
            console.log("API Response: ", res);
            setReply(res.reply);
        } catch (err) {
            // ✅ CHANGE #5: Better error handling
            console.error("Error fetching reply: ", err);
            alert("Failed to get response. Check console for details.");
        } finally {
            // ✅ CHANGE #6: Use finally to ensure loading is always reset
            setLoading(false);
        }
    }

    //Append new chat to prevChats
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                }, {
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen &&
                <div className="dropDown">
                    {/* ✅ CHANGE #7: Fixed 'class' to 'className' in React */}
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            <Chat></Chat>

            {/* ✅ CHANGE #8: Changed to self-closing tag */}
            <ScaleLoader color="#fff" loading={loading} />

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && getReply()}
                    />
                    {/* ✅ CHANGE #9: Changed from <input></input> to self-closing <input /> */}
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;


// import "./ChatWindow.css";
// import Chat from "./Chat.jsx";
// import { MyContext } from "./MyContext.jsx";
// import { useContext, useState, useEffect } from "react";
// import { ScaleLoader } from "react-spinners";

// function ChatWindow() {
//     const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat } = useContext(MyContext);
//     const [loading, setLoading] = useState(false);
//     const [isOpen, setIsOpen] = useState(false);

//     const getReply = async () => {
//         setLoading(true);
//         setNewChat(false);

//         console.log("message ", prompt, " threadId ", currThreadId);
//         const options = {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 message: prompt,
//                 threadId: currThreadId
//             })
//         };

//         try {
//             const response = await fetch("http://localhost:8080/api/chat", options);
//             const res = await response.json();
//             console.log(res);
//             setReply(res.reply);
//         } catch (err) {
//             console.log(err);
//         }
//         setLoading(false);
//     }

//     //Append new chat to prevChats
//     useEffect(() => {
//         if (prompt && reply) {
//             setPrevChats(prevChats => (
//                 [...prevChats, {
//                     role: "user",
//                     content: prompt
//                 }, {
//                     role: "assistant",
//                     content: reply
//                 }]
//             ));
//         }

//         setPrompt("");
//     }, [reply]);


//     const handleProfileClick = () => {
//         setIsOpen(!isOpen);
//     }

//     return (
//         <div className="chatWindow">
//             <div className="navbar">
//                 <span>SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
//                 <div className="userIconDiv" onClick={handleProfileClick}>
//                     <span className="userIcon"><i className="fa-solid fa-user"></i></span>
//                 </div>
//             </div>
//             {
//                 isOpen &&
//                 <div className="dropDown">
//                     <div className="dropDownItem"><i class="fa-solid fa-gear"></i> Settings</div>
//                     <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
//                     <div className="dropDownItem"><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
//                 </div>
//             }
//             <Chat></Chat>

//             <ScaleLoader color="#fff" loading={loading}>
//             </ScaleLoader>

//             <div className="chatInput">
//                 <div className="inputBox">
//                     <input placeholder="Ask anything"
//                         value={prompt}
//                         onChange={(e) => setPrompt(e.target.value)}
//                         onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
//                     >

//                     </input>
//                     <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
//                 </div>
//                 <p className="info">
//                     SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
//                 </p>
//             </div>
//         </div>
//     )
// }

// export default ChatWindow;