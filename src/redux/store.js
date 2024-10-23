import { configureStore } from "@reduxjs/toolkit";
import { postReducer } from "./slice/posts";
import { authReducer } from "./slice/auth";

const store = configureStore({
	reducer: {
		posts: postReducer,
		auth: authReducer,
	},
});

export default store;
