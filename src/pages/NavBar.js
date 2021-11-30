import React, { useState, useEffect } from 'react'
import { db, auth } from "../firebase.js"
import { Navbar, Nav, Container } from 'react-bootstrap'
import Select from 'react-select'
import { useHistory } from 'react-router-dom'

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
    <Navbar sticky="top">
      <Container>
      <Navbar.Brand href='/homepage'>
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt=""
        />
      </Navbar.Brand>
      <Nav className="ms-auto">
        <Select
          value={selectedSearch}
          options={userList}
          onChange={handleChange}
          placeholder="Search..." />
      </Nav>
      {props.user ? (
        <Nav className="ms-auto">
          <Navbar.Text>
            {props.user.displayName ? <div> {props.user.displayName} </div> : <div> No name </div>}
          </Navbar.Text>
          <Nav.Link href='/profile/:userId'>Profile</Nav.Link>
          <Navbar.Text onClick={() => auth.signOut()}>Signout</Navbar.Text>
          
        </Nav>
      ): (
        <Nav>
          <Nav.Link href='/login'>Login</Nav.Link>
        </Nav>
      )}
      </Container>
    </Navbar>
  )
}