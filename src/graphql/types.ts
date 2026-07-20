import type * as Types from "./schema.types";

export type RegisterMutationVariables = Types.Exact<{
  email: Types.Scalars["String"]["input"];
  password: Types.Scalars["String"]["input"];
}>;

export type RegisterMutation = { register: Pick<Types.User, "id" | "email"> };

export type LoginMutationVariables = Types.Exact<{
  email: Types.Scalars["String"]["input"];
  password: Types.Scalars["String"]["input"];
}>;

export type LoginMutation = { login: Pick<Types.AuthResponse, "accessToken"> };

export type UpdateUserMutationVariables = Types.Exact<{
  input: Types.UpdateOneUserInput;
}>;

export type UpdateUserMutation = {
  updateOneUser: Pick<
    Types.User,
    "id" | "name" | "avatarUrl" | "email" | "phone" | "jobTitle" | "timezone"
  >;
};

export type CreateUserMutationVariables = Types.Exact<{
  input: Types.CreateOneUserInput;
}>;

export type CreateUserMutation = {
  createOneUser: Pick<Types.User, "id" | "name" | "avatarUrl">;
};

export type CreateCompanyMutationVariables = Types.Exact<{
  input: Types.CreateOneCompanyInput;
}>;

export type CreateCompanyMutation = {
  createOneCompany: Pick<Types.Company, "id"> & {
    salesOwner: Pick<Types.User, "id">;
  };
};

export type UpdateCompanyMutationVariables = Types.Exact<{
  input: Types.UpdateOneCompanyInput;
}>;

export type UpdateCompanyMutation = {
  updateOneCompany: Pick<
    Types.Company,
    | "id"
    | "name"
    | "totalRevenue"
    | "companySize"
    | "businessType"
    | "country"
    | "website"
    | "avatarUrl"
  > & { salesOwner: Pick<Types.User, "id" | "name" | "avatarUrl"> };
};

export type UpdateTaskStageMutationVariables = Types.Exact<{
  input: Types.UpdateOneTaskInput;
}>;

export type UpdateTaskStageMutation = { updateOneTask: Pick<Types.Task, "id"> };

export type CreateTaskMutationVariables = Types.Exact<{
  input: Types.CreateOneTaskInput;
}>;

export type CreateTaskMutation = {
  createOneTask: Pick<Types.Task, "id" | "title"> & {
    stage?: Types.Maybe<Pick<Types.TaskStage, "id" | "title">>;
  };
};

export type UpdateTaskMutationVariables = Types.Exact<{
  input: Types.UpdateOneTaskInput;
}>;

export type UpdateTaskMutation = {
  updateOneTask: Pick<
    Types.Task,
    "id" | "title" | "completed" | "description" | "dueDate"
  > & {
    stage?: Types.Maybe<Pick<Types.TaskStage, "id" | "title">>;
    users: Array<Pick<Types.User, "id" | "name" | "avatarUrl">>;
    contacts: Array<Pick<Types.Contact, "id" | "name" | "avatarUrl">>;
    checklist: Array<Pick<Types.CheckListItem, "title" | "checked">>;
  };
};

export type CreateContactMutationVariables = Types.Exact<{
  input: Types.CreateOneContactInput;
}>;

export type CreateContactMutation = {
  createOneContact: Pick<
    Types.Contact,
    | "id"
    | "name"
    | "email"
    | "phone"
    | "jobTitle"
    | "companyName"
    | "status"
    | "avatarUrl"
  > & { salesOwner: Pick<Types.User, "id" | "name" | "avatarUrl"> };
};

export type UpdateContactMutationVariables = Types.Exact<{
  input: Types.UpdateOneContactInput;
}>;

export type UpdateContactMutation = {
  updateOneContact: Pick<
    Types.Contact,
    | "id"
    | "name"
    | "email"
    | "phone"
    | "jobTitle"
    | "companyName"
    | "status"
    | "avatarUrl"
  > & { salesOwner: Pick<Types.User, "id" | "name" | "avatarUrl"> };
};

