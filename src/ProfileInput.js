import React, { useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
input FormControl from 'react-bootstrap/FormControl';


export default function ProfileInput() {
    const [input, setInput] = useState("");

    return (
        <Form.Label htmlFor="basic-url">{props.label}</Form.Label>
        <InputGroup className="mb-3">
            <FormControl
                placeholder={props.placeholder}
                aria-label={props.label}
                aria-describedby="basic-addon1"
            />
        </InputGroup> 
    )
    
}
