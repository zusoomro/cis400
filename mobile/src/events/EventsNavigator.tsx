import React from "react";
import { SafeAreaView, StyleSheet} from "react-native";
import CreateEvent from "./CreateEvent";
import sharedStyles from "../sharedStyles";

const EventsNavigator: React.FC<{}> = () => {
  // const dispatch = useDispatch();
  return (
    <SafeAreaView style={styles.container}>
      <CreateEvent/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});


export default EventsNavigator;
