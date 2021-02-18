// storage.js
import { AsyncStorage } from "@react-native-community/async-storage";

export function getItemAsync(key) {
  return AsyncStorage.getItem(key);
}

export function setItemAsync(key: any, value: any) {
  return AsyncStorage.setItem(key, value);
}
