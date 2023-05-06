import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { css } from "@emotion/react";
import { RingLoader } from "react-spinners";

const PatchPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    password: "",
    passwordConfirm: "",
  });

  const onChange = (e) => {
    setPasswords((oldState) => ({
      ...oldState,
      [e.target.name]: e.target.value,
    }));
  };

  const goBack = () => {
    navigate(`/`);
  };

  const isPasswordValid = (password) => {
    const trimmedPassword = password.trim();
    return trimmedPassword.length >= 8 && trimmedPassword.length <= 20;
  };

  function extractTokenFromUrl(url) {
    const parts = url.split("/");
    const lastPart = parts.pop();
    return lastPart || null;
  }

  const resetPassword = async () => {
    setLoading(true);
    if (
      isPasswordValid(passwords.password) !== true ||
      isPasswordValid(passwords.passwordConfirm) !== true
    ) {
      setLoading(false);
      toast.error(`Passwords need to have 8-20 characters`);
      return;
    }

    if (passwords.password !== passwords.passwordConfirm) {
      setLoading(false);
      toast.error(`Passwords are not same!`);
      return;
    }

    const url = window.location.href;
    let token = extractTokenFromUrl(url);

    const response = await fetch(
      `https://backend-chat-app-x5ta.onrender.com/resetPassword/${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passwords }),
      }
    );

    setLoading(false);
    const data = await response.json();

    if (data.status === "success") {
      toast.success("Password is changed successfully !");

      navigate(`/`);
    }

    if (data.status === "failed") {
      toast.error(data.message);
    }

    if (data.status === "error") {
      toast.error(`Error while trying to reset email! Please try again!`);
    }
  };

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-200 p-5">
      <div className="bg-white flex flex-col items-center justify-center px-14 py-7  rounded-xl">
        <div className="border border-l-0 border-t-0 border-r-0 border-b-1 border-gray-300 w-full py-3">
          <h2 className="text-2xl font-semibold ">Password reset</h2>
        </div>
        <div className="w-full mt-5">
          <span className="">
            Please enter new password and password confirm.
          </span>
        </div>
        <div className="w-full">
          <input
            type="password"
            placeholder="password"
            className="px-5 py-3 rounded-xl bg-gray-200  h-12 mt-10 w-full"
            name="password"
            onChange={onChange}
          />
        </div>
        <div className="w-full">
          <input
            type="password"
            placeholder="password"
            className="px-5 py-3 rounded-xl bg-gray-200  h-12 mt-5 mb-6 w-full"
            name="passwordConfirm"
            onChange={onChange}
          />
        </div>
        <div className="flex w-full items-center justify-end">
          <button
            className="px-5 py-2 bg-gray-400 text-white font-semibold rounded-lg mt-5 mr-2"
            onClick={goBack}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg mt-5 hover:bg-blue-600 "
            onClick={resetPassword}
          >
            Reset
          </button>
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
        <RingLoader size={100} color={"black"} loading={loading} />
      </div>
    </div>
  );
};

export default PatchPassword;
