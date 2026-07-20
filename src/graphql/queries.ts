import gql from "graphql-tag";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      phone
      jobTitle
      timezone
      avatarUrl
    }
  }
`;

export const DASHBOARD_TOTAL_COUNTS_QUERY = gql`
  query DashboardTotalCounts(
    $companiesFilter: CompanyFilter!
    $contactsFilter: ContactFilter!
    $dealsFilter: DealFilter!
  ) {
    companies(filter: $companiesFilter) {
      totalCount
    }
    contacts(filter: $contactsFilter) {
      totalCount
    }
    deals(filter: $dealsFilter) {
      totalCount
    }
  }
`;

export const DASHBOARD_DEALS_CHART_QUERY = gql`
  query DashboardDealsChart(
    $filter: DealStageFilter!
    $sorting: [DealStageSort!]
    $paging: OffsetPaging
    $dealsAggregateFilter: DealAggregateFilter
  ) {
    dealStages(filter: $filter, sorting: $sorting, paging: $paging) {
      nodes {
        id
        title
        dealsAggregate(filter: $dealsAggregateFilter) {
          groupBy {
            closeDateMonth
            closeDateYear
          }
          sum {
            value
          }
        }
      }
      totalCount
    }
  }
`;

export const DASHBOARD_WIN_RATE_QUERY = gql`
  query DashboardWinRate(
    $filter: DealStageFilter!
    $dealsAggregateFilter: DealAggregateFilter
  ) {
    dealStages(filter: $filter) {
      nodes {
        id
        title
        dealsAggregate(filter: $dealsAggregateFilter) {
          count {
            id
          }
        }
      }
    }
  }
`;

export const DASHBOARD_TASKS_BY_STAGE_QUERY = gql`
  query DashboardTasksByStage($filter: TaskFilter!, $paging: OffsetPaging) {
    tasks(filter: $filter, paging: $paging) {
      totalCount
      nodes {
        id
        createdAt
        stage {
          title
        }
      }
    }
  }
`;

export const DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY = gql`
  query DashboardLatestActivitiesDeals(
    $filter: DealFilter!
    $sorting: [DealSort!]
    $paging: OffsetPaging
  ) {
    deals(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        title
        stage {
          id
          title
        }
        company {
          id
          name
          avatarUrl
        }
        createdAt
      }
    }
  }
`;

export const DASHBOARD_RECENT_ACTIVITY_QUERY = gql`
  query DashboardRecentActivity(
    $companiesFilter: CompanyFilter!
    $contactsFilter: ContactFilter!
    $dealsFilter: DealFilter!
    $tasksFilter: TaskFilter!
    $companiesSorting: [CompanySort!]
    $contactsSorting: [ContactSort!]
    $dealsSorting: [DealSort!]
    $tasksSorting: [TaskSort!]
    $paging: OffsetPaging
  ) {
    companies(
      filter: $companiesFilter
      sorting: $companiesSorting
      paging: $paging
    ) {
      nodes {
        id
        name
        createdAt
        updatedAt
      }
    }
    contacts(
      filter: $contactsFilter
      sorting: $contactsSorting
      paging: $paging
    ) {
      nodes {
        id
        name
        createdAt
        updatedAt
      }
    }
    deals(filter: $dealsFilter, sorting: $dealsSorting, paging: $paging) {
      nodes {
        id
        title
        createdAt
        updatedAt
      }
    }
    tasks(filter: $tasksFilter, sorting: $tasksSorting, paging: $paging) {
      nodes {
        id
        title
        createdAt
        updatedAt
      }
    }
  }
`;

export const COMPANIES_LIST_QUERY = gql`
  query CompaniesList(
    $filter: CompanyFilter!
    $sorting: [CompanySort!]
    $paging: OffsetPaging!
  ) {
    companies(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        name
        avatarUrl
        createdBy {
          id
        }
        dealsAggregate {
          sum {
            value
          }
        }
      }
    }
  }
`;

export const COMPANY_QUERY = gql`
  query Company($id: ID!) {
    company(id: $id) {
      id
      name
      avatarUrl
      companySize
      totalRevenue
      businessType
      country
      website
      salesOwner {
        id
      }
      createdBy {
        id
      }
    }
  }
