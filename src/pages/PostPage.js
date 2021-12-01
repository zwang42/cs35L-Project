import '../styles/homepage.css';
import React, {useState, useEffect} from 'react';
import Post from '../Post.js'
import '../styles/home.css'

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import {storage, db, auth} from "../firebase.js"

import ImageUpload from './ImageUpload.js'
import {Link} from 'react-router-dom'
import { AuthProvider } from "../contexts/AuthContext.js";
import {Button} from 'react-native'

export default function PostPage(props) {
    //despite referring to post, this post page only takes in and loads one post, for consistency, this page is kept mostly the same as homepage
    const [posts, setPosts] = useState([]);
    //const authUser = auth.currentUser;
    const [user, setUser] = useState(null);
    const [likes, setLikes] = useState(false);
    const [uid, setUid] = useState();

    let fs = firebase.firestore();

    useEffect(() => {
        // main routine to get posts from ourselves and people we follow
         async function fetchData() {
            firebase.auth().onAuthStateChanged( function (user) {
                if (user != null) {
                    setUid(user.uid); 
                    setUser(user);
                    // retrieve posts from people we follow
                        fs.collection("posts").doc(props.match.params.postId).get().then((doc) => {
                            let p = [];

                                //if(followingUsers.includes((String(doc.data().uid)))){
                                let tempPost = doc.data();
                                if (tempPost.likes.includes(user.uid)) {
                                    setLikes(true);
                                }
                                else {
                                    setLikes(false);
                                }
                                tempPost["postId"] = doc.id;
                                p.push(tempPost);//}
                            setPosts(p);
                        });
                }
            });
         }

        fetchData();
    }, []);

    const likePost = (postId) => {
        if (likes) {
            fs.collection("posts").doc(postId).update({
                likes: firebase.firestore.FieldValue.arrayRemove(user.uid)
            });
            setLikes(false);
        }

        else {
            fs.collection("posts").doc(postId).update({
                likes: firebase.firestore.FieldValue.arrayUnion(user.uid)
            });
            setLikes(true);
        }
    }

    /*const commentPost = (comment, postId) => {
        fs.collection("posts").doc(postId).update({
            comments: firebase.firestore.FieldValue.arrayUnion({uid: user.uid, content: comment})
        });
    }*/

    const commentPost = (comment, postId) => {
        fs.collection("posts").doc(postId).collection("comments").add({
            text:comment,
            username: user.displayName
        })
    }

    const orderPosts = (posts) => {

    }

    let displayPost = [];

    posts.forEach((p, id) => {
        displayPost.push(<Post key = {id} postId={p.postId} timestamp={p.timestamp} likes={p.likes} likedStatus = {likes} onLike = {likePost} onComment = {commentPost} user={user} caption = {p.caption} image = {p.imageUrl} />);
    });
    /*displayPost.sort(function(y, x){
        return x.timestamp - y.timestamp;
    })*/
    console.log(user);

    return (
        <div className="home">
          
            <div className = "home__header">
              <img
                className = "home__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt=""
              />
            </div>
            {user?.displayName ? (<div> {user.displayName} </div>):<div> No name </div>}
            {user ? (<button onClick={() => auth.signOut()}>Logout</button>) : <div/>}
            {displayPost}
    
        </div>
      );
    }
    

    


    
