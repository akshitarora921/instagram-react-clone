import React from 'react';
import './post.css';
import { Avatar } from '@material-ui/core';
function Post({ username, imageUrl, caption }) {
	return (
		<div className="post">
			<div className="post-header">
				<Avatar className="post-avatar" alt={username} src="/static/images/avatar/1.jpeg"/>
				<h3>{username}</h3>
			</div>
			<img className='post-image' alt="post" src={imageUrl}></img>
			<h4 className='post-footer'> 
				<strong>{username}</strong> {caption}
			</h4>
		</div>
	);
}

export default Post;
