import React, {useEffect, useState} from 'react'
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import '../src/styles/Post.css'
import firebase from 'firebase/app'
import 'firebase/firestore';

export default function Post(props) {
    // sloppy workaround but works...
    const [likes, setLikes] = useState(props.likes);
    const [numLikes, setNumLikes] = useState(props.likes.length);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    
    useEffect(() => {
        let unsubscribe;
        if (props.postId) {
          unsubscribe = firebase.firestore()
            .collection("posts")
            .doc(props.postId)
            .collection("comments")
            .onSnapshot((snapshot) => {
              setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }
  
        return () => {
          unsubscribe();
        };
      }, [props.postId]);

    const onLike = () => {
        props.onLike(props.postId);
        if (props.likedStatus)
            setNumLikes(numLikes-1);
        else
            setNumLikes(numLikes+1);
    }

    const onComment = () => {
        console.log(comment);
        props.onComment(comment, props.postId);
    }

    const onChangeComment = (event) => {
        setComment(event.target.value);
    }

    return (
        <div className="post">
            <h3 className = "post__username">{props.username}</h3>

            <img className = "post__image" src ={props.image}/>
            <div className = "like__area">
                <Button onClick={onLike} className = "like__button" variant="danger">{props.likedStatus ? "Unlike" : "Like"}</Button>
                <h4 className="like__text">{numLikes}</h4>
            </div>
            <h4 className = "post__text"><strong>{props.username}:</strong> {props.caption}</h4>
            <div className="post__comments">
            {comments.map((comment) => (
                <p>
                <b>{comment.username}</b> {comment.text}
                </p>
            ))}
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Write a comment..."
                    aria-label="comment"
                    aria-describedby="basic-addon1"
                    onChange = {onChangeComment}
                />
                <Button type="submit" onClick={onComment} variant="outline-secondary" id="button-addon2">
                   Send 
                </Button>
            </InputGroup>
            </div>
        </div>
    )
}

