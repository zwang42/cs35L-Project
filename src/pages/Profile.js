import React, { useState, useEffect } from 'react';
import ProfileInput from './ProfileInput.js';
import UserModal from './Modal.js';
import NavBar from './NavBar.js'
import '../styles/profile.css'

// firebase imports
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

// react bootstrap imports
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';

const DEFAULT_PICTURE = "https://firebasestorage.googleapis.com/v0/b/lproject-1bc54.appspot.com/o/images%2Fprofile_pictures%2Fdefault_picture.png?alt=media&token=71541b82-6264-46e8-b3c0-4e4c038a61ba"

const DATA_FIELDS = ["mile", "squat", "bench", "deadlift", "ohp", "steps"];
const MAP_NAME = "userData";

export default function Profile(props) {
    const [uid, setUid] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [userData, setUserData] = useState({});
    const [isUser, setIsUser] = useState(false);
    const [isFollowing, setFollowing] = useState(false);
    const [numFollowing, setNumFollowing] = useState(null);
    const [numFollowers, setNumFollowers] = useState(null);
    const [users, setUsers] = useState([]);
    const [modalStatus, setModalStatus] = useState(false);
    const [user, setUser] = useState(null);

    let storage = firebase.storage();
    let fs = firebase.firestore();
    let targetUid = props.match.params.userId;


    useEffect(() => {
        async function fetchData() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user != null) {
                setUid(user.uid);
                setUser(user);
                setIsUser(targetUid == user.uid ? true : false);

                // check if we are currently following the profile that we are on
                fs.collection("following").doc(user.uid).get().then(doc => {
                    let followingUsers = doc.data().following;
                    setFollowing(followingUsers.includes(targetUid) ? true : false);
                });

                fs.collection("following").doc(targetUid).get().then(doc => {
                    let followingUsers = doc.data().following;
                    let followers = doc.data().followers;
                    setNumFollowing(followingUsers.length);
                    setNumFollowers(followers.length);
                });

                storage.ref("images").child("profile_pictures").child(targetUid).getDownloadURL().then(url => {
                    setImgUrl(url); 
                }).catch(error => {
                    // if there doesn't exist such a file then user doens't have profile picture yet
                    setImgUrl(DEFAULT_PICTURE);
                });

                // get some userdata 
                fs.collection("users").doc(targetUid).get().then(doc => {
                    let data = {"uid": targetUid, "username": doc.get("username")};
                    DATA_FIELDS.forEach(function (field) {
                        data[field] = doc.data()[field];
                        if (!data[field]) {
                            data[field] = "";
                        }
                    });
                    setUserData(data);
                });

                }
            });
        }

        fetchData();
        console.log("new page loaded");
    }, []);
    
    // BEGIN FILE UPLOAD FUNCTIONS
    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
        if (!isUser)
            return;
        hiddenFileInput.current.click();
    };

    // on selection of image from the user
    const handleImageChange = (event) => {
        if (event.target.files[0]) {
	    const image = event.target.files[0];
			
	    const upload = storage.ref(`images/profile_pictures/${uid}`).put(image);
	    upload.on("state_changed",
	    (snapShot) => {
	        console.log(snapShot);
	    }, (err) => {
		console.log(err);
	    }, () => {
		storage.ref("images").child("profile_pictures").child(`${uid}`).getDownloadURL()
                .then(url => {
		    setImgUrl(url);
		})
            })
	}
    }
    // END FILE UPLOAD FUNCTIONS
    
    
    // Handle changing the input boxes
    const inputChange = (event, targetField) => {
        event.preventDefault();

        let clonedObject = {...userData};
        clonedObject[targetField] = event.target.value;
        setUserData(clonedObject);
    }

    // Save the input data to firebase
    const onSave = (event) => {
        event.preventDefault();
        fs.collection("users").doc(uid).update(userData);
    }

    // follow or unfollow a user
    const changeFollow = (event) => {
        event.preventDefault();

        // if we are following then unfollow
        if (isFollowing) {
            fs.collection("following").doc(uid).update({
                following: firebase.firestore.FieldValue.arrayRemove(targetUid) 
            });
            fs.collection("following").doc(targetUid).update({
                followers: firebase.firestore.FieldValue.arrayRemove(uid)
            });

            setNumFollowers(numFollowers-1);
        }

        // if we are not then following them
        else {
            fs.collection("following").doc(uid).update({
                following: firebase.firestore.FieldValue.arrayUnion(targetUid)
            });
            
            fs.collection("following").doc(targetUid).update({
                followers: firebase.firestore.FieldValue.arrayUnion(uid)
            });
            setNumFollowers(numFollowers+1);
        }
        setFollowing(!isFollowing);
    }

    const getFollowing = () => {
        fs.collection("following").doc(targetUid).get().then(doc => {
            let followingUsers = doc.data().following;
            setUsers(followingUsers);
            setModalStatus(true);
        });
    }

    const getFollowers = () => {
        fs.collection("following").doc(targetUid).get().then(doc => {
            let followerUsers = doc.data().followers;
            setUsers(followerUsers);
            setModalStatus(true);
        });
    }

    const disableModal = () => {
        setModalStatus(false);
    }

    return (
        <div class="container">
            <NavBar user={user}></NavBar>
            <div class = "portion">
            <div class="prof">
                <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">{isUser ? "Click here to change profile" : null}</Tooltip>}>
                    <Button variant = "" onClick = {handleClick}><img src={imgUrl}/></Button>
                </OverlayTrigger>
                {isUser && <input type={"file"} ref={hiddenFileInput} onChange={handleImageChange} style={{display: 'none'}}/>}
                    <div class="profile-stats">
                        <ul>
                            <div onClick = {getFollowers}>
                                <li><span class="profile-stat-count">{numFollowers}</span>Followers</li>
                            </div>
                            <div onClick = {getFollowing}>
                                <li><span class="profile-stat-count">{numFollowing}</span>Following</li>
                            </div>
                        </ul>
                    </div>
            </div>
                <Form>
                <h1>Profile</h1>
                <div class = "in">
                    <ProfileInput label="Mile time" placeholder="8:00" field="mile" val={userData.mile} onChange ={inputChange} readOnly = {isUser} />
                    <ProfileInput label="Squat" placeholder="135" field="squat" val={userData.squat} onChange = {inputChange} readOnly={isUser} />
                    <ProfileInput label="Bench Press" placeholder="135" field="bench" val={userData.bench} onChange = {inputChange} readOnly={isUser} />
                    <ProfileInput label="Deadlift" placeholder="135" field="deadlift" val={userData.deadlift} onChange = {inputChange} readOnly={isUser} />
                    <ProfileInput label="Overhead Press" placeholder="135" field="ohp" val={userData.ohp} onChange = {inputChange} readOnly={isUser} />
                    <ProfileInput label="Steps per day" placeholder="10000" field="steps" val={userData.steps} onChange = {inputChange} readOnly={isUser}/>
                </div>
                {isUser && 
                <button class = "alt" variant="primary" type="submit" onClick = {onSave}>Save</button>
                }
                {!isUser &&
                <button class="flw" variant="primary" onClick = {changeFollow}>
                    {isFollowing ? "Unfollow" : "Follow"}
                </button>
                }
                </Form>
                <UserModal users={users} handleClose={disableModal} status={modalStatus} />
            </div>
        </div>
	);
}
