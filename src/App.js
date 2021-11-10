import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import Post from './Post'

function App() {
  const [posts, setPosts] = useState([
    {
      username:"testUser", 
      caption:"This is caption. YEP. That it is. A caption.",
      image: "https://cdna.artstation.com/p/assets/images/images/018/776/422/large/coax-22.jpg?1560694257",
    },
  ]);
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
          posts.map(post => (
            <Post username={post.username} caption={post.caption} image={post.image} />
          ))
        }


        <Post username="testUser" caption="This is caption. YEP. That it is. A caption." image="https://cdna.artstation.com/p/assets/images/images/018/776/422/large/coax-22.jpg?1560694257"/>
        <Post username="bananas" caption="bananamananana" image="https://th-thumbnailer.cdn-si-edu.com/4Nq8HbTKgX6djk07DqHqRsRuFq0=/1000x750/filters:no_upscale()/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/d5/24/d5243019-e0fc-4b3c-8cdb-48e22f38bff2/istock-183380744.jpg"/>
        <Post username="apple" caption="appleplepeleple" image="https://www.applesfromny.com/wp-content/uploads/2020/06/SnapdragonNEW.png"/>
    </div>
  );
}

export default App;
