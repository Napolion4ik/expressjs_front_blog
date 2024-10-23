import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
	const { data } = await axios.get("/posts");
	return data;
});

export const fetchPostsSort = createAsyncThunk(
	"posts/fetchPostsSort",
	async (sortParams) => {
		const { data } = await axios.get(`/posts/sort/${sortParams}`);
		return data;
	}
);

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
	const { data } = await axios.get("/tags");
	return data;
});
export const fetchRemovePost = createAsyncThunk(
	"posts/fetchRemovePost",
	async (id) => await axios.delete(`/posts/${id}`)
);

const initialState = {
	posts: {
		items: [],
		status: "loading",
	},
	tags: {
		items: [],
		status: "loading",
	},
};

const postSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {},
	extraReducers: {
		[fetchPosts.pending]: (state) => {
			state.posts.status = "loading";
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload;
			state.posts.status = "loaded";
		},
		[fetchPosts.rejected]: (state) => {
			state.posts.items = [];
			state.posts.status = "error";
		},
		// TAGS FETCH
		[fetchTags.pending]: (state) => {
			state.tags.status = "loading";
		},
		[fetchTags.fulfilled]: (state, action) => {
			state.tags.items = action.payload;
			state.tags.status = "loaded";
		},
		[fetchTags.rejected]: (state) => {
			state.tags.items = [];
			state.tags.status = "error";
		},
		// DELETE FETCH
		[fetchRemovePost.pending]: (state, action) => {
			state.posts.items = state.posts.items.filter(
				(obj) => obj._id !== action.meta.arg
			);
		},
		// FETCH POST SORT
		[fetchPostsSort.pending]: (state) => {
			state.posts.status = "loading";
		},
		[fetchPostsSort.fulfilled]: (state, action) => {
			state.posts.items = action.payload;
			state.posts.status = "loaded";
		},
		[fetchPostsSort.rejected]: (state) => {
			state.posts.items = [];
			state.posts.status = "error";
		},
	},
});

export const postReducer = postSlice.reducer;
