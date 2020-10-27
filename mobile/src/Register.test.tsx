import React from "react";
import { Provider } from "react-redux";
import store from "./configureStore";
import Register from "./Register";
import { render, fireEvent, act } from "@testing-library/react-native";
import fetchMock from "fetch-mock";
import { register } from "./authSlice";

const component = (
  <Provider store={store}>
    <Register />
  </Provider>
);

jest.mock("./authSlice", () => ({
  register: jest.fn(),
}));

describe("the registration component", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("loads submit and input fields", () => {
    const { getByPlaceholderText, getByA11yLabel } = render(component);

    const emailField = getByPlaceholderText("email");
    expect(emailField).toBeTruthy();

    const passwordField = getByPlaceholderText("password");
    expect(passwordField).toBeTruthy();

    const submitButton = getByA11yLabel("Submit");
    expect(submitButton).toBeTruthy();
  });

  it("dispatches redux action with correct data", async () => {
    data = {
      email: "test@test.com",
      password: "password",
    };

    const { getByPlaceholderText, getByA11yLabel } = render(component);

    const emailField = getByPlaceholderText("email");
    fireEvent.changeText(emailField, data.email);

    const passwordField = getByPlaceholderText("password");
    fireEvent.changeText(passwordField, data.password);

    const submitButton = getByA11yLabel("Submit");
    await act(async () => {
      fireEvent.press(submitButton);
    });

    expect(register).toHaveBeenCalledWith({ ...data });
  });
});
