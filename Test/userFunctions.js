const axios = require("axios");

const functions = {
  createUser: ({ name, email, password, GPA }) =>
    axios({
      method: "patch",
      url: "/",
      headers: {},
      data: {
        name: name,
        email: email,
        password: password,
        GPA: GPA,
      },
    })
      .then((res) => res.data)
      .catch((err) => "error"),

  updateUser: ({id, name, email, password, GPA }) =>
    axios({
      method: "patch",
      url: `/${id}`,
      headers: {},
      data: {
        name: name,
        email: email,
        password: password,
        GPA: GPA,
      },
    })
      .then((res) => res.data)
      .catch((err) => "error"),

  deleteUser: (id) =>
    axios
      .delete(`/${id}`)
      .then((res) => res.data)
      .catch((err) => "error"),

  getAllUsers: () =>
    axios
      .get("/")
      .then((res) => res.data)
      .catch((err) => "error"),

  getUserById: (id) =>
    axios
      .get(`/${id}`)
      .then((res) => res.data)
      .catch((err) => "error"),
};

module.exports = functions;
