import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginBG from "../assets/loginBg.jpg";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:6001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.status === "failed") {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const navigateTo = () => {
    navigate(`/signup`);
  };

  const forgotPassword = () => {
    navigate(`/forgotPassword`);
  };

  return (
    <div className="h-screen w-screen  flex flex-col items-center  justify-between lg:flex-row">
      <div
        className="  h-full w-full flex items-center justify-start "
        style={{
          backgroundImage: `url(${LoginBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-5xl text-white font-bold ml-10 lg:hidden">
          Welcome <br /> Back{" "}
        </h2>
      </div>
      <div className="bg-white p-10  w-full flex flex-col items-center justify-end">
        <h2 className="hidden text-4xl text-black font-bold lg:text-5xl mb-12 lg:block">
          Welcome Back{" "}
        </h2>
        <input
          type="text"
          className="text-black text-lg font-semibold mb-4 border-b-2 w-full py-4 placeholder:text-black placeholder:font-normal lg:py-6"
          placeholder="johndoe@gmail.com"
          name="email"
          onChange={onChange}
        />
        <input
          type="password"
          className="text-black text-lg font-semibold mb-4 border-b-2 w-full py-4 placeholder:text-black placeholder:font-normal lg:py-6"
          placeholder="password"
          name="password"
          onChange={onChange}
        />
        <div
          className="w-full flex text-gray-950 font-bold text-md items-center justify-end hover:underline hover:cursor-pointer lg:mt-5 lg:mb-5"
          onClick={forgotPassword}
        >
          <p>Forgot password?</p>
        </div>
        <button
          className="bg-gray-950 px-10 py-3 rounded-md text-white font-bold w-full mt-5 hover:bg-slate-800"
          onClick={login}
        >
          Log in
        </button>
        <div className="w-full flex text-gray-500  text-lg items-center justify-center mt-3 mb-3">
          <span className="">or</span>
        </div>
        <button
          className=" border-gray-400 border-2 px-10 py-3 rounded-md text-gray-500 font-bold w-full hover:bg-gray-200"
          onClick={navigateTo}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
