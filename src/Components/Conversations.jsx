import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../context/Context";

const Conversations = ({ data, currentUser, otherUserId }) => {
  const { formatDateAndTime } = useContext(Context);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [lastMessageDate, setLastMessageDate] = useState("");
  const [lastMessageText, setLastMessageText] = useState("");
  const [chatProfileImg, setChatProfileImg] = useState(null);

  //GET OTHERS USER DATA
  const getUser = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:6001/getUserData`, {
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

  const getMessages = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:6001/messages/getMessage/${id}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const lastObj = data[data.length - 1];
        setLastMessageDate(lastObj.createdAt);
        setLastMessageText(lastObj.text);
      }
    } catch (error) {
      console.log(error);
    }
  };

  getMessages(data._id);

  useEffect(() => {
    getUser(otherUserId);
    getOtherUserProfileImage(otherUserId);
  }, []);

  const getOtherUserProfileImage = async (user_id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:6001/getOtherUserProfileImage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id }),
        }
      );
      const img = await response.json();
      setChatProfileImg(img.body.imageUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const formattedDate = formatDateAndTime(lastMessageDate);

  let chatData = data;
  chatData.currentUser = currentUser;
  chatData.profileImage = chatProfileImg;

  const openConversation = () => {
    navigate(`/chat`, { state: { chatData } });
  };

  return (
    <div
      className="bg-gray-200 w-full flex  items-center justify-start p-5 mt-5 rounded-lg cursor-pointer"
      onClick={openConversation}
    >
      <div className="flex items-center w-full  justify-between">
        <div className="flex items-center">
          <img
            src={chatProfileImg}
            alt=""
            className="rounded-full w-14 h-14 mr-4 top-0 left-0 object-cover"
          />
          <div className="flex flex-col items-start justify-center">
            <p className="font-xl font-bold uppercase">
              {userData ? userData.name : "user"}
            </p>
            <span className="font-xl font-normal">
              {lastMessageText ? lastMessageText : ""}
            </span>
          </div>
        </div>
        <div>
          <span>{formattedDate !== "NaN/NaN/NaN" ? formattedDate : ""}</span>
        </div>
      </div>
    </div>
  );
};

export default Conversations;
