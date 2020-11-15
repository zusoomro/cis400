import { StyleSheet } from "react-native";

const globalFontSize = 16;

export default StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  h1: {
    fontSize: 32,
    fontWeight: "600",
    marginVertical: 15,
  },
  input: {
    backgroundColor: "white",
    marginBottom: 20,
    paddingHorizontal: 20,
    height: 45,
    fontSize: 16,
    color: "black",
    borderRadius: 10,
    width: "100%",
  },
  inputText: {
    fontSize: globalFontSize,
  },
  inputLabelText: {
    fontSize: globalFontSize,
    color: "#4A5568",
    marginBottom: 6,
  },
});
