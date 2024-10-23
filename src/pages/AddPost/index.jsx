import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slice/auth";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";

export const AddPost = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isAuth = useSelector(selectIsAuth);
	const [loading, setLoading] = React.useState("");
	const [text, setText] = React.useState("");
	const [title, setTitle] = React.useState("");
	const [tags, setTags] = React.useState("");
	const [imageUrl, setImageUrl] = React.useState("");
	const inputFileRef = React.useRef(null);

	const isEditing = Boolean(id);

	const handleChangeFile = async (event) => {
		try {
			const formData = new FormData();
			formData.append("image", event.target.files[0]);
			const { data } = await axios.post("/upload", formData);
			setImageUrl(data.url);
		} catch (error) {
			console.warn(error);
			alert("Помилка загрузки файла");
		}
	};

	const onClickRemoveImage = () => {
		setImageUrl(null);
	};

	const onChange = React.useCallback((value) => {
		setText(value);
	}, []);

	const onSubmit = async () => {
		try {
			setLoading(true);

			const fields = {
				title,
				imageUrl,
				tags: tags.split(" "),
				text,
			};

			const { data } = isEditing
				? await axios.patch(`/posts/${id}`, fields)
				: await axios.post("/posts", fields);
			const _id = isEditing ? id : data._id;
			navigate(`/posts/${_id}`);
		} catch (error) {
			console.warn(error);
			alert("Помилка при створюванні статті FRONT");
		}
	};

	useEffect(() => {
		if (id) {
			axios
				.get(`/posts/${id}`)
				.then(({ data }) => {
					setTitle(data.title);
					setText(data.text);
					setImageUrl(data.text);
					setTags(data.tags.join(","));
				})
				.catch((err) => {
					console.warn(err);
					console.log("Помилка при отриманні статті");
				});
		}
	}, []);

	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: "400px",
			autofocus: true,
			placeholder: "Введите текст...",
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	);
	if (!window.localStorage.getItem("token") && isAuth) {
		return <Navigate to="/" />;
	}

	return (
		<Paper style={{ padding: 30 }}>
			<Button
				variant="outlined"
				onClick={() => inputFileRef.current.click()}
				size="large"
			>
				Загрузить превью
			</Button>
			<input
				ref={inputFileRef}
				type="file"
				onChange={handleChangeFile}
				hidden
			/>
			{imageUrl && (
				<>
					<Button
						variant="contained"
						color="error"
						onClick={onClickRemoveImage}
					>
						Удалить
					</Button>
					<img
						className={styles.image}
						src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
						alt="Uploaded"
					/>
				</>
			)}

			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant="standard"
				placeholder="Заголовок статьи..."
				fullWidth
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant="standard"
				placeholder="Тэги"
				value={tags}
				onChange={(e) => setTags(e.target.value)}
				fullWidth
			/>
			<SimpleMDE
				className={styles.editor}
				value={text}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size="large" variant="contained">
					{isEditing ? "Зберегти" : "Опубликовать"}
				</Button>
				<a href="/">
					<Button size="large">Отмена</Button>
				</a>
			</div>
		</Paper>
	);
};
