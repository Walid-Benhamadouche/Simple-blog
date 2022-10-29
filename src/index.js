import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './routes/App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, ApolloLink } from '@apollo/client'
import { createUploadLink } from "apollo-upload-client"
import {
  BrowserRouter as Router,
} from "react-router-dom"

const token = localStorage.getItem('user');
const link = createUploadLink({
  uri: 'http://localhost:4000/graphql/',
  headers: {
    authorization: token,
  },
  credentials: 'same-origin'
});

const client = new ApolloClient({
  link,
  cors: {
    origin: "http://localhost:4000/graphql/"
  },
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client} >
    <Router>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Router>
  </ApolloProvider>
);
reportWebVitals();
