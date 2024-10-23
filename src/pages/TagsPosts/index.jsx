import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../../components/Post";
import { useSelector } from "react-redux";
import axios from "../../axios";

export function TagsPosts() {
	const userData = useSelector((state) => state.auth.data);
	const [postSortTags, setPostSortTags] = useState([...Array(5)]);
	const [isPostLoading, setIsPostLoading] = useState(true);
	const { tag } = useParams();

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await axios.get(`/tags/${tag}`);
			setPostSortTags(data);
			setIsPostLoading(false);
		};

		fetchData();
	}, [isPostLoading, postSortTags]);

	return (
		<>
			<h1>{tag}</h1>
			{(isPostLoading ? postSortTags : postSortTags).map((obj, index) =>
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
						commentsCount={3}
						tags={obj.tags}
						isEditable={userData?._id === obj.user._id}
					/>
				)
			)}
		</>
	);
}
