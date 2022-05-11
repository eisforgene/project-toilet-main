import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation loginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADDREVIEW = gql`
  mutation addReview($overallRating: String!, $coordinates: String!, $genderNeutral: String!, $cleanliness: String!, $changingTable: String!, $handicapAccessible: String!, $toiletPaper: String!, $keys: String!, $comment: String!) {
    addReview(overallRating: $overallRating, coordinates: $coordinates, genderNeutral: $genderNeutral, cleanliness: $cleanliness, changingTable: $changingTable, handicapAccessible: $handicapAccessible, toiletPaper: $toiletPaper, keys: $keys, comment: $comment) {
      _id
      username
      coordinates
    }
  }
`

export const ADD_TOILET = gql`
  mutation createNewToilet($coordinates: String!, $address: String!, $zipcode: String!, $lng: String!, $lat: String!, $overallRating: String!, $genderNeutral: String!, $cleanliness: String!, $changingTable: String!, $handicapAccessible: String!, $toiletPaper: String!, $keys: String!, $comment: String!) {
    createNewToilet(coordinates: $coordinates, address: $address, zipcode: $zipcode, lng: $lng, lat: $lat, overallRating: $overallRating, genderNeutral: $genderNeutral, cleanliness: $cleanliness, changingTable: $changingTable, handicapAccessible: $handicapAccessible, toiletPaper: $toiletPaper, keys: $keys, comment: $comment) {
      address
      zipcode
      reviews {
        username
      }
    }
  }
`

export const ADD_USER = gql`
  mutation addUser($firstName: String!, $lastName: String!, $username: String!, $email: String!, $password: String!) {
    addUser(firstName: $firstName, lastName: $lastName, username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;