export type CreateDealMutationVariables = Types.Exact<{
  input: Types.CreateOneDealInput;
}>;

export type CreateDealMutation = {
  createOneDeal: Pick<Types.Deal, "id" | "title"> & {
    stage?: Types.Maybe<Pick<Types.DealStage, "id" | "title">>;
  };
};

export type UpdateDealMutationVariables = Types.Exact<{
  input: Types.UpdateOneDealInput;
}>;

export type UpdateDealMutation = {
  updateOneDeal: Pick<Types.Deal, "id" | "title" | "value" | "closeDate"> & {
    stage?: Types.Maybe<Pick<Types.DealStage, "id" | "title">>;
    company: Pick<Types.Company, "id" | "name" | "avatarUrl">;
    dealOwner: Pick<Types.User, "id" | "name" | "avatarUrl">;
    dealContact?: Types.Maybe<Pick<Types.Contact, "id" | "name">>;
  };
};

export type UpdateDealStageMutationVariables = Types.Exact<{
  input: Types.UpdateOneDealInput;
}>;

export type UpdateDealStageMutation = { updateOneDeal: Pick<Types.Deal, "id"> };

export type MeQueryVariables = Types.Exact<{ [key: string]: never }>;

export type MeQuery = {
  me: Pick<
    Types.User,
    "id" | "name" | "email" | "phone" | "jobTitle" | "timezone" | "avatarUrl"
  >;
};

export type DashboardTotalCountsQueryVariables = Types.Exact<{
  companiesFilter: Types.CompanyFilter;
  contactsFilter: Types.ContactFilter;
  dealsFilter: Types.DealFilter;
}>;

export type DashboardTotalCountsQuery = {
  companies: Pick<Types.CompanyConnection, "totalCount">;
  contacts: Pick<Types.ContactConnection, "totalCount">;
  deals: Pick<Types.DealConnection, "totalCount">;
};

export type DashboardDealsChartQueryVariables = Types.Exact<{
  filter: Types.DealStageFilter;
  sorting?: Types.InputMaybe<Array<Types.DealStageSort> | Types.DealStageSort>;
  paging?: Types.InputMaybe<Types.OffsetPaging>;
  dealsAggregateFilter?: Types.InputMaybe<Types.DealAggregateFilter>;
}>;

export type DashboardDealsChartQuery = {
  dealStages: Pick<Types.DealStageConnection, "totalCount"> & {
    nodes: Array<
      Pick<Types.DealStage, "id" | "title"> & {
        dealsAggregate: Array<{
          groupBy?: Types.Maybe<
            Pick<
              Types.DealStageDealsAggregateGroupBy,
              "closeDateMonth" | "closeDateYear"
            >
          >;
          sum?: Types.Maybe<Pick<Types.DealStageDealsSumAggregate, "value">>;
        }>;
      }
    >;
  };
};

export type DashboardWinRateQueryVariables = Types.Exact<{
  filter: Types.DealStageFilter;
  dealsAggregateFilter?: Types.InputMaybe<Types.DealAggregateFilter>;
}>;

export type DashboardWinRateQuery = {
  dealStages: {
    nodes: Array<
      Pick<Types.DealStage, "id" | "title"> & {
        dealsAggregate: Array<{
          count?: Types.Maybe<Pick<Types.DealStageDealsCountAggregate, "id">>;
        }>;
      }
    >;
  };
};

export type DashboardTasksByStageQueryVariables = Types.Exact<{
  filter: Types.TaskFilter;
  paging?: Types.InputMaybe<Types.OffsetPaging>;
}>;

export type DashboardTasksByStageQuery = {
  tasks: Pick<Types.TaskConnection, "totalCount"> & {
    nodes: Array<
      Pick<Types.Task, "id" | "createdAt"> & {
        stage?: Types.Maybe<Pick<Types.TaskStage, "title">>;
      }
    >;
  };
};

