// storage.native.js
import * as Storage from "expo-secure-store";

export function getItemAsync(key: any) {
  return Storage.getItemAsync(key);
}

export function setItemAsync(key: any, value: any) {
  return Storage.setItemAsync(key, value);
}
