import React, { useState, useEffect } from 'react'
import { db, auth } from "../firebase.js"
import { Navbar, Nav, Container } from 'react-bootstrap'
import Select from 'react-select'
import { useHistory } from 'react-router-dom'
import '../styles/home.css'

export default function NavBar(props) {
  const [selectedSearch, setSearch] = useState(null);
  const [userList, setUserList] = useState([]);
  const history = useHistory();
  const handleChange = (selectedSearch) => {
    setSearch(selectedSearch);
    let page = '/profile/' + selectedSearch.id;
    //console.log(page);
    history.push(page);
  }

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  useEffect(() => {
    db.collection("users").onSnapshot(snapshot => {
      setUserList(snapshot.docs.map(doc => ({
        username: doc.data().username,
        id: doc.id
      })));
    })
    console.log(userList);
  }, []);

  return (
    <div class="navi">
    <Navbar sticky="top">
      <Container>
      <Navbar.Brand href='/homepage'>
        <img
          src="https://images.unsplash.com/photo-1580136607993-fd598cf5c4f5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1680&q=80"
          alt=""
        />
      </Navbar.Brand>
      <Nav className="ms-auto">
        <Select
          value={selectedSearch}
          options={userList}
          onChange={handleChange}
          placeholder="Search for users" />
      </Nav>
      {props.user ? (
        <Nav className="ms-auto">
          <Navbar.Text>
            {props.user.displayName ? <div> {props.user.displayName} </div> : <div> No name </div>}
          </Navbar.Text>
          <Nav.Link href={'/profile/' + props.user.uid}>Profile</Nav.Link>
          <Navbar.Text onClick={() => auth.signOut()}>Signout</Navbar.Text>
          
        </Nav>
      ): (
        <Nav>
          <Nav.Link href='/login'>Login</Nav.Link>
        </Nav>
      )}
      </Container>
    </Navbar>
    </div>
  )
}
