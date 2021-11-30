import React, { useRef, useState } from 'react';
import firebase from 'firebase/app';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import '../styles/login.css';

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Password and Confirmed Password do not match!");
        }

        try {
            setError("");
            setLoading(true);

            await signup(emailRef.current.value, passwordRef.current.value).then(function(user) {
				const id = user.user.uid;
				const account = {
					uid: id,
					bio: "",
                                        mile: "",
                                        squat: "",
                                        bench: "",
                                        deadlift: "",
                                        ohp: "",
                                        steps: ""
				}
			
				const fs = firebase.firestore();
				fs.collection("users").doc(id).set(account);
                fs.collection("following").doc(id).set({followers: [], followers: []});
			});
            history.push("/profile");
        } catch {
			
            setError("Failed to create an account!");
        }

        setLoading(false);
    }

    return (
        <div>
            <div class="background">
                <div class="topshape"></div>
                <div class="topshape"></div>
            </div>
            <img class="login" src= "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2231&q=80"></img>
            <img class="login1" src= "https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"></img>
            <img class="login2" src= "https://images.unsplash.com/photo-1530021356476-0a6375ffe73b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80"></img>    
            {error && <Alert variant = "danger">{error}</Alert>}
            <form onSubmit = {handleSubmit}>
                <h1>FitnessGram Sign Up</h1>
                <Form.Group id = "email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type = "email" ref = {emailRef} required></Form.Control>
                </Form.Group>

                <Form.Group id = "password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type = "password" ref = {passwordRef} required></Form.Control>
                </Form.Group>

                <Form.Group id = "password-confirm">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type = "password" ref = {passwordConfirmRef} required></Form.Control>
                </Form.Group>

                <button class="action" disabled = {loading} type = "submit">Sign Up</button>
                <div className = "log">
                    Already have an account? <Link to ="login">Log In</Link> 
                </div>
            </form>
        </div>
    )
}
