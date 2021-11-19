import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import Post from './Post'
import {db } from './firebase';

function App() {
 /* const [posts, setPosts] = useState([
    {
      username:"testUser", 
      caption:"This is caption. YEP. That it is. A caption.",
      image: "https://cdna.artstation.com/p/assets/images/images/018/776/422/large/coax-22.jpg?1560694257",
    },
  ]);*/

  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, [posts])

  return (
    <div className="app">
        <div className = "app__header">
          <img
            className = "app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
            alt=""
          />
        </div>

        {
          posts.map(({id, post}) => (
            <Post key={id} username={post.username} caption={post.caption} image={post.image} />
          ))
        }

    </div>
  );
}

export default App;
