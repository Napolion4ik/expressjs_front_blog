import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios.js";
import { useSelector } from "react-redux";

import ReactMarkdown from "react-markdown";

export const FullPost = () => {
	const [data, setData] = React.useState();
	const [isLoading, setLoading] = React.useState(true);
	const [comment, setComment] = useState("");
	const userData = useSelector((state) => state.auth.data);

	const { id } = useParams();
	const handlerSubmit = async () => {
		const commentBody = {
			text: comment,
			author: userData,
		};

		const data = await axios.patch(`/comments/${id}`, commentBody);

		axios
			.get(`/posts/${id}`)
			.then(({ data }) => {
				setData(data);
				setLoading(false);
			})
			.catch((err) => {
				console.warn(err);
			});

		if (data) {
			setComment("");
		}
	};

	React.useEffect(() => {
		axios
			.get(`/posts/${id}`)
			.then(({ data }) => {
				setData(data);
				setLoading(false);
			})
			.catch((err) => {
				console.warn(err);
			});
	}, [id]);

	if (isLoading) {
		return <Post isLoading={isLoading} isFullPost />;
	}

	return (
		<>
			<Post
				id={data._id}
				title={data.title}
				imageUrl={
					data.imageUrl ? `http://localhost:3333${data.imageUrl}` : ""
				}
				user={data.user}
				createdAt={data.createdAt}
				viewsCount={data.viewsCount}
				commentsCount={!data.comments.length ? 0 : data.comments.length}
				tags={data.tags}
				isFullPost
			>
				<ReactMarkdown children={data.text} />
			</Post>
			<CommentsBlock items={data.comments} isLoading={false}>
				{userData ? (
					<Index
						comment={comment}
						setComment={setComment}
						handlerSubmit={handlerSubmit}
						id={data._id}
					/>
				) : null}
			</CommentsBlock>
		</>
	);
};
