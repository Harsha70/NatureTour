/* eslint-disable */
// import axios from "axios";
// import { showAlert } from "./alerts";

const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    // const res = await result.json();
    console.log("login", res, email, password);

    if (res.data.status === "success") {
      alert("success, Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    console.log("error login", err, email, password);

    alert("error", err.response.data.message);
  }
};

const loginForm = document.querySelector(".form--login");
console.log(loginForm);
if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
