import React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "../../redux/slice/auth";

export const Header = () => {
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();

	const onClickLogout = () => {
		if (window.confirm("Are you sure you wand to log?")) {
			dispatch(logout());
			window.localStorage.removeItem("token");
		}
	};

	return (
		<div className={styles.root}>
			<Container maxWidth="lg">
				<div className={styles.inner}>
					<Link className={styles.logo} to="/">
						<div>IT BLOG</div>
					</Link>
					<div className={styles.buttons}>
						{isAuth ? (
							<>
								<Link to="/add-post">
									<Button variant="contained">
										Написати статтю
									</Button>
								</Link>
								<Button
									onClick={onClickLogout}
									variant="contained"
									color="error"
								>
									Вихід
								</Button>
							</>
						) : (
							<>
								<Link to="/login">
									<Button variant="outlined">Вхід</Button>
								</Link>
								<Link to="/register">
									<Button variant="contained">
										Створити акаунт
									</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</Container>
		</div>
	);
};
