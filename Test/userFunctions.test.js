const { default: test } = require("node:test");
const functions = require("./userFunctions");
const userFunctions = require("./userFunctions");

describe("Checking GET ALL USERS", () => {
  test("", () => {
    expect.assertions(1);
    const data = userFunctions.getAllUsers();
    expect(data.status).toBe("success");
  });
});

describe("Checking GET USER", () => {
  beforeEach(() => {
    // TODO:AUTH Routes and Login test
    userFunctions.login("", "");
  });
  test("", () => {
    expect.assertions(1);
    const data = userFunctions.getUserById(0);
    expect(data.status).toBe("success");
  });
});

describe("Checking Create USER", () => {
  test("", () => {
    expect.assertions(1);
    const data = userFunctions.createUser({
      name: "",
      email: "",
      password: "",
      GPA: "",
    });
    expect(data.status).toBe("success");
  });
});

describe("Checking Update USER", () => {
  beforeEach(() => {
    userFunctions.login("", "");
  });

  test("", () => {
    expect.assertions(1);
    const data = userFunctions.updateUser({
      id: "",
      name: "",
      email: "",
      password: "",
      GPA: "",
    });
    expect(data.status).toBe("success");
  });
});

describe("Checking DELETE USER", () => {
  beforeEach(() => {
    userFunctions.login("", "");
  });
  test("", () => {
    expect.assertions(1);
    const data = userFunctions.deleteUser(0);
    expect(data.status).toBe("success");
  });
});