`;

export const USERS_SELECT_QUERY = gql`
  query UsersSelect(
    $filter: UserFilter!
    $sorting: [UserSort!]
    $paging: OffsetPaging!
  ) {
    users(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const TEAM_MEMBERS_QUERY = gql`
  query TeamMembers(
    $filter: UserFilter!
    $sorting: [UserSort!]
    $paging: OffsetPaging!
  ) {
    users(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        name
        email
        phone
        role
        avatarUrl
      }
    }
  }
`;

export const CONTACTS_LIST_QUERY = gql`
  query ContactsList(
    $filter: ContactFilter!
    $sorting: [ContactSort!]
    $paging: OffsetPaging!
  ) {
    contacts(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        name
        avatarUrl
        companyName
        jobTitle
        email
        phone
        status
        createdBy {
          id
        }
        salesOwner {
          id
          name
          avatarUrl
        }
      }
    }
  }
`;

export const CONTACT_QUERY = gql`
  query Contact($id: ID!) {
    contact(id: $id) {
      id
      name
      email
      phone
      jobTitle
      companyName
      status
      score
      timezone
      avatarUrl
      salesOwner {
        id
      }
      createdBy {
        id
      }
    }
  }
`;

export const TASK_STAGES_QUERY = gql`
  query TaskStages(
    $filter: TaskStageFilter!
    $sorting: [TaskStageSort!]
    $paging: OffsetPaging!
  ) {
    taskStages(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        title
      }
    }
  }
`;

export const TASKS_QUERY = gql`
  query Tasks(
    $filter: TaskFilter!
    $sorting: [TaskSort!]
    $paging: OffsetPaging!
  ) {
    tasks(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        title
        description
        dueDate
        completed
        stageId
        users {
          id
          name
          avatarUrl
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const TASK_QUERY = gql`
  query Task($id: ID!) {
    task(id: $id) {
      id
      title
      completed
      description
      dueDate
      stageId
      createdBy {
        id
      }
      stage {
        id
        title
      }
      users {
        id
        name
        avatarUrl
        phone
        email
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

export const TASK_STAGES_SELECT_QUERY = gql`
  query TaskStagesSelect(
    $filter: TaskStageFilter!
    $sorting: [TaskStageSort!]
    $paging: OffsetPaging!
  ) {
    taskStages(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        title
      }
    }
  }
`;

export const DEAL_STAGES_QUERY = gql`
  query DealStages(
    $filter: DealStageFilter!
    $sorting: [DealStageSort!]
    $paging: OffsetPaging!
  ) {
    dealStages(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        title
      }
    }
  }
`;

export const DEAL_STAGES_SELECT_QUERY = gql`
  query DealStagesSelect(
    $filter: DealStageFilter!
    $sorting: [DealStageSort!]
    $paging: OffsetPaging!
  ) {
    dealStages(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        title
      }
    }
  }
`;

export const DEALS_QUERY = gql`
  query Deals(
    $filter: DealFilter!
    $sorting: [DealSort!]
    $paging: OffsetPaging!
  ) {
    deals(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        title
        value
        stageId
        company {
          id
          name
          avatarUrl
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const DEALS_LIST_QUERY = gql`
  query DealsList(
    $filter: DealFilter!
    $sorting: [DealSort!]
    $paging: OffsetPaging!
  ) {
    deals(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        title
        value
        closeDate
        stageId
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
        createdBy {
          id
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const DEAL_QUERY = gql`
  query Deal($id: ID!) {
    deal(id: $id) {
      id
      title
      value
      closeDate
      stageId
      companyId
      dealOwnerId
      dealContactId
      createdBy {
        id
      }
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

export const COMPANIES_SELECT_QUERY = gql`
  query CompaniesSelect(
    $filter: CompanyFilter!
    $sorting: [CompanySort!]
    $paging: OffsetPaging!
  ) {
    companies(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const CONTACTS_SELECT_QUERY = gql`
  query ContactsSelect(
    $filter: ContactFilter!
    $sorting: [ContactSort!]
    $paging: OffsetPaging!
  ) {
    contacts(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        name
        avatarUrl
      }
    }
  }
`;
