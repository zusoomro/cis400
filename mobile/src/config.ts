let apiUrl: string;

if (__DEV__) {
  apiUrl = "http://192.168.86.121:8000";
} else {
  apiUrl = "http://wigo-api.herokuapp.com";
}

export default apiUrl;
