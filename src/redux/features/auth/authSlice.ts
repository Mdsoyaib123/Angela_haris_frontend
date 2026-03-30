import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { User, LoginResponse, RegisterResponse } from "@/redux/types/auth.type";
import { authApi } from "./authApi";

type AuthState = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user: User;
        token?: string;
        refreshToken?: string;
      }>,
    ) => {
      state.user = action.payload.user;
      if (action.payload.token) {
        state.token = action.payload.token;
        Cookies.set("token", action.payload.token, { expires: 1 });
      }
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
        Cookies.set("refreshToken", action.payload.refreshToken, {
          expires: 7,
        });
      }
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      Cookies.remove("token");
      Cookies.remove("refreshToken");
    },
    loadUserFromToken: (state) => {
      const token = Cookies.get("token");
      const refreshToken = Cookies.get("refreshToken");
      if (token) {
        state.token = token;
        state.refreshToken = refreshToken || null;
        // const userStr = localStorage.getItem("user");
        // if (userStr) state.user = JSON.parse(userStr);
      }
    },
  },
  extraReducers: (builder) => {
    // Handle login success
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }: PayloadAction<LoginResponse>) => {
        if (payload.data.isTwoStepVerification) {
          // If 2FA is enabled, do NOT store tokens yet
          return;
        }

        state.token = payload.data.access_token;
        state.refreshToken = payload.data.refresh_token;
        state.user = {
          id: payload.data.user.id,
          email: payload.data.user.email,
          athleteFullName: payload.data.user.athleteFullName,
          parentName: payload.data.user.parentName,
          dateOfBirth: payload.data.user.dateOfBirth,
          city: payload.data.user.city,
          state: payload.data.user.state,
          gradYear: payload.data.user.gradYear,
          position: payload.data.user.position,
          height: payload.data.user.height,
          weight: payload.data.user.weight,
          school: payload.data.user.school,
          gpa: payload.data.user.gpa,
          imgUrl: payload.data.user.imgUrl,
          role: payload.data.user.role,
          subscribeStatus: payload.data.user.subscribeStatus,
          isActive: payload.data.user.isActive,
          createdAt: payload.data.user.createdAt,
          updatedAt: payload.data.user.updatedAt,
        };
        Cookies.set("token", payload.data.access_token, { expires: 1 });
        Cookies.set("refreshToken", payload.data.refresh_token, { expires: 7 });
        // localStorage.setItem("user", JSON.stringify(state.user));
      },
    );

    // Handle register success
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, { payload }: PayloadAction<RegisterResponse>) => {
        state.token = payload.data.access_token;
        state.refreshToken = payload.data.refresh_token;
        state.user = {
          id: payload.data.user.id,
          email: payload.data.user.email,
          athleteFullName: payload.data.user.athleteFullName,
          parentName: payload.data.user.parentName,
          dateOfBirth: payload.data.user.dateOfBirth,
          city: payload.data.user.city,
          state: payload.data.user.state,
          gradYear: payload.data.user.gradYear,
          position: payload.data.user.position,
          height: payload.data.user.height,
          weight: payload.data.user.weight,
          school: payload.data.user.school,
          gpa: payload.data.user.gpa,
          imgUrl: payload.data.user.imgUrl,
          role: payload.data.user.role,
          subscribeStatus: payload.data.user.subscribeStatus,
          isActive: payload.data.user.isActive,
          createdAt: payload.data.user.createdAt,
          updatedAt: payload.data.user.updatedAt,
        };
        Cookies.set("token", payload.data.access_token, { expires: 1 });
        Cookies.set("refreshToken", payload.data.refresh_token, { expires: 7 });
        // localStorage.setItem("user", JSON.stringify(state.user));
      },
    );
  },
});

export const { setUser, logOut, loadUserFromToken } = authSlice.actions;
export default authSlice.reducer;

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import Cookies from "js-cookie";
// import { User, LoginResponse } from "@/redux/types/auth.type";
// import { authApi } from "./authApi";

// type AuthState = {
//   user: User | null;
//   token: string | null;
// };

// const initialState: AuthState = {
//   user: null,
//   token: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<{ user: User; token?: string }>) => {
//       state.user = action.payload.user;
//       if (action.payload.token) {
//         state.token = action.payload.token;
//         Cookies.set("token", action.payload.token, { expires: 1 });
//       }
//       localStorage.setItem("user", JSON.stringify(action.payload.user));
//     },
//     logOut: (state) => {
//       state.user = null;
//       state.token = null;
//       Cookies.remove("token");
//       localStorage.removeItem("user");
//     },
//     loadUserFromToken: (state) => {
//       const token = Cookies.get("token");
//       if (token) {
//         state.token = token;
//         const userStr = localStorage.getItem("user");
//         if (userStr) state.user = JSON.parse(userStr);
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addMatcher(
//       authApi.endpoints.login.matchFulfilled,
//       (state, { payload }: PayloadAction<LoginResponse>) => {
//         state.token = payload.accessToken;
//         state.user = {
//           id: payload.user.id,
//           email: payload.user.email,
//           name: `${payload.user.firstName} ${payload.user.lastName}`,
//           role: payload.user.role,
//         };
//         Cookies.set("token", payload.accessToken, { expires: 1 });
//         localStorage.setItem("user", JSON.stringify(state.user));
//       },
//     );
//   },
// });

// export const { setUser, logOut, loadUserFromToken } = authSlice.actions;
// export default authSlice.reducer;
