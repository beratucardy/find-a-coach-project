let timer;

export default {
  async login(context, payload) {
    return context.dispatch("auth", {
      ...payload,
      mode: "login",
    });
  },
  async signup(context, payload) {
    return context.dispatch("auth", {
      ...payload,
      mode: "signup",
    });
  },
  async auth(context, payload) {
    const mode = payload.mode;
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDx8BR9ufXEAEfXHQT12NYIYk4dvb_JJUk";
    if (mode === "signup") {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDx8BR9ufXEAEfXHQT12NYIYk4dvb_JJUk";
    }
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      }),
    });
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message || "Faild to authenticate. Check your signup data."
      );
      throw error;
    }
    const expiresIn = responseData.expiresIn * 1000;
    // const expiresIn = 5000; deneme
    const expirationDate = new Date().getTime() + expiresIn;
    localStorage.setItem("tokenExpiration", expirationDate);
    localStorage.setItem("token", responseData.idToken);
    localStorage.setItem("userId", responseData.localId);
    timer = setTimeout(() => {
      context.dispatch("autoLogout");
    }, expiresIn);
    context.commit("setUser", {
      token: responseData.idToken,
      userId: responseData.localId,
    });
  },
  autoLogin(context) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    const expiresIn = +tokenExpiration - new Date().getTime();
    /* başa + number'a çevirir */
    if (expiresIn < 0) {
      return;
    }
    timer = setTimeout(() => {
      context.dispatch("autoLogout");
    }, expiresIn);
    if (token && userId) {
      context.commit("setUser", {
        token: token,
        userId: userId,
      });
    }
  },
  logout(context) {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiration");
    clearTimeout(timer);
    context.commit("setUser", {
      token: null,
      userId: null,
    });
  },
  autoLogout(context) {
    context.dispatch("logout");
    context.commit("setAutoLogout");
  },
};
