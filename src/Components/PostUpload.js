import React, { useState } from 'react';
import { Input, Button } from '@material-ui/core';
import firebase from 'firebase';
import { storage, db } from '../firebase';
import './postupload.css';

const PostUpload = ({ username }) => {
	const [caption, setCaption] = useState('');
	const [progress, setProgress] = useState(0);
	const [image, setImage] = useState(null);

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};
	const handleUpload = (e) => {
		e.preventDefault();
		const uploadTask = storage.ref(`images/${image.name}`).put(image);
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				// progress logic
				const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
				setProgress(progress);
			},
			(error) => {
				// error function
				console.log(error);
			},
			() => {
				// final logic
				storage
					.ref('images')
					.child(image.name)
					.getDownloadURL()
					.then((url) => {
						// post imageurl to database
						db.collection('posts').add({
							timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							caption: caption,
							imageUrl: url,
							username: username,
						});
						setProgress(0);
						setImage(null);
						setCaption('');
					});
			}
		);
	};

	return (
		<div className="postupload">
			{/* add caption */}
			{/* add image */}
			{/* add upload button */}
			<progress value={progress} max="100"></progress>
			<Input
				type="text"
				placeholder="caption"
				value={caption}
				onChange={(e) => setCaption(e.target.value)}
			></Input>
			<Input type="file" onChange={handleChange}></Input>
			<Button variant="contained" color="primary" onClick={handleUpload}>
				Upload
			</Button>
		</div>
	);
};

export default PostUpload;
