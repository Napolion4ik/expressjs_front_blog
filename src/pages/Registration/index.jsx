import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { fetchAuth, fetchRegister, selectIsAuth } from "../../redux/slice/auth";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";

export const Registration = () => {
	const isAuth = useSelector(selectIsAuth);

	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm(
		{
			fullName: "",
			email: "",
			password: "",
		},
		"onChange"
	);

	const onSubmit = async (values) => {
		const data = await dispatch(fetchRegister(values));

		if (!data.payload) alert("Не вдалось зареєструватись");

		if ("token" in data) {
			window.localStorage.setItem("token", data.token);
		}
	};
	if (isAuth) {
		return <Navigate to="/" />;
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Создание аккаунта
			</Typography>
			<div className={styles.avatar}>
				<Avatar sx={{ width: 100, height: 100 }} />
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					error={Boolean(errors.fullName?.message)}
					helperText={errors.fullName?.message}
					{...register("fullName", {
						required: "Укажите полное им'я",
					})}
					className={styles.field}
					label="Полное имя"
					fullWidth
				/>
				<TextField
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					{...register("email", { required: "Укажите почту" })}
					className={styles.field}
					label="E-Mail"
					fullWidth
				/>
				<TextField
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register("password", { required: "Укажите пароль" })}
					className={styles.field}
					label="Пароль"
					fullWidth
				/>
				<Button
					size="large"
					type="submit"
					variant="contained"
					fullWidth
				>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	);
};
