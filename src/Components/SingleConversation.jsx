import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { format } from "timeago.js";
import InputEmojiWithRef from "react-input-emoji";
import { io } from "socket.io-client";
import { ToastContainer } from "react-toastify";

const SingleConversation = () => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const socket = useRef();
  const scroll = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const chatData = location.state.chatData;

  const userId = chatData.members.find((id) => id !== chatData.currentUser);

  const goBack = () => {
    navigate(`/dashboard`);
  };

  useEffect(() => {
    socket.current = io(`http://34.141.84.183:8800`);
    socket.current.emit("new-user-add", chatData.currentUser);
    socket.current.on(`get-user`, (users) => {
      setOnlineUsers(users);
    });
  }, []);

  const checkOnlineStates = () => {
    const chatMembers = chatData.members.find(
      (member) => member !== chatData.currentUser
    );
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

  checkOnlineStates();

  //send message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit(`send-message`, sendMessage);
    }
  }, [sendMessage]);

  //receive message from socket server
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setReceiveMessage(data);
    });
  }, [messages]);

  useEffect(() => {
    if (receiveMessage !== null && receiveMessage.chatId === chatData._id) {
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);

  useEffect(() => {
    const getUser = async (id) => {
      try {
        const response = await fetch(`http://34.159.65.64:6001/getUserData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
        const data = await response.json();
        setUserData(data.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    getUser(userId);
  }, []);

  useEffect(() => {
    const getMessages = async (id) => {
      try {
        const response = await fetch(
          `http://34.159.65.64:6001/messages/getMessage/${id}`
        );
        const data = await response.json();

        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages(chatData._id);
  }, []);

  const handleChange = (message) => {
    setNewMessage(message);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: chatData.currentUser,
      text: newMessage,
      chatId: chatData._id,
    };

    try {
      const response = await fetch(
        `http://34.159.65.64:6001/messages/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );
      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage("");

      //send message to socket server
      const receiverId = chatData.members.find(
        (id) => id !== chatData.currentUser
      );
      setSendMessage({ ...message, receiverId });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col ">
      <div className="flex items-center justify-start bg-white border border-gray-100 border-l-0 border-t-0 border-r-0 border-b-1 p-4">
        <div
          className="flex items-center justify-center mr-5 cursor-pointer"
          onClick={goBack}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <div>
          <img
            src={chatData.profileImage}
            alt=""
            className="w-16 h-16 rounded-full top-0 left-0 object-cover"
          />
        </div>
        <div className="flex flex-col items-start justify-center ml-5">
          <span className="text-xl font-semibold uppercase">
            {userData ? userData.name : "user"}
          </span>
          <p
            className={`${
              checkOnlineStates(chatData)
                ? "text-green-400 font-semibold"
                : "text-black font-semibold"
            }`}
          >
            {checkOnlineStates(chatData) ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div className="overflow-y-auto h-full">
        <div className="flex flex-col relative  flexGrow ">
          {messages.map((message, indx) => (
            <div
              ref={scroll}
              key={indx}
              className={`${
                message.senderId === userId ? "floatLeft" : "floatRight"
              } max-w-xs  px-6 py-3 mb-6 rounded-md mt-6 flex flex-col`}
            >
              <span
                className="text-lg
              "
              >
                {message.text}
              </span>
              <span className="text-sm">{format(message.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-10 py-7  flex items-center justify-between bg-gray-100 border border-gray-100 border-l-0 border-t-2 border-r-0 border-b-0">
        <InputEmojiWithRef
          className="px-5 py-3 bg-green-300"
          value={newMessage}
          onChange={handleChange}
        />
        <div
          className="bg-sky-500 px-6 py-3 text-white rounded-md cursor-pointer"
          onClick={handleSend}
        >
          Send
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SingleConversation;
