import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { ADD_USER } from '../utils/mutations';
import { Form, Input, Button, Grid, Header, Image, Message, Segment  } from 'semantic-ui-react'

const Signup = (props) => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [addUser] = useMutation(ADD_USER);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const mutationResponse = await addUser({
      variables: {
        email: formState.email,
        password: formState.password,
        firstName: formState.firstName,
        lastName: formState.lastName,
      },
    });
    const token = mutationResponse.data.addUser.token;
    Auth.login(token);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Link to="/login">← Go to Login</Link>

        <Header as="h2" color="orange" textAlign="center">
          <Image src="../../images/looseLeafLogo.jpg" /> Signup
        </Header>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group widths="equal">
            <Form.Field>
              <label>First Name</label>
              <Input
                placeholder="First"
                name="firstName"
                type="firstName"
                id="firstName"
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <Input
                placeholder="Last"
                name="lastName"
                type="lastName"
                id="lastName"
                onChange={handleChange}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <label>Email</label>
            <Input
              placeholder="youremail@test.com"
              name="email"
              type="email"
              id="email"
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <Input
              placeholder="******"
              name="password"
              type="password"
              id="pwd"
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Button type="submit">Submit</Button>
          </Form.Field>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default Signup;