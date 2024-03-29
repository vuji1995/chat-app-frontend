import { useState } from "react";
import { toast } from "react-toastify";
import validator from "email-validator";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { RingLoader } from "react-spinners";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const isValidEmail = validator.validate(email);
    if (!isValidEmail) {
      toast.error(`Email is not valid`);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://34.159.65.64:6001/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      setLoading(false);
      const data = await response.json();
      if (data.status === "failed") {
        toast.error(data.message);
      }

      if (data.status === "success") {
        toast.success(data.message);
        navigate(`/`);
      }

      if (data.status === "error") {
        toast.error(`Error while trying to reset email! Please try again!`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const goBack = () => {
    navigate(`/`);
  };

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-200 p-5">
      <div className="bg-white flex flex-col items-center justify-center px-10 py-7  rounded-xl">
        <div className="border border-l-0 border-t-0 border-r-0 border-b-1 border-gray-300 w-full py-3">
          <h2 className="text-2xl font-semibold ">Forgot password?</h2>
        </div>
        <div className="w-full mt-5">
          <span className="">
            Please enter your email address to search for your account.
          </span>
        </div>
        <div className="w-full">
          <input
            type="text"
            placeholder="email address"
            className="px-5 py-3 rounded-xl bg-gray-200  h-12 mt-10 w-full"
            value={email}
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
            onClick={sendNewPassword}
          >
            Send
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

export default ForgotPassword;
