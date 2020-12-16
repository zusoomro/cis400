let apiUrl: string;

if (__DEV__) {
  apiUrl = "http://localhost:8000";
} else {
  apiUrl = "http://wigo-api.herokuapp.com";
}

export default apiUrl;
