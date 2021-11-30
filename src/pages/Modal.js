import React, {useState} from 'react';
import '../styles/profile.css'

// react bootstrap imports
import Modal from 'react-bootstrap/Modal';

export default function UserModal({users, handleClose, status}) {
    const displayUsers = users.map((u) => <a href={u}><h3>{u}</h3><br></br></a>);

    return (
        <Modal show = {status} onHide={handleClose} scrollable={true}>
        <div class="back">
        <Modal.Dialog>
            <Modal.Header class="closer" closeButton>
                <Modal.Title class="display">Followers/Following</Modal.Title>
            </Modal.Header>

        <Modal.Body>
            {displayUsers}
        </Modal.Body>

        </Modal.Dialog>
        </div>
        </Modal>
    )
}