export type DashboardLatestActivitiesDealsQueryVariables = Types.Exact<{
  filter: Types.DealFilter;
  sorting?: Types.InputMaybe<Array<Types.DealSort> | Types.DealSort>;
  paging?: Types.InputMaybe<Types.OffsetPaging>;
}>;

export type DashboardLatestActivitiesDealsQuery = {
  deals: Pick<Types.DealConnection, "totalCount"> & {
    nodes: Array<
      Pick<Types.Deal, "id" | "title" | "createdAt"> & {
        stage?: Types.Maybe<Pick<Types.DealStage, "id" | "title">>;
        company: Pick<Types.Company, "id" | "name" | "avatarUrl">;
      }
    >;
  };
};

export type DashboardRecentActivityQueryVariables = Types.Exact<{
  companiesFilter: Types.CompanyFilter;
  contactsFilter: Types.ContactFilter;
  dealsFilter: Types.DealFilter;
  tasksFilter: Types.TaskFilter;
  companiesSorting?: Types.InputMaybe<
    Array<Types.CompanySort> | Types.CompanySort
  >;
  contactsSorting?: Types.InputMaybe<
    Array<Types.ContactSort> | Types.ContactSort
  >;
  dealsSorting?: Types.InputMaybe<Array<Types.DealSort> | Types.DealSort>;
  tasksSorting?: Types.InputMaybe<Array<Types.TaskSort> | Types.TaskSort>;
  paging?: Types.InputMaybe<Types.OffsetPaging>;
}>;

export type DashboardRecentActivityQuery = {
  companies: {
    nodes: Array<
      Pick<Types.Company, "id" | "name" | "createdAt" | "updatedAt">
    >;
  };
  contacts: {
    nodes: Array<
      Pick<Types.Contact, "id" | "name" | "createdAt" | "updatedAt">
    >;
  };
  deals: {
    nodes: Array<Pick<Types.Deal, "id" | "title" | "createdAt" | "updatedAt">>;
  };
  tasks: {
    nodes: Array<Pick<Types.Task, "id" | "title" | "createdAt" | "updatedAt">>;
  };
};

export type CompaniesListQueryVariables = Types.Exact<{
  filter: Types.CompanyFilter;
  sorting?: Types.InputMaybe<Array<Types.CompanySort> | Types.CompanySort>;
  paging: Types.OffsetPaging;
}>;

export type CompaniesListQuery = {
  companies: Pick<Types.CompanyConnection, "totalCount"> & {
    nodes: Array<
      Pick<Types.Company, "id" | "name" | "avatarUrl"> & {
        createdBy?: Types.Maybe<Pick<Types.User, "id">>;
        dealsAggregate: Array<{
          sum?: Types.Maybe<Pick<Types.CompanyDealsSumAggregate, "value">>;
        }>;
      }
    >;
  };
};

export type CompanyQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
}>;

export type CompanyQuery = {
  company: Pick<
    Types.Company,
    | "id"
    | "name"
    | "avatarUrl"
    | "companySize"
    | "totalRevenue"
    | "businessType"
    | "country"
    | "website"
  > & {
    salesOwner: Pick<Types.User, "id">;
    createdBy?: Types.Maybe<Pick<Types.User, "id">>;
  };
};

export type UsersSelectQueryVariables = Types.Exact<{
  filter: Types.UserFilter;
  sorting?: Types.InputMaybe<Array<Types.UserSort> | Types.UserSort>;
  paging: Types.OffsetPaging;
}>;

export type UsersSelectQuery = {
  users: Pick<Types.UserConnection, "totalCount"> & {
    nodes: Array<Pick<Types.User, "id" | "name" | "avatarUrl">>;
  };
};

export type TeamMembersQueryVariables = Types.Exact<{
  filter: Types.UserFilter;
  sorting?: Types.InputMaybe<Array<Types.UserSort> | Types.UserSort>;
  paging: Types.OffsetPaging;
}>;

