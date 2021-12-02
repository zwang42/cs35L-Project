import '../styles/homepage.css';
import React, {useState, useEffect} from 'react';
import Post from '../Post.js'
import NavBar from './NavBar.js'

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import {storage, db, auth} from "../firebase.js"

import ImageUpload from './ImageUpload.js'
import {Link} from 'react-router-dom'
import { AuthProvider } from "../contexts/AuthContext.js";
import {Button} from 'react-native'

export default function Homepage(curr) {
    const [posts, setPosts] = useState([]);
    //const authUser = auth.currentUser;
    const [user, setUser] = useState(null);
    const [likes, setLikes] = useState({});
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
                    fs.collection("following").doc(user.uid).get().then((doc) => {
                        let followingUsers = doc.data().following;
                        followingUsers.push(user.uid);
                        fs.collectionGroup("posts").where("uid", 'in', followingUsers).get().then((snapshot) => {
                            let p = [];
                            let likesObj = {};

                            snapshot.forEach((doc) => {
                                //if(followingUsers.includes((String(doc.data().uid)))){
                                let tempPost = doc.data();
                                if (tempPost.likes.includes(user.uid)) {
                                    likesObj[doc.id] = true;
                                }

                                else {
                                    likesObj[doc.id] = false;
                                }
                                tempPost["postId"] = doc.id;
                                p.push(tempPost);//}
                            });
                            setPosts(p);
                            setLikes(likesObj);
                        });
                    });
                }
            });
         }

        fetchData();
    }, []);

    const likePost = (postId) => {
        let clonedLikes = {...likes};
        if (clonedLikes[postId]) {
            fs.collection("posts").doc(postId).update({
                likes: firebase.firestore.FieldValue.arrayRemove(user.uid)
            });
            clonedLikes[postId] = false;
        }

        else {
            fs.collection("posts").doc(postId).update({
                likes: firebase.firestore.FieldValue.arrayUnion(user.uid)
            });
            clonedLikes[postId] = true;
        }
        setLikes(clonedLikes);
    }

    /*const commentPost = (comment, postId) => {
        fs.collection("posts").doc(postId).update({
            comments: firebase.firestore.FieldValue.arrayUnion({uid: user.uid, content: comment})
        });
    }*/

    const commentPost = (comment, postId) => {
        fs.collection("posts").doc(postId).collection("comments").add({
            text:comment,
            username: user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
    }

    const orderPosts = (posts) => {

    }

    let displayPost = [];

    posts.forEach((p, id) => {
        displayPost.push(<Post key = {id} postId={p.postId} timestamp={p.timestamp} likes={p.likes} likedStatus = {likes[p.postId]} onLike = {likePost} onComment = {commentPost} user={user} caption = {p.caption} image = {p.imageUrl} />);
    });
    /*displayPost.sort(function(y, x){
        return x.timestamp - y.timestamp;
    })*/
    console.log(user);

    return (
        <div className="home">
            <NavBar user={user}></NavBar>
            {user && <ImageUpload username={user.displayName}/>}
            {displayPost}
        </div>
      );
    }
    

    


    
