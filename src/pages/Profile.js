import React, { useState, useEffect } from 'react';
import ProfileInput from './ProfileInput.js';
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

const DEFAULT_PICTURE = "https://firebasestorage.googleapis.com/v0/b/lproject-1bc54.appspot.com/o/images%2Fprofile_pictures%2Fdefault_picture.png?alt=media&token=71541b82-6264-46e8-b3c0-4e4c038a61ba"

const DATA_FIELDS = ["mile", "squat", "bench", "deadlift", "ohp", "steps"];
const MAP_NAME = "userData";

export default function Profile() {
    const [uid, setUid] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [userData, setUserData] = useState({});

    let storage = firebase.storage();
    let fs = firebase.firestore();

    useEffect(() => {
        async function fetchData() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user != null) {
                setUid(user.uid);
                
                storage.ref("images").child("profile_pictures").child(user.uid).getDownloadURL().then(url => {
                    setImgUrl(url); 
                }).catch(error => {
                    // if there doesn't exist such a file then user doens't have profile picture yet
                    setImgUrl(DEFAULT_PICTURE);
                });

                console.log(user.uid);
                // get some userdata 
                fs.collection("users").where("userData.uid", "==", user.uid).get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        let data = {"uid": user.uid};
                        DATA_FIELDS.forEach(function (field) {
                            data[field] = doc.get(MAP_NAME + '.' + field);                            
                        });
                        setUserData(data);
                        console.log(userData);
                    });
                })

                }
            });
        }

        fetchData();
    }, []);
    
    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
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

    const inputChange = (event, targetField) => {
        event.preventDefault();

        let clonedObject = {...userData};
        clonedObject[targetField] = event.target.value;
        setUserData(clonedObject);
    }

    const onSave = (event) => {
        event.preventDefault();

        const users = fs.collection("users");
        users.where("userData.uid", "==", uid).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                users.doc(doc.id).set({ userData });
            });
        })
    }

    return (
	    <div class = "container">
            <Form>
            <div class="profile-image">
            <OverlayTrigger placement="top" delay={{ show: 150, hide: 100 }} overlay={<Tooltip id="button-tooltip-2">Click here to change your picture!</Tooltip>}>
                <Button variant = "" onClick = {handleClick}><img class="resize" src={imgUrl}/></Button>
			</OverlayTrigger>

			</div>
            <h1 class="profile-user-name">username</h1>
            <div class="profile-stats">
				<ul>
					<li><span class="profile-stat-count">0</span> posts</li>
					<li><span class="profile-stat-count">0</span> followers</li>
					<li><span class="profile-stat-count">0</span> following</li>
				</ul>
			</div>
    
            <div class = "in">
                <input type="file" ref={hiddenFileInput} onChange={handleImageChange} style={{display: 'none'}}/>
                        <ProfileInput label="Mile time" placeholder="8:00" field="mile" val={userData.mile} onChange ={inputChange} />
                        <ProfileInput label="Squat" placeholder="135" field="squat" val={userData.squat} onChange = {inputChange} />
                        <ProfileInput label="Bench Press" placeholder="135" field="bench" val={userData.bench} onChange = {inputChange} />
                        <ProfileInput label="Deadlift" placeholder="135" field="deadlift" val={userData.deadlift} onChange = {inputChange} />
                        <ProfileInput label="Overhead Press" placeholder="135" field="ohp" val={userData.ohp} onChange = {inputChange} />
                        <ProfileInput label="Steps per day" placeholder="10000" field="steps" val={userData.steps} onChange = {inputChange} />
                        <Button class = "button" type="submit" onClick = {onSave}>Save</Button>
            </div>
            </Form>
                <div class="gallery">
                    <div class="gallery-item" tabindex="0">
                        <img src="https://picsum.photos/500" class="gallery-image" alt=""></img>
                        <div class="gallery-item-info">
                            <ul>
                                <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i>0</li>
                                <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i>0</li>
                            </ul>
                        </div>
                    </div>

                    <div class="gallery-item" tabindex="0">
                        <img src="https://picsum.photos/500" class="gallery-image" alt=""></img>
                        <div class="gallery-item-info">
                            <ul>
                                <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i>0</li>
                                <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i>0</li>
                            </ul>
                        </div>
                    </div>
                    <div class="gallery-item" tabindex="0">
                        <img src="https://picsum.photos/500" class="gallery-image" alt=""></img>
                        <div class="gallery-item-info">
                            <ul>
                                <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i>0</li>
                                <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i>0</li>
                            </ul>
                        </div>
                    </div>
                </div>
	    </div>
	);
}

