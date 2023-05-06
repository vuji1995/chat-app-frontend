import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../context/Context";
import { toast } from "react-toastify";
import { css } from "@emotion/react";
import { RingLoader } from "react-spinners";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { saveProfileImage, userData, setUserData, profileLoading } =
    useContext(Context);

  const goBack = () => {
    navigate(`/dashboard`);
  };

  useEffect(() => {
    const verifyLocalStorageToken = async () => {
      const tokenFromLocalStorage = localStorage.getItem(`token`);
      if (!tokenFromLocalStorage) {
        navigate(`/`);
        return toast.error(`Please log in!`);
      }
      const response = await fetch(
        `https://backend-chat-app-x5ta.onrender.com/dashboard`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenFromLocalStorage}`,
          },
        }
      );

      const data = await response.json();

      setUserData(data.data);
    };
    verifyLocalStorageToken();
  }, [navigate]);

  const profileImageSave = () => {
    saveProfileImage(userData);
  };

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col px-5 py-2">
      <div className="flex items-center justify-start p-4 ">
        <span
          className="material-symbols-outlined cursor-pointer"
          onClick={goBack}
        >
          arrow_back_ios
        </span>
        <h2 className="text-black font-semibold text-xl mx-auto">Profile</h2>
        <span
          className="material-symbols-outlined cursor-pointer text-3xl font-normal"
          onClick={profileImageSave}
        >
          save
        </span>
      </div>

      <div className="w-full flex flex-col items-center justify-center mt-20 ">
        <span className="material-symbols-outlined  p-8 bg-blueColor text-white font-medium text-3xl rounded-full bottom-0 right-0">
          add_a_photo
        </span>
        <div className="flex items-center justify-center w-full mt-5 px-5 flex-col">
          <label
            htmlFor="profilePicture"
            className="file-input-label mr-1 mb-5"
          >
            Choose a profile picture:
          </label>
          <div className=" flex flex-col items-center justify-center ">
            <input
              type="file"
              name="profilePicture"
              className="file-input  cursor-pointer "
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center ">
        <div className="flex flex-col mt-10 mb-10 bg-gray-200 px-5 rounded-xl">
          <div className="flex flex-col">
            <div className="flex flex-col mt-4 mb-4">
              <span className="text-blueColor font-medium text-xl">
                User ID:
              </span>
              <span className=" text-xl ">{userData.user_id}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-blueColor font-medium text-xl">
              First name:
            </span>
            <span className=" text-xl ">{userData.name}</span>
          </div>
          <div className="flex flex-col mt-4">
            <span className="text-blueColor font-medium text-xl">Email:</span>
            <span className=" text-xl ">{userData.email}</span>
          </div>
          <div className="flex flex-col mt-4">
            <span className="text-blueColor font-medium text-xl">
              Phone number:
            </span>
            <span className=" text-xl ">{userData.phone}</span>
          </div>
          <div className="flex flex-col mt-4 mb-4">
            <span className="text-blueColor font-medium text-xl">Role:</span>
            <span className=" text-xl ">{userData.role}</span>
          </div>
        </div>
      </div>
      <div
        css={override}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <RingLoader size={100} color={"black"} loading={profileLoading} />
      </div>
    </div>
  );
};

export default ProfilePage;
