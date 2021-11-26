import React from 'react';
import '../styles/homepage.css';
import Post from '../Post.js';

export default function Homepage() {

    return (
        Post({username: "here", caption: "https://picsum.photos/id/237/200/300", 
        caption: "texthere"})
    )
}
