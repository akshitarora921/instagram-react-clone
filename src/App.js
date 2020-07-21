import React, { useState, useEffect } from 'react';
import Post from './Components/Post';
import './App.css';
import { db } from './firebase';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Modal, Button, TextField } from '@material-ui/core';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			position: 'absolute',
			width: 400,
			backgroundColor: theme.palette.background.paper,
			border: '2px solid #000',
			boxShadow: theme.shadows[5],
			padding: theme.spacing(2, 4, 3),
		},
	})
);

function App() {
	const [posts, setPosts] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	useEffect(() => {
		db.collection('posts').onSnapshot((snapshot) => {
			setPosts(snapshot.docs.map((doc) => doc.data()));
		});
	}, []);

	const classes = useStyles();
	const [modalStyle] = React.useState(getModalStyle);

	return (
		<div className="app">
			<Modal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				style={modalStyle}
				className={classes.paper}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
				<center>
					<img
						className="app-logo"
						height="30px"
						alt="logo"
						src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F2%2F2a%2FInstagram_logo.svg%2F1200px-Instagram_logo.svg.png&f=1&nofb=1"
					></img>
					<form className={classes.root} noValidate autoComplete="off">
						<TextField id="standard-basic" label="Username" />
						<TextField id="standard-basic" label="email id" />
						<TextField id="standard-basic" label="Password" placeholder="Password" />
					</form>
				</center>
			</Modal>
			<div className="app-header">
				<img
					className="app-logo"
					height="30px"
					alt="logo"
					src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F2%2F2a%2FInstagram_logo.svg%2F1200px-Instagram_logo.svg.png&f=1&nofb=1"
				></img>
				<Button onClick={() => setModalOpen(true)}>Login</Button>
			</div>
			{posts.map((post, index) => (
				<Post username={post.username} imageUrl={post.imageUrl} caption={post.caption} />
			))}
		</div>
	);
}

export default App;
