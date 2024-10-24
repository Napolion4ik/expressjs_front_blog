import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import styles from "./Login.module.scss";
import { fetchAuth, selectIsAuth } from "../../redux/slice/auth";

export const Login = () => {
	const isAuth = useSelector(selectIsAuth);

	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isValid },
	} = useForm(
		{
			email: "",
			password: "",
		},
		"onChange"
	);

	const onSubmit = async (values) => {
		const data = await dispatch(fetchAuth(values));

		if (!data.payload) alert("Не вдалось авторизуватись");
		if ("token" in data.payload) {
			window.localStorage.setItem("token", data.payload.token);
		}
	};
	if (isAuth) {
		return <Navigate to="/" />;
	}

	// useEffect();

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Вход в аккаунт
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label="E-Mail"
					type="email"
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					{...register("email", { required: "Укажите почту" })}
					fullWidth
				/>
				<TextField
					className={styles.field}
					label="Пароль"
					{...register("password", { required: "Укажите пароль" })}
					helperText={errors.password?.message}
					error={Boolean(errors.password?.message)}
					fullWidth
				/>
				<Button
					type="submit"
					size="large"
					variant="contained"
					fullWidth
				>
					Войти
				</Button>
			</form>
		</Paper>
	);
};