export type TeamMembersQuery = {
  users: Pick<Types.UserConnection, "totalCount"> & {
    nodes: Array<
      Pick<Types.User, "id" | "name" | "email" | "phone" | "role" | "avatarUrl">
    >;
  };
};

export type ContactsListQueryVariables = Types.Exact<{
  filter: Types.ContactFilter;
  sorting?: Types.InputMaybe<Array<Types.ContactSort> | Types.ContactSort>;
  paging: Types.OffsetPaging;
}>;

export type ContactsListQuery = {
  contacts: Pick<Types.ContactConnection, "totalCount"> & {
    nodes: Array<
      Pick<
        Types.Contact,
        | "id"
        | "name"
        | "avatarUrl"
        | "companyName"
        | "jobTitle"
        | "email"
        | "phone"
        | "status"
      > & {
        createdBy?: Types.Maybe<Pick<Types.User, "id">>;
        salesOwner: Pick<Types.User, "id" | "name" | "avatarUrl">;
      }
    >;
  };
};

export type ContactQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
}>;

export type ContactQuery = {
  contact: Pick<
    Types.Contact,
    | "id"
    | "name"
    | "email"
    | "phone"
    | "jobTitle"
    | "companyName"
    | "status"
    | "score"
    | "timezone"
    | "avatarUrl"
  > & {
    salesOwner: Pick<Types.User, "id">;
    createdBy?: Types.Maybe<Pick<Types.User, "id">>;
  };
};

export type TaskStagesQueryVariables = Types.Exact<{
  filter: Types.TaskStageFilter;
  sorting?: Types.InputMaybe<Array<Types.TaskStageSort> | Types.TaskStageSort>;
  paging: Types.OffsetPaging;
}>;

export type TaskStagesQuery = {
  taskStages: Pick<Types.TaskStageConnection, "totalCount"> & {
    nodes: Array<Pick<Types.TaskStage, "id" | "title">>;
  };
};

export type TasksQueryVariables = Types.Exact<{
  filter: Types.TaskFilter;
  sorting?: Types.InputMaybe<Array<Types.TaskSort> | Types.TaskSort>;
  paging: Types.OffsetPaging;
}>;

export type TasksQuery = {
  tasks: Pick<Types.TaskConnection, "totalCount"> & {
    nodes: Array<
      Pick<
        Types.Task,
        | "id"
        | "title"
        | "description"
        | "dueDate"
        | "completed"
        | "stageId"
        | "createdAt"
        | "updatedAt"
      > & { users: Array<Pick<Types.User, "id" | "name" | "avatarUrl">> }
    >;
  };
};

export type TaskQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
}>;

export type TaskQuery = {
  task: Pick<
    Types.Task,
    "id" | "title" | "completed" | "description" | "dueDate" | "stageId"
  > & {
    createdBy?: Types.Maybe<Pick<Types.User, "id">>;
    stage?: Types.Maybe<Pick<Types.TaskStage, "id" | "title">>;
    users: Array<
      Pick<Types.User, "id" | "name" | "avatarUrl" | "phone" | "email">
    >;
    contacts: Array<Pick<Types.Contact, "id" | "name" | "avatarUrl">>;
    checklist: Array<Pick<Types.CheckListItem, "title" | "checked">>;
  };
};

export type TaskStagesSelectQueryVariables = Types.Exact<{
  filter: Types.TaskStageFilter;
  sorting?: Types.InputMaybe<Array<Types.TaskStageSort> | Types.TaskStageSort>;
  paging: Types.OffsetPaging;
}>;

export type TaskStagesSelectQuery = {
  taskStages: Pick<Types.TaskStageConnection, "totalCount"> & {
    nodes: Array<Pick<Types.TaskStage, "id" | "title">>;
  };
};

export type DealStagesQueryVariables = Types.Exact<{
  filter: Types.DealStageFilter;
  sorting?: Types.InputMaybe<Array<Types.DealStageSort> | Types.DealStageSort>;
  paging: Types.OffsetPaging;
}>;

