import React from "react";
import { Provider } from "react-redux";
import LoginRegister from "../src/LoginRegister";
import { render, fireEvent, act } from "@testing-library/react-native";
import { register } from "../src/authSlice";
import configureStore from "redux-mock-store";
import { Middleware } from "redux";

const middlewares: Middleware[] = [];
const mockStore = configureStore(middlewares);

const component = (
  <Provider store={mockStore({ auth: { loading: false } })}>
    <LoginRegister />
  </Provider>
);

jest.mock("../src/authSlice", () => ({
  register: jest.fn(),
}));

describe("the registration component", () => {
  it("loads submit and input fields", () => {
    const { getByPlaceholderText, getByTestId } = render(component);

    const emailField = getByPlaceholderText("email");
    expect(emailField).toBeTruthy();

    const passwordField = getByPlaceholderText("password");
    expect(passwordField).toBeTruthy();

    const submitButton = getByTestId("Submit");
    expect(submitButton).toBeTruthy();
  });

  it("dispatches redux action with correct data", async () => {
    const data = {
      email: "test@test.com",
      password: "password",
    };

    const { getByPlaceholderText, getByTestId } = render(component);

    const emailField = getByPlaceholderText("email");
    fireEvent.changeText(emailField, data.email);

    const passwordField = getByPlaceholderText("password");
    fireEvent.changeText(passwordField, data.password);

    const submitButton = getByTestId("Submit");
    await act(async () => {
      fireEvent.press(submitButton);
    });

    expect(register).toHaveBeenCalledWith({ ...data });
  });
});
