import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);

    // Get API URL from environment variable (for Render deployment)
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

    const getAllThreads = async () => {
        try {
            const response = await fetch(`${API_URL}/thread`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const res = await response.json();
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            setAllThreads(filteredData);
        } catch (err) {
            console.error("Error fetching threads:", err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`${API_URL}/thread/${newThreadId}`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.error("Error changing thread:", err);
            alert("Failed to load thread");
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`${API_URL}/thread/${threadId}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const res = await response.json();
            console.log(res);

            // Updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.error("Error deleting thread:", err);
            alert("Failed to delete thread");
        }
    };

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="/src/assets/blacklogo.png" alt="gpt logo" className="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx}
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); // stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>

            <div className="sign">
                <p>By Pratiksha &hearts;</p>
            </div>
        </section>
    );
}

export default Sidebar;



// import "./Sidebar.css";
// import { useContext, useEffect } from "react";
// import { MyContext } from "./MyContext.jsx";
// import { v1 as uuidv1 } from "uuid";

// function Sidebar() {
//     const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);

//     const getAllThreads = async () => {
//         try {
//             const response = await fetch("http://localhost:8080/api/thread");
//             const res = await response.json();
//             const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
//             //console.log(filteredData);
//             setAllThreads(filteredData);
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     useEffect(() => {
//         getAllThreads();
//     }, [currThreadId])


//     const createNewChat = () => {
//         setNewChat(true);
//         setPrompt("");
//         setReply(null);
//         setCurrThreadId(uuidv1());
//         setPrevChats([]);
//     }

//     const changeThread = async (newThreadId) => {
//         setCurrThreadId(newThreadId);

//         try {
//             const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
//             const res = await response.json();
//             console.log(res);
//             setPrevChats(res);
//             setNewChat(false);
//             setReply(null);
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     const deleteThread = async (threadId) => {
//         try {
//             const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, { method: "DELETE" });
//             const res = await response.json();
//             console.log(res);

//             //updated threads re-render
//             setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

//             if (threadId === currThreadId) {
//                 createNewChat();
//             }

//         } catch (err) {
//             console.log(err);
//         }
//     }

//     return (
//         <section className="sidebar">
//             <button onClick={createNewChat}>
//                 <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
//                 <span><i className="fa-solid fa-pen-to-square"></i></span>
//             </button>


//             <ul className="history">
//                 {
//                     allThreads?.map((thread, idx) => (
//                         <li key={idx}
//                             onClick={(e) => changeThread(thread.threadId)}
//                             className={thread.threadId === currThreadId ? "highlighted" : " "}
//                         >
//                             {thread.title}
//                             <i className="fa-solid fa-trash"
//                                 onClick={(e) => {
//                                     e.stopPropagation(); //stop event bubbling
//                                     deleteThread(thread.threadId);
//                                 }}
//                             ></i>
//                         </li>
//                     ))
//                 }
//             </ul>

//             <div className="sign">
//                 <p>By Pratiksha &hearts;</p>
//             </div>
//         </section>
//     )
// }

// export default Sidebar;