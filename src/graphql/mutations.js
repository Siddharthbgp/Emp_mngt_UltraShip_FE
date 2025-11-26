import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        role
        email
        fullName
      }
    }
  }
`;

export const ADD_EMPLOYEE_MUTATION = gql`
  mutation AddEmployee($input: EmployeeInput!) {
    addEmployee(input: $input) {
      id
      name
      age
      department
      subjects
      attendance
      email
      phone
      address
      joiningDate
      salary
      position
      status
    }
  }
`;

export const UPDATE_EMPLOYEE_MUTATION = gql`
  mutation UpdateEmployee($id: ID!, $input: EmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      name
      age
      department
      subjects
      attendance
      email
      phone
      address
      joiningDate
      salary
      position
      status
    }
  }
`;

export const DELETE_EMPLOYEE_MUTATION = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;
