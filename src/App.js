import React, { useState, useEffect } from 'react';
import Post from './Components/Post';
import './App.css';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Button, Input } from '@material-ui/core';
import PostUpload from './Components/PostUpload';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: 'none',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));
function App() {
	const [posts, setPosts] = useState([]);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [loginModalOpen, setLoginModalOpen] = useState(false);
	const [signupModalOpen, setSignupModalOpen] = useState(false);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				setUser(authUser);
			} else {
				setUser(null);
			}
		});
		return () => {
			// perform some cleanup
			unsubscribe();
		};
	}, [user, username]);
	useEffect(() => {
		db.collection('posts')
			.orderBy('timestamp', 'desc')
			.onSnapshot((snapshot) => {
				setPosts(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						post: doc.data(),
					}))
				);
			});
	}, []);

	const classes = useStyles();
	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = React.useState(getModalStyle);

	const signup = (e) => {
		e.preventDefault();

		auth.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
				return authUser.user.updateProfile({
					displayName: username,
				});
			})
			.catch((err) => alert(err.message));

		setSignupModalOpen(false);
	};
	const logIn = (e) => {
		e.preventDefault();

		auth.signInWithEmailAndPassword(email, password).catch((err) => alert(err.message));
		setLoginModalOpen(false);
		setEmail('');
		setPassword('');
	};

	return (
		<div className="app">
			<div className="app-header">
				<img
					className="app-logo"
					height="30px"
					alt="logo"
					src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F2%2F2a%2FInstagram_logo.svg%2F1200px-Instagram_logo.svg.png&f=1&nofb=1"
				></img>
				<div className="buttons">
					{user ? (
						<Button onClick={() => auth.signOut()}>LogOut</Button>
					) : (
						<div className="app-login-container">
							<Button onClick={() => setLoginModalOpen(true)}>Login</Button>
							<Button onClick={() => setSignupModalOpen(true)}>Sign up</Button>
						</div>
					)}
				</div>
			</div>
			<div className="app-post">
				{posts.map(({ id, post }) => (
					<Post
						key={id}
						postId={id}
						user={user}
						username={post.username}
						imageUrl={post.imageUrl}
						caption={post.caption}
					/>
				))}
			</div>
			{user?.displayName ? <PostUpload username={user.displayName} /> : <h3>Login to upload</h3>}
			<Modal
				open={signupModalOpen}
				onClose={() => setSignupModalOpen(false)}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
				<div style={modalStyle} className={classes.paper}>
					<form className="app-signup">
						<center>
							<img
								className="app-logo"
								height="30px"
								alt="logo"
								src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F2%2F2a%2FInstagram_logo.svg%2F1200px-Instagram_logo.svg.png&f=1&nofb=1"
							></img>
						</center>
						<Input
							type="text"
							placeholder="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						></Input>
						<Input
							type="text"
							placeholder="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						></Input>
						<Input
							type="password"
							placeholder="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						></Input>
						<Button type="submit" onClick={signup}>
							Sign up
						</Button>
					</form>
				</div>
			</Modal>
			<Modal
				open={loginModalOpen}
				onClose={() => setLoginModalOpen(false)}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
				<div style={modalStyle} className={classes.paper}>
					<form className="app-signup">
						<center>
							<img
								className="app-logo"
								height="30px"
								alt="logo"
								src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F2%2F2a%2FInstagram_logo.svg%2F1200px-Instagram_logo.svg.png&f=1&nofb=1"
							></img>
						</center>
						<Input
							type="text"
							placeholder="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						></Input>

						<Input
							type="password"
							placeholder="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						></Input>
						<Button type="submit" onClick={logIn}>
							Login
						</Button>
					</form>
				</div>
			</Modal>
		</div>
	);
}

export default App;
