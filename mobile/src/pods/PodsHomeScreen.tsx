import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loadUserPods } from "./podSlice";
import SectionButton from "../shared/SectionButton";
import { RootState } from "../configureStore";
import { StackNavigationProp } from "@react-navigation/stack";

interface Pod {
  id: number;
  ownerId: number;
  name: string;
}

interface Props {
  navigation: StackNavigationProp<any>;
}

const PodsHomeScreen: React.FC<Props> = ({ navigation }) => {
  const firstPod = useSelector((state: RootState) => state.pods.pods[0]);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(loadUserPods());
  }, []);

  return (
    <SafeAreaView>
      <View>
        {firstPod == null ? (
          <Button
            title="Create New Pod"
            onPress={() => {
              navigation.navigate("CreatePod");
              return;
            }}
          />
        ) : (
          <React.Fragment>
            <Text style={[styles.h1, { marginLeft: 10, marginTop: 20 }]}>
              {firstPod?.name ? firstPod.name : "Your Pod"}
            </Text>
            <SectionButton
              title="Manage Members"
              onPress={() => navigation.navigate("ManageMembers")}
              style={{ marginTop: 10 }}
            />
          </React.Fragment>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: "300",
  },
});

export default PodsHomeScreen;
