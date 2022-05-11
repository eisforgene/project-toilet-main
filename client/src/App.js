import React, { useState } from "react";
import { setContext } from '@apollo/client/link/context';
import "./App.css";
import Navbar from "./template/Navbar";
import Landing from "./template/Landing";
// import Sample from "./template/Sample";
import Footer from "./template/Footer";
import Signup from "./template/Signup";
import Login from "./template/Login";
import ReviewForm from "./template/Form";
import Map from './template/Map'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import Home from "./template/Home"
import DisplayReview from "./template/allReviews";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import SpecificReviews from "./template/SpecificReviews";
import AddToilet from "./template/AddToilet";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log('graphQLErrors', graphQLErrors);
  }
  if (networkError) {
    console.log('networkError', networkError)
  }
})

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const link = ApolloLink.from([errorLink, httpLink])


const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

// const Home = () => {
//   <div className="App">
//     <Navbar />
//     <Landing />
//     <Sample />
//     <Footer />
//   </div>;
// };

function App() {

  const [zipcode, setZipcode] = useState('90027')
  const [selected, setSelected] = useState(null)

  return (
    <ApolloProvider client={client}>
      <Router>
      <div className="page-container">
      <div className="content-wrap">
        <Navbar />

        <Switch>
          <Route exact path="/" >
            <Landing  />
            <Map zipcode={zipcode} setZipcode={setZipcode} selected={selected} setSelected={setSelected}/>
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path ="/allReviews">
              <DisplayReview></DisplayReview>
            </Route>
            <Route exact path ="/specificReviews">
              <SpecificReviews selected={selected}/>
            </Route>
          <Route exact path="/add">
            <ReviewForm selected={selected} />
          </Route>
          <Route exact path="/addToilet">
            <AddToilet zicpode={zipcode} setZipcode={setZipcode} />
          </Route>
          <Route path="*" component={Home} />
        </Switch>
        </div>
        {/* <Sample /> */}
        <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
