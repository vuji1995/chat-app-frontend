import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Conversations from "../Components/Conversations";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [receiverID, setreceiverID] = useState("");
  const [reload, setReload] = useState(null);
  const [createChatModal, setCreateChatModal] = useState(false);
  const [img, setImg] = useState("");

  useEffect(() => {
    const verifyLocalStorageToken = async () => {
      const tokenFromLocalStorage = localStorage.getItem(`token`);
      if (!tokenFromLocalStorage) {
        navigate(`/`);
        return toast.error(`Please log in!`);
      }

      const response = await fetch(`http://34.159.65.64:6001/dashboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromLocalStorage}`,
        },
      });

      const data = await response.json();

      if (data.hasOwnProperty("data")) {
        try {
          const response = await fetch(
            `http://34.159.65.64:6001/getProfileImage`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data.data),
            }
          );
          const imgObj = await response.json();
          console.log(imgObj);
          setImg(imgObj.body.imageUrl);
        } catch (error) {
          console.log(error);
        }
      }
      setUserData(data.data);
    };
    verifyLocalStorageToken();
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    navigate(`/`);
  };

  const openCloseMenu = () => {
    setOpenMenu((prevState) => {
      return !prevState;
    });
  };

  const showProfile = () => {
    navigate(`/profile`);
  };

  //CHATS LOGIC
  const [chats, setChats] = useState([]);

  const userChats = async (id) => {
    const response = await fetch(`http://34.159.65.64:6001/chat/${id}`);
    const data = await response.json();

    setChats(data);
  };

  useEffect(() => {
    const getChats = async () => {
      try {
        const data = await userChats(userData.user_id);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [userData, reload]);

  const openNewChatModal = () => {
    setCreateChatModal((prevState) => {
      return !prevState;
    });
  };

  const createNewChat = async () => {
    setCreateChatModal((prevState) => {
      return !prevState;
    });

    if (userData.user_id === receiverID) {
      toast.error(`You can't send message to yourself!`);
      return;
    }

    if (receiverID.length !== 24) {
      toast.error(`Please enter 24 characters long ID.`);
      return;
    }

    try {
      const response2 = await fetch(`http://34.159.65.64:6001/chat/getChats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderID: userData.user_id,
          receiverID: receiverID,
        }),
      });
      const data2 = await response2.json();
      if (data2.length > 0) {
        toast.error(`Chat with this user already exists!`);
        return;
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await fetch(`http://34.159.65.64:6001/chat/createChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderID: userData.user_id,
          receiverID: receiverID,
        }),
      });
      const data = await response.json();
      if (data.status === "failed") {
        toast.error(data.message);
      } else {
        setReload(`reload`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (e) => {
    setreceiverID(e.target.value);
  };

  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col relative md:flex-row md:justify-center md:items-center">
      {openMenu ? (
        <>
          <div className="w-8/12 h-screen flex flex-col items-center bg-slate-50 font-sans top-0 left-0 bottom-0 absolute topZindex px-5 md:hidden">
            <div className="flex flex-col items-center justify-center">
              <img
                src={img}
                alt=""
                className="h-20 w-20 rounded-full mt-14 top-0 left-0 object-cover"
              />
              <p className="text-xl font-bold  mt-2">{userData.name}</p>
              <p className="text-xl font-normal  mt-2">{userData.email}</p>
            </div>
            <div
              className="flex flex-col items-start justify-center mt-12 w-full px-4  hover:bg-gray-200 rounded-lg "
              onClick={showProfile}
            >
              <div
                className="flex items-center justify-start w-full py-3 cursor-pointer sm:justify-center"
                onClick={showProfile}
              >
                <span className="material-symbols-outlined  text-3xl font-normal mr-4">
                  person
                </span>
                <span className=" text-xl font-normal">Profile</span>
              </div>
            </div>
            <div
              className="flex flex-col items-start justify-center mt-2 w-full px-4  hover:bg-gray-200 rounded-lg "
              onClick={logOut}
            >
              <div
                className="flex items-center justify-start w-full py-3 cursor-pointer sm:justify-center"
                onClick={logOut}
              >
                <span className="material-symbols-outlined  text-3xl font-normal mr-4">
                  logout
                </span>
                <span className=" text-xl font-normal">Logout</span>
              </div>
            </div>
          </div>
          <div className="bg-black backdrop-filter backdrop-opacity-80 h-screen topZindex w-4/12 top-0 right-0 bottom-0 absolute">
            <span
              className="material-symbols-outlined text-white text-4xl maxZindex cursor-pointer mt-5 ml-5"
              onClick={openCloseMenu}
            >
              close
            </span>
          </div>
        </>
      ) : (
        <></>
      )}
      {createChatModal ? (
        <>
          <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 opacity-95 font-sans top-0 left-0 bottom-0 absolute topZindex md:hidden">
            <div className="flex flex-col items-center justify-center p-5 relative pt-20">
              <div className="absolute top-0 right-0">
                <span
                  className="material-symbols-outlined text-white text-3xl maxZindex cursor-pointer mt-5 mr-5"
                  onClick={openNewChatModal}
                >
                  close
                </span>
              </div>
              <span className="text-white text-xl font-semibold mb-5 ">
                Start new chat
              </span>
              <input
                type="text"
                className="bg-white px-3 py-2 rounded-lg h-12"
                placeholder="Receiver's id"
                value={receiverID}
                onChange={onChange}
              />
              <button
                className="px-5 py-2 rounded-md text-white bg-blue-500 mt-3"
                onClick={createNewChat}
              >
                Add
              </button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="flex items-center py-3 px-5 justify-between lowZindex md:hidden">
        <span
          className="material-symbols-outlined text-black text-3xl cursor-pointer"
          onClick={openCloseMenu}
        >
          menu
        </span>

        <span
          className="material-symbols-outlined text-black cursor-pointer"
          onClick={openNewChatModal}
        >
          edit
        </span>
      </div>

      <div className="Messages flex flex-row h-screen  w-screen  p-5 md:hidden">
        <div className="flex flex-col rounded-lg items-start justify-start   w-full">
          <h2 className="text-2xl font-bold text-black">Messages</h2>
          <div className="chat-list w-full">
            {chats.length === 0 ? (
              <span>No coversations</span>
            ) : (
              chats.map((chat, indx) => (
                <div key={indx}>
                  <Conversations
                    data={chat}
                    currentUser={userData.user_id}
                    otherUserId={chat.members.find(
                      (member) => member !== userData.user_id
                    )}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/*MEDIUM SCREEN SIZE*/}
      <div className="h-screen flex-col items-center font-sans topZindex p-6 hidden md:flex md:w-2/6 xl:w-1/5">
        <div className=" flex flex-col items-center justify-start h-full w-full">
          <div className="flex flex-col items-center justify-center">
            <img
              src={img}
              alt=""
              className="h-18 w-18 rounded-full mt-14 top-0 left-0 object-cover md:h-24 md:w-24"
            />
            <p className="text-xl font-bold  mt-2">{userData.name}</p>
            <p className="text-xl font-normal  mt-2">{userData.email}</p>
          </div>
          <div className="flex flex-col items-center justify-center mt-12 w-full hover:bg-gray-200 rounded-lg">
            <div
              className="flex items-center justify-center w-full p-3 py-4 cursor-pointer"
              onClick={showProfile}
            >
              <span className="material-symbols-outlined  text-3xl font-normal  md:px-0 md:mr-3 md:text-2xl">
                person
              </span>
              <span className="text-2xl font-normal md:text-2xl">Profile</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-2 w-full px-4 hover:bg-gray-200 rounded-lg md:px-1">
            <div
              className="flex items-center justify-center w-full p-3 py-4 cursor-pointer"
              onClick={openNewChatModal}
            >
              <span className="material-symbols-outlined  text-3xl font-normal px-6  md:px-0 md:mr-3 md:text-2xl">
                edit
              </span>
              <span className="text-2xl font-normal md:text-2xl">New Chat</span>
            </div>
          </div>
          <div className="flex flex-col items-start justify-center mt-2 w-full px-4  hover:bg-gray-200 rounded-lg md:px-1">
            <div
              className="flex items-center justify-center w-full p-3 py-4 cursor-pointer"
              onClick={logOut}
            >
              <span className="material-symbols-outlined  text-3xl font-normal px-6  md:px-0 md:mr-3 md:text-2xl">
                logout
              </span>
              <span className="text-2xl font-normal md:text-2xl">Logout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="Messages  flex-row h-screen  bg-white hidden  md:flex md:w-4/6 xl:w-4/5">
        {createChatModal ? (
          <>
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 opacity-95 font-sans topZindex">
              <div className="flex flex-col items-center justify-center p-5 relative pt-20">
                <div className="absolute top-0 right-0">
                  <span
                    className="material-symbols-outlined text-white text-3xl maxZindex cursor-pointer mt-5 mr-5"
                    onClick={openNewChatModal}
                  >
                    close
                  </span>
                </div>
                <span className="text-white text-xl font-semibold mb-5 ">
                  Start new chat
                </span>
                <input
                  type="text"
                  className="bg-white px-3 py-2 rounded-lg h-12"
                  placeholder="Receiver's id"
                  value={receiverID}
                  onChange={onChange}
                />
                <button
                  className="px-5 py-2 rounded-md text-white bg-blue-500 mt-3"
                  onClick={createNewChat}
                >
                  Add
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col rounded-lg items-start justify-start w-full p-10">
              <h2 className="text-3xl font-bold text-black mt-6 mb-4">
                Messages
              </h2>
              <div className="chat-list w-full">
                {chats.length === 0 ? (
                  <span>No coversations</span>
                ) : (
                  chats.map((chat, indx) => (
                    <div key={indx}>
                      <Conversations
                        data={chat}
                        currentUser={userData.user_id}
                        otherUserId={chat.members.find(
                          (member) => member !== userData.user_id
                        )}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/*MEDIUM SCREEN SIZE*/}
    </div>
  );
};

export default Dashboard;
