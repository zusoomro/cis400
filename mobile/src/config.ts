let apiUrl: string;

if (__DEV__) {
  apiUrl = "http://192.168.1.183:8000";
} else {
  apiUrl = "http://wigo-api.herokuapp.com";
}

export default apiUrl;
