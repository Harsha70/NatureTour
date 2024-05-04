const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:3000/api/v1/users/logout",
    });
    console.log(res);
    if ((res.data.status = "success")) location.reload(true);
  } catch (err) {
    console.log("logout error: " + err);
    alert("Error logging out! Try again.");
  }
};

const logOutBtn = document.querySelector(".nav__el--logout");
// console.log(logOutBtn);
if (logOutBtn) logOutBtn.addEventListener("click", logout);
