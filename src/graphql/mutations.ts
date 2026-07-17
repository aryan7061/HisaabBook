import gql from "graphql-tag";

// Mutation to register a new user
export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
    register(registerInput: { email: $email, password: $password }) {
      id
      email
    }
  }
`;

// Mutation to log in a user by email
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      accessToken
    }
  }
`;

// Mutation to update user
export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($input: UpdateOneUserInput!) {
    updateOneUser(input: $input) {
      id
      name
      avatarUrl
      email
      phone
      jobTitle
      timezone
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateOneUserInput!) {
    createOneUser(input: $input) {
      id
      name
      avatarUrl
    }
  }
`;

// Mutation to create company
export const CREATE_COMPANY_MUTATION = gql`
  mutation CreateCompany($input: CreateOneCompanyInput!) {
    createOneCompany(input: $input) {
      id
      salesOwner {
        id
      }
    }
  }
`;

// Mutation to update company details
export const UPDATE_COMPANY_MUTATION = gql`
  mutation UpdateCompany($input: UpdateOneCompanyInput!) {
    updateOneCompany(input: $input) {
      id
      name
      totalRevenue
      companySize
      businessType
      country
      website
      avatarUrl
      salesOwner {
        id
        name
        avatarUrl
      }
    }
  }
`;

// Mutation to update task stage of a task
export const UPDATE_TASK_STAGE_MUTATION = gql`
  mutation UpdateTaskStage($input: UpdateOneTaskInput!) {
    updateOneTask(input: $input) {
      id
    }
  }
`;

// Mutation to create a new task
export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($input: CreateOneTaskInput!) {
    createOneTask(input: $input) {
      id
      title
      stage {
        id
        title
      }
    }
  }
`;

// Mutation to update a task details
export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($input: UpdateOneTaskInput!) {
    updateOneTask(input: $input) {
      id
      title
      completed
      description
      dueDate
      stage {
        id
        title
      }
      users {
        id
        name
        avatarUrl
      }
      contacts {
        id
        name
        avatarUrl
      }
      checklist {
        title
        checked
      }
    }
  }
`;

// Mutation to create a new contact
export const CREATE_CONTACT_MUTATION = gql`
  mutation CreateContact($input: CreateOneContactInput!) {
    createOneContact(input: $input) {
      id
      name
      email
      phone
      jobTitle
      companyName
      status
      avatarUrl
      salesOwner {
        id
        name
        avatarUrl
      }
    }
  }
`;

// Mutation to update an existing contact
export const UPDATE_CONTACT_MUTATION = gql`
  mutation UpdateContact($input: UpdateOneContactInput!) {
    updateOneContact(input: $input) {
      id
      name
      email
      phone
      jobTitle
      companyName
      status
      avatarUrl
      salesOwner {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const CREATE_DEAL_MUTATION = gql`
  mutation CreateDeal($input: CreateOneDealInput!) {
    createOneDeal(input: $input) {
      id
      title
      stage {
        id
        title
      }
    }
  }
`;

export const UPDATE_DEAL_MUTATION = gql`
  mutation UpdateDeal($input: UpdateOneDealInput!) {
    updateOneDeal(input: $input) {
      id
      title
      value
      closeDate
      stage {
        id
        title
      }
      company {
        id
        name
        avatarUrl
      }
      dealOwner {
        id
        name
        avatarUrl
      }
      dealContact {
        id
        name
      }
    }
  }
`;

export const UPDATE_DEAL_STAGE_MUTATION = gql`
  mutation UpdateDealStage($input: UpdateOneDealInput!) {
    updateOneDeal(input: $input) {
      id
    }
  }
`;
