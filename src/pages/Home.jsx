import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { fetchPosts, fetchTags, fetchPostsSort } from "../redux/slice/posts";

export const Home = () => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.auth.data);
	const { posts, tags } = useSelector((state) => state.posts);
	const [sortSelect, setSortSelect] = useState(0);

	const isPostLoading = posts.status === "loading";
	const isTagsLoading = tags.status === "loading";

	useEffect(() => {
		dispatch(fetchPosts());
		dispatch(fetchTags());
	}, []);

	const handleClickSort = (sortParams, sortNumber) => {
		dispatch(fetchPostsSort(sortParams));
		setSortSelect(sortNumber);
	};

	console.log(posts);

	return (
		<>
			<Tabs
				style={{ marginBottom: 15 }}
				value={sortSelect}
				aria-label="basic tabs example"
			>
				<Tab
					onClick={handleClickSort.bind(null, "createdAt", 0)}
					label="Нові"
				/>
				<Tab
					onClick={handleClickSort.bind(null, "viewsCount", 1)}
					label="Популярні"
				/>
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{(isPostLoading ? [...Array(5)] : posts.items).map(
						(obj, index) =>
							isPostLoading ? (
								<Post key={index} isLoading={true} />
							) : (
								<Post
									id={obj._id}
									title={obj.title}
									imageUrl={
										obj.imageUrl
											? `http://localhost:3333${obj.imageUrl}`
											: ""
									}
									user={obj.user}
									createdAt={obj.createdAt}
									viewsCount={obj.viewsCount}
									commentsCount={
										!obj.comments.length
											? 0
											: obj.comments.length
									}
									tags={obj.tags}
									isEditable={userData?._id === obj.user._id}
								/>
							)
					)}
				</Grid>
				<Grid xs={4} item>
					<TagsBlock
						items={[...new Set(tags.items)]}
						isLoading={isTagsLoading}
					/>
					<CommentsBlock
						sideShow={true}
						isLoading={isPostLoading}
						items={posts?.items[0]?.comments?.slice(0, 2)}
					/>
				</Grid>
			</Grid>
		</>
	);
};
