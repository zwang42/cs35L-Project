import React, { useState, useEffect } from 'react';
import ProfileInput from './ProfileInput.js';

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

export default function Profile(props) {
    const [uid, setUid] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [userData, setUserData] = useState({});
    const [isUser, setIsUser] = useState(false);

    let storage = firebase.storage();
    let fs = firebase.firestore();
    let targetUid = props.match.params.userId;

    console.log(targetUid);

    useEffect(() => {
        async function fetchData() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user != null) {
                setUid(user.uid);
                setIsUser(targetUid == uid ? true : false);
                console.log(isUser); 
                storage.ref("images").child("profile_pictures").child(targetUid).getDownloadURL().then(url => {
                    setImgUrl(url); 
                }).catch(error => {
                    // if there doesn't exist such a file then user doens't have profile picture yet
                    setImgUrl(DEFAULT_PICTURE);
                });

                // get some userdata 
                fs.collection("users").where("userData.uid", "==", targetUid).get().then(function (querySnapshot) {
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
	    <Container className="d-flex justify-content-center align-items-center min-vh-100">
	        <div className="w-75 h-80">
		    <h3 className="text-center py-3">Profile</h3>
                    <Form>
		    <div className="d-flex justify-content-center">
		    <OverlayTrigger
			placement="top"
			delay={{ show: 250, hide: 400 }}
			overlay={<Tooltip id="button-tooltip-2">Click here to change your picture!</Tooltip>}
		    >
		        <Button variant = "" onClick = {handleClick}><Image className="w-50 h-50" src={imgUrl}/></Button>
		    </OverlayTrigger>
		    <input
			type="file"
			ref={hiddenFileInput}
                        onChange={handleImageChange}
			style={{display: 'none'}}
		    />

                    <ProfileInput label="Mile time" placeholder="8:00" field="mile" val={userData.mile} onChange ={inputChange} readOnly = {isUser} />
                    <ProfileInput label="Squat" placeholder="135" field="squat" val={userData.squat} onChange = {inputChange} readOnly={isUser} />
                    <ProfileInput label="Bench Press" placeholder="135" field="bench" val={userData.bench} onChange = {inputChange} readOnly={isUser} />
                    <ProfileInput label="Deadlift" placeholder="135" field="deadlift" val={userData.deadlift} onChange = {inputChange} readOnly={isUser} />
                    <ProfileInput label="Overhead Press" placeholder="135" field="ohp" val={userData.ohp} onChange = {inputChange} readOnly={isUser} />
                    <ProfileInput label="Steps per day" placeholder="10000" field="steps" val={userData.steps} onChange = {inputChange} readOnly={isUser}/>

                    {isUser && 
                    <Button variant="primary" type="submit" onClick = {onSave} >
                        Save
                    </Button>
                    }
		    </div>
			</Form>
	        </div>
	    </Container>
	);
}
