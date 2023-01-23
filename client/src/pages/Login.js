import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';
import { Form, Button, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

function Login(props) {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await login({
        variables: { email: formState.email, password: formState.password },
      });
      const token = mutationResponse.data.login.token;
      Auth.login(token);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h2' color='orange' textAlign='center'>
        <Image src='../../images/looseLeafLogo.jpg' /> Log-in to your account
      </Header>
      <Form size='large' onSubmit={handleFormSubmit}>
        <Segment stacked>
          <Form.Input 
            placeholder="youremail@test.com"
            label="Email address"
            name="email"
            type="email"
            id="email" 
            fluid 
            icon='user' 
            iconPosition='left' 
            onChange={handleChange}
          />
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            placeholder="******"
            label="Password"
            name="password"
            type="password"
            id="pwd"
            onChange={handleChange}
          />
          {error ? (
            <div>
              <p className="error-text">The provided credentials are incorrect</p>
            </div>
          ) : null}
          <Button color='orange' fluid size='large'>
            Submit
          </Button>
        </Segment>
      </Form>
      <Message>
        New to us? <Link to='/signup'>Sign Up</Link>
      </Message>
    </Grid.Column>
  </Grid>
  );
}

export default Login;