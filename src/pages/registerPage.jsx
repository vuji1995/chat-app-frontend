import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import validator from "email-validator";
import FormData from "form-data";
import signupBG from "../assets/signupBG.jpg";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    profilePicture: "",
  });

  const onChange = (e) => {
    if (e.target.name === "profilePicture") {
      setRegisterData((prevState) => ({
        ...prevState,
        profilePicture: e.target.files[0],
      }));
    } else {
      setRegisterData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const isPasswordValid = (password) => {
    const trimmedPassword = password.trim();
    return trimmedPassword.length >= 8 && trimmedPassword.length <= 20;
  };

  const isNameValid = (name) => {
    const trimmedName = name.trim();
    return trimmedName.length >= 2 && trimmedName.length <= 20;
  };

  const isValidPhoneNumber = (phoneNumber) => {
    phoneNumber = phoneNumber.toString().replace(/\s/g, "");

    if (phoneNumber.length !== 9 && phoneNumber.length !== 10) {
      return false;
    }

    const validPrefixes = ["091", "092", "095", "097", "098"];
    return validPrefixes.includes(phoneNumber.substr(0, 3));
  };

  //REGISTER USER
  const registerUser = async (e) => {
    e.preventDefault();

    if (!isNameValid(registerData.name)) {
      return toast.error(
        `Name must be at least 2 characters long and max. 20 characters long`
      );
    }

    const isValidEmail = validator.validate(registerData.email);
    if (!isValidEmail) {
      return toast.error(`Email is not valid`);
    }

    if (!isPasswordValid(registerData.password)) {
      return toast.error(
        `Password need to be min. 8 and max. 20 characters long without white spaces`
      );
    }

    if (registerData.password !== registerData.passwordConfirm) {
      return toast.error(`Password are not same!`);
    }

    if (!isValidPhoneNumber(registerData.phone)) {
      return toast.error(
        `Phone number needs to start with 091, 092, 095, 097, 098, 099 with length of 9 to 10 digits`
      );
    }

    try {
      const formData = new FormData();
      formData.append("name", registerData.name);
      formData.append("email", registerData.email);
      formData.append("password", registerData.password);
      formData.append("passwordConfirm", registerData.passwordConfirm);
      formData.append("phone", registerData.phone);
      formData.append("profilePicture", registerData.profilePicture);

      const response = await fetch(`https://127.0.0.1:6001/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();
      if (data.status === "success") {
        toast.success(`You have successfully signed up!`);
        navigate(`/`);
      }

      if (data.status === "failed") {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const navigateTo = () => {
    navigate(`/`);
  };

  return (
    <div className="h-screen w-screen  flex flex-col items-center justify-between lg:flex-row">
      <div
        className=" h-full w-full flex items-center justify-start"
        style={{
          backgroundImage: `url(${signupBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-4xl text-white font-bold ml-10 lg:text-5xl lg:hidden">
          Create <br /> Account{" "}
        </h2>
      </div>

      <div className="bg-white  p-10 w-full  flex flex-col items-center justify-end">
        <h2 className="hidden text-4xl text-black font-bold lg:text-5xl mb-12 lg:block">
          Create Account{" "}
        </h2>
        <input
          type="text"
          className="text-black text-lg font-semibold mb-4 border-b-2 w-full py-4  placeholder:text-black placeholder:font-normal lg:py-6 lg:text-xl"
          placeholder="Name"
          name="name"
          onChange={onChange}
        />
        <input
          type="text"
          className="text-black text-lg font-semibold mb-4 border-b-2 w-full py-4 placeholder:text-black placeholder:font-normal lg:py-6 lg:text-xl"
          placeholder="Email"
          name="email"
          onChange={onChange}
        />
        <input
          type="password"
          className="text-black text-lg font-semibold mb-4 border-b-2 w-full py-4 placeholder:text-black placeholder:font-normal lg:py-6 lg:text-xl"
          placeholder="Password"
          name="password"
          onChange={onChange}
        />
        <input
          type="password"
          className="text-black text-lg font-semibold mb-4 border-b-2 w-full py-4 placeholder:text-black placeholder:font-normal lg:py-6 lg:text-xl"
          placeholder="Password Confirm"
          name="passwordConfirm"
          onChange={onChange}
        />
        <input
          type="text"
          className="text-black text-lg font-semibold mb-4 border-b-2 w-full py-4 placeholder:text-black placeholder:font-normal lg:py-6 lg:text-xl"
          placeholder="Mobile phone"
          name="phone"
          onChange={onChange}
        />

        <button
          className="bg-gray-950 px-10 py-3 rounded-md text-white font-bold w-full mt-3 hover:bg-slate-800 lg:mt-6"
          onClick={registerUser}
        >
          Sign up
        </button>
        <div className="w-full flex  text-lg items-center justify-center mt-2 mb-2 lg:mt-3 lg:mb-3">
          <span className="">or</span>
        </div>
        <button
          className=" border-gray-400 border-2 px-10 py-3 rounded-md text-gray-500 font-bold w-full hover:bg-gray-200"
          onClick={navigateTo}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
