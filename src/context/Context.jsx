import { useState, createContext } from "react";
import { toast } from "react-toastify";

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [userData, setUserData] = useState("");
  const [newProfileImage, setNewProfileImage] = useState("");
  const [otherUserIdContext, setOtherUserIdContext] = useState("");

  //SAVE PROFILE IMAGE
  const saveProfileImage = async (userData) => {
    const user_id = userData.user_id;
    const fileInput = document.querySelector('input[name="profilePicture"]');
    const file = fileInput.files[0];
    if (!file) {
      toast.error("No file selected!");
      return;
    }
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("profilePicture", file);
    try {
      const response = await fetch(`http://127.0.0.1:6001/uploadProfileIMG`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setNewProfileImage(data);
      toast.success(`Image saved!`);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDateAndTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 86400000) {
      // less than 24 hours
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // more than 24 hours
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  };

  return (
    <Context.Provider
      value={{
        saveProfileImage,
        userData,
        setUserData,
        newProfileImage,
        otherUserIdContext,
        setOtherUserIdContext,
        formatDateAndTime,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
