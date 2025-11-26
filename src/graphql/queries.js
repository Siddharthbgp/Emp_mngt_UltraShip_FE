import { gql } from '@apollo/client';

export const LIST_EMPLOYEES_QUERY = gql`
  query ListEmployees(
    $filter: EmployeeFilterInput
    $pagination: PaginationInput
    $sort: SortInput
  ) {
    listEmployees(filter: $filter, pagination: $pagination, sort: $sort) {
      content {
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
      totalElements
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_EMPLOYEE_QUERY = gql`
  query GetEmployee($id: ID!) {
    getEmployee(id: $id) {
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

export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      role
      email
      fullName
    }
  }
`;
