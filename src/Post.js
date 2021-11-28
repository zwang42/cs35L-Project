import React from 'react'
import '../src/styles/Post.css'

export default function Post(props) {
    return (
        <div className="post">
            <h3 className = "post__username">{props.username}</h3>

            <img className = "post__image" src ={props.image}/>

            <h4 className = "post__text"><strong>{props.username}:</strong> {props.caption}</h4>
        </div>
    )
}

