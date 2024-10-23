import React, { useEffect, useState } from "react";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

export const Index = ({ id, handlerSubmit, comment, setComment }) => {
	return (
		<>
			<div className={styles.root}>
				<Avatar classes={{ root: styles.avatar }} src="" />
				<div className={styles.form}>
					<TextField
						label="Написать комментарий"
						variant="outlined"
						maxRows={10}
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						multiline
						fullWidth
					/>
					<Button onClick={handlerSubmit} variant="contained">
						Отправить
					</Button>
				</div>
			</div>
		</>
	);
};
