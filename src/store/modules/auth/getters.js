export default {
  userId(state) {
    return state.userId;
  },
  token(state) {
    return state.token;
  },
  isAuthenticated(state) {
    return !!state.token;
    /* iki ünlem booleana dönüştürür */
  },
  didAutoLogout(state) {
    return state.didAutoLogout;
  },
};
