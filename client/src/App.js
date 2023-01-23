import React from 'react';
//importing various dependencies
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloProvider, 
  createHttpLink 
  } 
from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

//importing various components
import Home from './pages/Home';
import Detail from './pages/Detail';
import NoMatch from './pages/NoMatch';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Nav from './components/Nav';
import { StoreProvider } from './utils/GlobalState';
import Success from './pages/Success';
import OrderHistory from './pages/OrderHistory';

//creates an ApolloClient instance which is used to send requests to a GraphQL server
const httpLink = createHttpLink({ 
  uri: '/graphql',// used to define the endpoint of the GraphQL server
});

//used to attach an authorization token to the GraphQL request if one is present in localStorage
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

//sets up a new ApolloClient object with an authentication link and a HTTP link, as well as a new InMemoryCache object.
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() { //setting up routes for the application
  return (
    <ApolloProvider client={client}>
    <Router>
      <div>
        <StoreProvider>
          <Nav />
          <Routes>
            <Route 
              path="/" 
              element={<Home />} 
            />
            <Route 
              path="/login" 
              element={<Login />} 
            />
            <Route 
              path="/signup" 
              element={<Signup />} 
            />
            <Route 
              path="/success" 
              element={<Success />} 
            />
            <Route 
              path="/orderHistory" 
              element={<OrderHistory />} 
            />
            <Route 
              path="/products/:id" 
              element={<Detail />} 
            />
            <Route 
              path="*" 
              element={<NoMatch />} 
            />
          </Routes>
        </StoreProvider>
      </div>
    </Router>
  </ApolloProvider>
  );
}

export default App;
