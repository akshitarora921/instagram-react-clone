import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import firebase from 'firebase';
import './post.css';
import { Avatar, Input } from '@material-ui/core';
function Post({ postId, user, username, imageUrl, caption }) {
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState([]);
	useEffect(() => {
		let unsubscribe;
		if (postId) {
			unsubscribe = db
				.collection('posts')
				.doc(postId)
				.collection('comments')
				.orderBy('timestamp','desc')
				.onSnapshot((snapshot) => {
					setComments(snapshot.docs.map((doc) => doc.data()));
				});
		}
		return () => {
			unsubscribe();
		};
	}, [postId]);
	const postComment = (e) => {
		if (e.key === 'Enter') {
			if (comment.length > 0) {
				db.collection('posts').doc(postId).collection('comments').add({
					text: comment,
					username: user.displayName,
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				});
				setComment('')
			}
		}
	};
	return (
		<div className="post">
			<div className="post-header">
				<Avatar className="post-avatar" alt={username} src="/static/images/avatar/1.jpeg" />
				<h3>{username}</h3>
			</div>
			<img className="post-image" alt="post" src={imageUrl}></img>
			<h4 className="post-footer">
				<strong>{username}</strong> {caption}
			</h4>
			{/* <h4>Comments</h4> */}
			{comments.map((comment) => (
				<p>
					<strong>{comment.username}</strong> {comment.text}
				</p>
			))}
			<Input
				type="text"
				className='comment'
				placeholder="Comment..."
				value={comment}
				onChange={(e) => {
					setComment(e.target.value);
				}}
				onKeyPress={postComment}
			></Input>
		</div>
	);
}

export default Post;