export type DealStagesQuery = {
  dealStages: Pick<Types.DealStageConnection, "totalCount"> & {
    nodes: Array<Pick<Types.DealStage, "id" | "title">>;
  };
};

export type DealStagesSelectQueryVariables = Types.Exact<{
  filter: Types.DealStageFilter;
  sorting?: Types.InputMaybe<Array<Types.DealStageSort> | Types.DealStageSort>;
  paging: Types.OffsetPaging;
}>;

export type DealStagesSelectQuery = {
  dealStages: Pick<Types.DealStageConnection, "totalCount"> & {
    nodes: Array<Pick<Types.DealStage, "id" | "title">>;
  };
};

export type DealsQueryVariables = Types.Exact<{
  filter: Types.DealFilter;
  sorting?: Types.InputMaybe<Array<Types.DealSort> | Types.DealSort>;
  paging: Types.OffsetPaging;
}>;

export type DealsQuery = {
  deals: Pick<Types.DealConnection, "totalCount"> & {
    nodes: Array<
      Pick<
        Types.Deal,
        "id" | "title" | "value" | "stageId" | "createdAt" | "updatedAt"
      > & { company: Pick<Types.Company, "id" | "name" | "avatarUrl"> }
    >;
  };
};

export type DealsListQueryVariables = Types.Exact<{
  filter: Types.DealFilter;
  sorting?: Types.InputMaybe<Array<Types.DealSort> | Types.DealSort>;
  paging: Types.OffsetPaging;
}>;

export type DealsListQuery = {
  deals: Pick<Types.DealConnection, "totalCount"> & {
    nodes: Array<
      Pick<
        Types.Deal,
        | "id"
        | "title"
        | "value"
        | "closeDate"
        | "stageId"
        | "createdAt"
        | "updatedAt"
      > & {
        stage?: Types.Maybe<Pick<Types.DealStage, "id" | "title">>;
        company: Pick<Types.Company, "id" | "name" | "avatarUrl">;
        dealOwner: Pick<Types.User, "id" | "name" | "avatarUrl">;
        dealContact?: Types.Maybe<Pick<Types.Contact, "id" | "name">>;
        createdBy?: Types.Maybe<Pick<Types.User, "id">>;
      }
    >;
  };
};

export type DealQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
}>;

export type DealQuery = {
  deal: Pick<
    Types.Deal,
    | "id"
    | "title"
    | "value"
    | "closeDate"
    | "stageId"
    | "companyId"
    | "dealOwnerId"
    | "dealContactId"
  > & {
    createdBy?: Types.Maybe<Pick<Types.User, "id">>;
    stage?: Types.Maybe<Pick<Types.DealStage, "id" | "title">>;
    company: Pick<Types.Company, "id" | "name" | "avatarUrl">;
    dealOwner: Pick<Types.User, "id" | "name" | "avatarUrl">;
    dealContact?: Types.Maybe<Pick<Types.Contact, "id" | "name">>;
  };
};

export type CompaniesSelectQueryVariables = Types.Exact<{
  filter: Types.CompanyFilter;
  sorting?: Types.InputMaybe<Array<Types.CompanySort> | Types.CompanySort>;
  paging: Types.OffsetPaging;
}>;

export type CompaniesSelectQuery = {
  companies: Pick<Types.CompanyConnection, "totalCount"> & {
    nodes: Array<Pick<Types.Company, "id" | "name" | "avatarUrl">>;
  };
};

export type ContactsSelectQueryVariables = Types.Exact<{
  filter: Types.ContactFilter;
  sorting?: Types.InputMaybe<Array<Types.ContactSort> | Types.ContactSort>;
  paging: Types.OffsetPaging;
}>;

export type ContactsSelectQuery = {
  contacts: Pick<Types.ContactConnection, "totalCount"> & {
    nodes: Array<Pick<Types.Contact, "id" | "name" | "avatarUrl">>;
  };
};
