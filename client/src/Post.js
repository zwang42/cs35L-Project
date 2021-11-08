import React from 'react'
import './Post.css'

function Post({username, caption, image}) {
    return (
        <div className="post">
            <h3 className = "post__username">{username}</h3>

            <img className = "post__image" src ={image}/>

            <h4 className = "post__text"><strong>{username}:</strong> {caption}</h4>
        </div>
    )
}

export default Post