export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: string; output: string };
};

export type AuthResponse = {
  accessToken: Scalars["String"]["output"];
};

export type BooleanFieldComparison = {
  is?: InputMaybe<Scalars["Boolean"]["input"]>;
  isNot?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type BusinessType = "B2B" | "B2C" | "B2G";

export type BusinessTypeFilterComparison = {
  eq?: InputMaybe<BusinessType>;
  gt?: InputMaybe<BusinessType>;
  gte?: InputMaybe<BusinessType>;
  iLike?: InputMaybe<BusinessType>;
  in?: InputMaybe<Array<BusinessType>>;
  is?: InputMaybe<Scalars["Boolean"]["input"]>;
  isNot?: InputMaybe<Scalars["Boolean"]["input"]>;
  like?: InputMaybe<BusinessType>;
  lt?: InputMaybe<BusinessType>;
  lte?: InputMaybe<BusinessType>;
  neq?: InputMaybe<BusinessType>;
  notILike?: InputMaybe<BusinessType>;
  notIn?: InputMaybe<Array<BusinessType>>;
  notLike?: InputMaybe<BusinessType>;
};

export type CheckListItem = {
  checked: Scalars["Boolean"]["output"];
  title: Scalars["String"]["output"];
};

export type ChecklistItemInput = {
  checked: Scalars["Boolean"]["input"];
  title: Scalars["String"]["input"];
};

export type Company = {
  avatarUrl?: Maybe<Scalars["String"]["output"]>;
  businessType?: Maybe<BusinessType>;
  companySize?: Maybe<CompanySize>;
  country?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  createdBy?: Maybe<User>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  deals: CompanyDealsConnection;
  dealsAggregate: Array<CompanyDealsAggregateResponse>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  salesOwner: User;
  salesOwnerId: Scalars["String"]["output"];
  totalRevenue?: Maybe<Scalars["Float"]["output"]>;
  updatedAt: Scalars["DateTime"]["output"];
  website?: Maybe<Scalars["String"]["output"]>;
};

export type CompanyDealsArgs = {
  filter?: DealFilter;
  paging?: OffsetPaging;
  sorting?: Array<DealSort>;
};

export type CompanyDealsAggregateArgs = {
  filter?: InputMaybe<DealAggregateFilter>;
};

export type CompanyAggregateFilter = {
  and?: InputMaybe<Array<CompanyAggregateFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  businessType?: InputMaybe<BusinessTypeFilterComparison>;
  companySize?: InputMaybe<CompanySizeFilterComparison>;
  country?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdBy?: InputMaybe<CompanyAggregateFilterUserAggregateFilter>;
  createdById?: InputMaybe<StringFieldComparison>;
  deals?: InputMaybe<CompanyAggregateFilterDealAggregateFilter>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<CompanyAggregateFilter>>;
  salesOwner?: InputMaybe<CompanyAggregateFilterUserAggregateFilter>;
  salesOwnerId?: InputMaybe<StringFieldComparison>;
  totalRevenue?: InputMaybe<NumberFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
  website?: InputMaybe<StringFieldComparison>;
};

export type CompanyAggregateFilterDealAggregateFilter = {
  and?: InputMaybe<Array<CompanyAggregateFilterDealAggregateFilter>>;
  closeDate?: InputMaybe<DateFieldComparison>;
  closeDateMonth?: InputMaybe<IntFieldComparison>;
  closeDateYear?: InputMaybe<IntFieldComparison>;
  companyId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  dealContactId?: InputMaybe<StringFieldComparison>;
  dealOwnerId?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<CompanyAggregateFilterDealAggregateFilter>>;
  stageId?: InputMaybe<IdFilterComparison>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
  value?: InputMaybe<NumberFieldComparison>;
};

export type CompanyAggregateFilterUserAggregateFilter = {
  and?: InputMaybe<Array<CompanyAggregateFilterUserAggregateFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<CompanyAggregateFilterUserAggregateFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  role?: InputMaybe<RoleFilterComparison>;
  source?: InputMaybe<UserSourceFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type CompanyAggregateGroupBy = {
  avatarUrl?: Maybe<Scalars["String"]["output"]>;
  businessType?: Maybe<BusinessType>;
  companySize?: Maybe<CompanySize>;
  country?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  salesOwnerId?: Maybe<Scalars["String"]["output"]>;
  totalRevenue?: Maybe<Scalars["Float"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  website?: Maybe<Scalars["String"]["output"]>;
};

export type CompanyAggregateGroupByCreatedAtArgs = {
  by?: GroupBy;
};

export type CompanyAggregateGroupByUpdatedAtArgs = {
  by?: GroupBy;
};

export type CompanyAggregateResponse = {
  avg?: Maybe<CompanyAvgAggregate>;
  count?: Maybe<CompanyCountAggregate>;
  groupBy?: Maybe<CompanyAggregateGroupBy>;
  max?: Maybe<CompanyMaxAggregate>;
  min?: Maybe<CompanyMinAggregate>;
  sum?: Maybe<CompanySumAggregate>;
};

export type CompanyAvgAggregate = {
  totalRevenue?: Maybe<Scalars["Float"]["output"]>;
};

export type CompanyConnection = {
  /** Array of nodes. */
  nodes: Array<Company>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars["Int"]["output"];
};

export type CompanyCountAggregate = {
  avatarUrl?: Maybe<Scalars["Int"]["output"]>;
  businessType?: Maybe<Scalars["Int"]["output"]>;
  companySize?: Maybe<Scalars["Int"]["output"]>;
  country?: Maybe<Scalars["Int"]["output"]>;
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  createdById?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["Int"]["output"]>;
  name?: Maybe<Scalars["Int"]["output"]>;
  salesOwnerId?: Maybe<Scalars["Int"]["output"]>;
  totalRevenue?: Maybe<Scalars["Int"]["output"]>;
  updatedAt?: Maybe<Scalars["Int"]["output"]>;
  website?: Maybe<Scalars["Int"]["output"]>;
};

export type CompanyDealsAggregateGroupBy = {
  closeDate?: Maybe<Scalars["DateTime"]["output"]>;
  closeDateMonth?: Maybe<Scalars["Int"]["output"]>;
  closeDateYear?: Maybe<Scalars["Int"]["output"]>;
  companyId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  dealContactId?: Maybe<Scalars["String"]["output"]>;
  dealOwnerId?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  stageId?: Maybe<Scalars["ID"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type CompanyDealsAggregateResponse = {
  avg?: Maybe<CompanyDealsAvgAggregate>;
  count?: Maybe<CompanyDealsCountAggregate>;
  groupBy?: Maybe<CompanyDealsAggregateGroupBy>;
  max?: Maybe<CompanyDealsMaxAggregate>;
  min?: Maybe<CompanyDealsMinAggregate>;
  sum?: Maybe<CompanyDealsSumAggregate>;
};

export type CompanyDealsAvgAggregate = {
  closeDateMonth?: Maybe<Scalars["Float"]["output"]>;
  closeDateYear?: Maybe<Scalars["Float"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type CompanyDealsConnection = {
  /** Array of nodes. */
  nodes: Array<Deal>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars["Int"]["output"];
};

export type CompanyDealsCountAggregate = {
  closeDate?: Maybe<Scalars["Int"]["output"]>;
  closeDateMonth?: Maybe<Scalars["Int"]["output"]>;
  closeDateYear?: Maybe<Scalars["Int"]["output"]>;
  companyId?: Maybe<Scalars["Int"]["output"]>;
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  createdById?: Maybe<Scalars["Int"]["output"]>;
  dealContactId?: Maybe<Scalars["Int"]["output"]>;
  dealOwnerId?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["Int"]["output"]>;
  stageId?: Maybe<Scalars["Int"]["output"]>;
  title?: Maybe<Scalars["Int"]["output"]>;
  updatedAt?: Maybe<Scalars["Int"]["output"]>;
  value?: Maybe<Scalars["Int"]["output"]>;
};

export type CompanyDealsMaxAggregate = {
  closeDate?: Maybe<Scalars["DateTime"]["output"]>;
  closeDateMonth?: Maybe<Scalars["Int"]["output"]>;
  closeDateYear?: Maybe<Scalars["Int"]["output"]>;
  companyId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  dealContactId?: Maybe<Scalars["String"]["output"]>;
  dealOwnerId?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  stageId?: Maybe<Scalars["ID"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type CompanyDealsMinAggregate = {
  closeDate?: Maybe<Scalars["DateTime"]["output"]>;
  closeDateMonth?: Maybe<Scalars["Int"]["output"]>;
  closeDateYear?: Maybe<Scalars["Int"]["output"]>;
  companyId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  dealContactId?: Maybe<Scalars["String"]["output"]>;
  dealOwnerId?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  stageId?: Maybe<Scalars["ID"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type CompanyDealsSumAggregate = {
  closeDateMonth?: Maybe<Scalars["Float"]["output"]>;
  closeDateYear?: Maybe<Scalars["Float"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type CompanyDeleteFilter = {
  and?: InputMaybe<Array<CompanyDeleteFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  businessType?: InputMaybe<BusinessTypeFilterComparison>;
  companySize?: InputMaybe<CompanySizeFilterComparison>;
  country?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<CompanyDeleteFilter>>;
  salesOwnerId?: InputMaybe<StringFieldComparison>;
  totalRevenue?: InputMaybe<NumberFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
  website?: InputMaybe<StringFieldComparison>;
};

export type CompanyDeleteResponse = {
  avatarUrl?: Maybe<Scalars["String"]["output"]>;
  businessType?: Maybe<BusinessType>;
  companySize?: Maybe<CompanySize>;
  country?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  salesOwnerId?: Maybe<Scalars["String"]["output"]>;
  totalRevenue?: Maybe<Scalars["Float"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  website?: Maybe<Scalars["String"]["output"]>;
};

export type CompanyFilter = {
  and?: InputMaybe<Array<CompanyFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  businessType?: InputMaybe<BusinessTypeFilterComparison>;
  companySize?: InputMaybe<CompanySizeFilterComparison>;
  country?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdBy?: InputMaybe<CompanyFilterUserFilter>;
  createdById?: InputMaybe<StringFieldComparison>;
  deals?: InputMaybe<CompanyFilterDealFilter>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<CompanyFilter>>;
  salesOwner?: InputMaybe<CompanyFilterUserFilter>;
  salesOwnerId?: InputMaybe<StringFieldComparison>;
  totalRevenue?: InputMaybe<NumberFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
  website?: InputMaybe<StringFieldComparison>;
};

export type CompanyFilterDealFilter = {
  and?: InputMaybe<Array<CompanyFilterDealFilter>>;
  closeDate?: InputMaybe<DateFieldComparison>;
  closeDateMonth?: InputMaybe<IntFieldComparison>;
  closeDateYear?: InputMaybe<IntFieldComparison>;
  companyId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  dealContactId?: InputMaybe<StringFieldComparison>;
  dealOwnerId?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<CompanyFilterDealFilter>>;
  stageId?: InputMaybe<IdFilterComparison>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
  value?: InputMaybe<NumberFieldComparison>;
};

export type CompanyFilterUserFilter = {
  and?: InputMaybe<Array<CompanyFilterUserFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<CompanyFilterUserFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  role?: InputMaybe<RoleFilterComparison>;
  source?: InputMaybe<UserSourceFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type CompanyMaxAggregate = {
  avatarUrl?: Maybe<Scalars["String"]["output"]>;
  businessType?: Maybe<BusinessType>;
  companySize?: Maybe<CompanySize>;
  country?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  salesOwnerId?: Maybe<Scalars["String"]["output"]>;
  totalRevenue?: Maybe<Scalars["Float"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  website?: Maybe<Scalars["String"]["output"]>;
};

export type CompanyMinAggregate = {
  avatarUrl?: Maybe<Scalars["String"]["output"]>;
  businessType?: Maybe<BusinessType>;
  companySize?: Maybe<CompanySize>;
  country?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  salesOwnerId?: Maybe<Scalars["String"]["output"]>;
  totalRevenue?: Maybe<Scalars["Float"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  website?: Maybe<Scalars["String"]["output"]>;
};

export type CompanySize = "ENTERPRISE" | "LARGE" | "MEDIUM" | "SMALL";

export type CompanySizeFilterComparison = {
  eq?: InputMaybe<CompanySize>;
  gt?: InputMaybe<CompanySize>;
  gte?: InputMaybe<CompanySize>;
  iLike?: InputMaybe<CompanySize>;
  in?: InputMaybe<Array<CompanySize>>;
  is?: InputMaybe<Scalars["Boolean"]["input"]>;
  isNot?: InputMaybe<Scalars["Boolean"]["input"]>;
  like?: InputMaybe<CompanySize>;
  lt?: InputMaybe<CompanySize>;
  lte?: InputMaybe<CompanySize>;
  neq?: InputMaybe<CompanySize>;
  notILike?: InputMaybe<CompanySize>;
  notIn?: InputMaybe<Array<CompanySize>>;
  notLike?: InputMaybe<CompanySize>;
};

export type CompanySort = {
  direction: SortDirection;
  field: CompanySortFields;
  nulls?: InputMaybe<SortNulls>;
};

export type CompanySortFields =
  | "avatarUrl"
  | "businessType"
  | "companySize"
  | "country"
  | "createdAt"
  | "createdById"
  | "id"
  | "name"
  | "salesOwnerId"
  | "totalRevenue"
  | "updatedAt"
  | "website";

export type CompanySumAggregate = {
  totalRevenue?: Maybe<Scalars["Float"]["output"]>;
};

export type CompanyUpdateFilter = {
  and?: InputMaybe<Array<CompanyUpdateFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  businessType?: InputMaybe<BusinessTypeFilterComparison>;
  companySize?: InputMaybe<CompanySizeFilterComparison>;
  country?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<CompanyUpdateFilter>>;
  salesOwnerId?: InputMaybe<StringFieldComparison>;
  totalRevenue?: InputMaybe<NumberFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
  website?: InputMaybe<StringFieldComparison>;
};

export type Contact = {
  avatarUrl?: Maybe<Scalars["String"]["output"]>;
  companyName: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  createdBy?: Maybe<User>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  jobTitle?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  phone?: Maybe<Scalars["String"]["output"]>;
  salesOwner: User;
  salesOwnerId: Scalars["String"]["output"];
  score?: Maybe<Scalars["Float"]["output"]>;
  status: ContactStatus;
  timezone?: Maybe<Scalars["String"]["output"]>;
  updatedAt: Scalars["DateTime"]["output"];
};

export type ContactConnection = {
  /** Array of nodes. */
  nodes: Array<Contact>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars["Int"]["output"];
};

export type ContactDeleteFilter = {
  and?: InputMaybe<Array<ContactDeleteFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  companyName?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<ContactDeleteFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  salesOwnerId?: InputMaybe<StringFieldComparison>;
  score?: InputMaybe<NumberFieldComparison>;
  status?: InputMaybe<ContactStatusFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type ContactDeleteResponse = {
  avatarUrl?: Maybe<Scalars["String"]["output"]>;
  companyName?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  jobTitle?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  phone?: Maybe<Scalars["String"]["output"]>;
  salesOwnerId?: Maybe<Scalars["String"]["output"]>;
  score?: Maybe<Scalars["Float"]["output"]>;
  status?: Maybe<ContactStatus>;
  timezone?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type ContactFilter = {
  and?: InputMaybe<Array<ContactFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  companyName?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdBy?: InputMaybe<ContactFilterUserFilter>;
  createdById?: InputMaybe<StringFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<ContactFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  salesOwner?: InputMaybe<ContactFilterUserFilter>;
  salesOwnerId?: InputMaybe<StringFieldComparison>;
  score?: InputMaybe<NumberFieldComparison>;
  status?: InputMaybe<ContactStatusFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type ContactFilterUserFilter = {
  and?: InputMaybe<Array<ContactFilterUserFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<ContactFilterUserFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  role?: InputMaybe<RoleFilterComparison>;
  source?: InputMaybe<UserSourceFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type ContactSort = {
  direction: SortDirection;
  field: ContactSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export type ContactSortFields =
  | "avatarUrl"
  | "companyName"
  | "createdAt"
  | "createdById"
  | "email"
  | "id"
  | "jobTitle"
  | "name"
  | "phone"
  | "salesOwnerId"
  | "score"
  | "status"
  | "timezone"
  | "updatedAt";

export type ContactStatus =
  | "CHURNED"
  | "CONTACTED"
  | "INTERESTED"
  | "LOST"
  | "NEGOTIATION"
  | "NEW"
  | "QUALIFIED"
  | "UNQUALIFIED"
  | "WON";

export type ContactStatusFilterComparison = {
  eq?: InputMaybe<ContactStatus>;
  gt?: InputMaybe<ContactStatus>;
  gte?: InputMaybe<ContactStatus>;
  iLike?: InputMaybe<ContactStatus>;
  in?: InputMaybe<Array<ContactStatus>>;
  is?: InputMaybe<Scalars["Boolean"]["input"]>;
  isNot?: InputMaybe<Scalars["Boolean"]["input"]>;
  like?: InputMaybe<ContactStatus>;
  lt?: InputMaybe<ContactStatus>;
  lte?: InputMaybe<ContactStatus>;
  neq?: InputMaybe<ContactStatus>;
  notILike?: InputMaybe<ContactStatus>;
  notIn?: InputMaybe<Array<ContactStatus>>;
  notLike?: InputMaybe<ContactStatus>;
};

export type ContactUpdateFilter = {
  and?: InputMaybe<Array<ContactUpdateFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  companyName?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<ContactUpdateFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  salesOwnerId?: InputMaybe<StringFieldComparison>;
  score?: InputMaybe<NumberFieldComparison>;
  status?: InputMaybe<ContactStatusFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type CreateCompanyInput = {
  businessType?: InputMaybe<BusinessType>;
  companySize?: InputMaybe<CompanySize>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  createdById?: InputMaybe<Scalars["ID"]["input"]>;
  name: Scalars["String"]["input"];
  salesOwnerId: Scalars["ID"]["input"];
  totalRevenue?: InputMaybe<Scalars["Float"]["input"]>;
  website?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreateContactInput = {
  companyName: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  jobTitle?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  phone?: InputMaybe<Scalars["String"]["input"]>;
  salesOwnerId: Scalars["ID"]["input"];
  score?: InputMaybe<Scalars["Float"]["input"]>;
  status?: InputMaybe<ContactStatus>;
  timezone?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreateDealInput = {
  closeDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  companyId: Scalars["ID"]["input"];
  dealContactId?: InputMaybe<Scalars["ID"]["input"]>;
  dealOwnerId: Scalars["ID"]["input"];
  stageId?: InputMaybe<Scalars["ID"]["input"]>;
  title: Scalars["String"]["input"];
  value?: InputMaybe<Scalars["Float"]["input"]>;
};

export type CreateDealStageInput = {
  title: Scalars["String"]["input"];
};

export type CreateManyCompaniesInput = {
  /** Array of records to create */
  companies: Array<CreateCompanyInput>;
};

export type CreateManyContactsInput = {
  /** Array of records to create */
  contacts: Array<CreateContactInput>;
};

export type CreateManyDealStagesInput = {
  /** Array of records to create */
  dealStages: Array<CreateDealStageInput>;
};

export type CreateManyDealsInput = {
  /** Array of records to create */
  deals: Array<CreateDealInput>;
};

export type CreateManyTaskStagesInput = {
  /** Array of records to create */
  taskStages: Array<CreateTaskStageInput>;
};

export type CreateManyUsersInput = {
  /** Array of records to create */
  users: Array<CreateUserInput>;
};

export type CreateOneCompanyInput = {
  /** The record to create */
  company: CreateCompanyInput;
};

export type CreateOneContactInput = {
  /** The record to create */
  contact: CreateContactInput;
};

export type CreateOneDealInput = {
  /** The record to create */
  deal: CreateDealInput;
};

export type CreateOneDealStageInput = {
  /** The record to create */
  dealStage: CreateDealStageInput;
};

export type CreateOneTaskInput = {
  task: CreateTaskInput;
};

export type CreateOneTaskStageInput = {
  /** The record to create */
  taskStage: CreateTaskStageInput;
};

export type CreateOneUserInput = {
  /** The record to create */
  user: CreateUserInput;
};

export type CreateTaskInput = {
  checklist?: InputMaybe<Array<ChecklistItemInput>>;
  completed?: InputMaybe<Scalars["Boolean"]["input"]>;
  contactIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  stageId?: InputMaybe<Scalars["ID"]["input"]>;
  title: Scalars["String"]["input"];
  userIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type CreateTaskStageInput = {
  title: Scalars["String"]["input"];
};

export type CreateUserInput = {
  email: Scalars["String"]["input"];
  jobTitle?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
  role?: InputMaybe<Role>;
  source?: InputMaybe<UserSource>;
  timezone?: InputMaybe<Scalars["String"]["input"]>;
};

export type DateFieldComparison = {
  between?: InputMaybe<DateFieldComparisonBetween>;
  eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  is?: InputMaybe<Scalars["Boolean"]["input"]>;
  isNot?: InputMaybe<Scalars["Boolean"]["input"]>;
  lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  neq?: InputMaybe<Scalars["DateTime"]["input"]>;
  notBetween?: InputMaybe<DateFieldComparisonBetween>;
  notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type DateFieldComparisonBetween = {
  lower: Scalars["DateTime"]["input"];
  upper: Scalars["DateTime"]["input"];
};

export type Deal = {
  closeDate?: Maybe<Scalars["DateTime"]["output"]>;
  closeDateMonth?: Maybe<Scalars["Int"]["output"]>;
  closeDateYear?: Maybe<Scalars["Int"]["output"]>;
  company: Company;
  companyId: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  createdBy?: Maybe<User>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  dealContact?: Maybe<Contact>;
  dealContactId?: Maybe<Scalars["String"]["output"]>;
  dealOwner: User;
  dealOwnerId: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  stage?: Maybe<DealStage>;
  stageId?: Maybe<Scalars["ID"]["output"]>;
  title: Scalars["String"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DealAggregateFilter = {
  and?: InputMaybe<Array<DealAggregateFilter>>;
  closeDate?: InputMaybe<DateFieldComparison>;
  closeDateMonth?: InputMaybe<IntFieldComparison>;
  closeDateYear?: InputMaybe<IntFieldComparison>;
  company?: InputMaybe<DealAggregateFilterCompanyAggregateFilter>;
  companyId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdBy?: InputMaybe<DealAggregateFilterUserAggregateFilter>;
  createdById?: InputMaybe<StringFieldComparison>;
  dealContact?: InputMaybe<DealAggregateFilterContactAggregateFilter>;
  dealContactId?: InputMaybe<StringFieldComparison>;
  dealOwner?: InputMaybe<DealAggregateFilterUserAggregateFilter>;
  dealOwnerId?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<DealAggregateFilter>>;
  stage?: InputMaybe<DealAggregateFilterDealStageAggregateFilter>;
  stageId?: InputMaybe<IdFilterComparison>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
  value?: InputMaybe<NumberFieldComparison>;
};

export type DealAggregateFilterCompanyAggregateFilter = {
  and?: InputMaybe<Array<DealAggregateFilterCompanyAggregateFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  businessType?: InputMaybe<BusinessTypeFilterComparison>;
  companySize?: InputMaybe<CompanySizeFilterComparison>;
  country?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<DealAggregateFilterCompanyAggregateFilter>>;
  salesOwnerId?: InputMaybe<StringFieldComparison>;
  totalRevenue?: InputMaybe<NumberFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
  website?: InputMaybe<StringFieldComparison>;
};

export type DealAggregateFilterContactAggregateFilter = {
  and?: InputMaybe<Array<DealAggregateFilterContactAggregateFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  companyName?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<DealAggregateFilterContactAggregateFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  salesOwnerId?: InputMaybe<StringFieldComparison>;
  score?: InputMaybe<NumberFieldComparison>;
  status?: InputMaybe<ContactStatusFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DealAggregateFilterDealStageAggregateFilter = {
  and?: InputMaybe<Array<DealAggregateFilterDealStageAggregateFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<DealAggregateFilterDealStageAggregateFilter>>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DealAggregateFilterUserAggregateFilter = {
  and?: InputMaybe<Array<DealAggregateFilterUserAggregateFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<DealAggregateFilterUserAggregateFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  role?: InputMaybe<RoleFilterComparison>;
  source?: InputMaybe<UserSourceFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DealAggregateGroupBy = {
  closeDate?: Maybe<Scalars["DateTime"]["output"]>;
  closeDateMonth?: Maybe<Scalars["Int"]["output"]>;
  closeDateYear?: Maybe<Scalars["Int"]["output"]>;
  companyId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  dealContactId?: Maybe<Scalars["String"]["output"]>;
  dealOwnerId?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  stageId?: Maybe<Scalars["ID"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DealAggregateGroupByCloseDateArgs = {
  by?: GroupBy;
};

export type DealAggregateGroupByCreatedAtArgs = {
  by?: GroupBy;
};

export type DealAggregateGroupByUpdatedAtArgs = {
  by?: GroupBy;
};

export type DealAggregateResponse = {
  avg?: Maybe<DealAvgAggregate>;
  count?: Maybe<DealCountAggregate>;
  groupBy?: Maybe<DealAggregateGroupBy>;
  max?: Maybe<DealMaxAggregate>;
  min?: Maybe<DealMinAggregate>;
  sum?: Maybe<DealSumAggregate>;
};

export type DealAvgAggregate = {
  closeDateMonth?: Maybe<Scalars["Float"]["output"]>;
  closeDateYear?: Maybe<Scalars["Float"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DealConnection = {
  /** Array of nodes. */
  nodes: Array<Deal>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars["Int"]["output"];
};

export type DealCountAggregate = {
  closeDate?: Maybe<Scalars["Int"]["output"]>;
  closeDateMonth?: Maybe<Scalars["Int"]["output"]>;
  closeDateYear?: Maybe<Scalars["Int"]["output"]>;
  companyId?: Maybe<Scalars["Int"]["output"]>;
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  createdById?: Maybe<Scalars["Int"]["output"]>;
  dealContactId?: Maybe<Scalars["Int"]["output"]>;
  dealOwnerId?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["Int"]["output"]>;
  stageId?: Maybe<Scalars["Int"]["output"]>;
  title?: Maybe<Scalars["Int"]["output"]>;
  updatedAt?: Maybe<Scalars["Int"]["output"]>;
  value?: Maybe<Scalars["Int"]["output"]>;
};

export type DealDeleteFilter = {
  and?: InputMaybe<Array<DealDeleteFilter>>;
  closeDate?: InputMaybe<DateFieldComparison>;
  closeDateMonth?: InputMaybe<IntFieldComparison>;
  closeDateYear?: InputMaybe<IntFieldComparison>;
  companyId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  dealContactId?: InputMaybe<StringFieldComparison>;
  dealOwnerId?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<DealDeleteFilter>>;
  stageId?: InputMaybe<IdFilterComparison>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
  value?: InputMaybe<NumberFieldComparison>;
};

export type DealDeleteResponse = {
  closeDate?: Maybe<Scalars["DateTime"]["output"]>;
  closeDateMonth?: Maybe<Scalars["Int"]["output"]>;
  closeDateYear?: Maybe<Scalars["Int"]["output"]>;
  companyId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  dealContactId?: Maybe<Scalars["String"]["output"]>;
  dealOwnerId?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  stageId?: Maybe<Scalars["ID"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DealFilter = {
  and?: InputMaybe<Array<DealFilter>>;
  closeDate?: InputMaybe<DateFieldComparison>;
  closeDateMonth?: InputMaybe<IntFieldComparison>;
  closeDateYear?: InputMaybe<IntFieldComparison>;
  company?: InputMaybe<DealFilterCompanyFilter>;
  companyId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdBy?: InputMaybe<DealFilterUserFilter>;
  createdById?: InputMaybe<StringFieldComparison>;
  dealContact?: InputMaybe<DealFilterContactFilter>;
  dealContactId?: InputMaybe<StringFieldComparison>;
  dealOwner?: InputMaybe<DealFilterUserFilter>;
  dealOwnerId?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<DealFilter>>;
  stage?: InputMaybe<DealFilterDealStageFilter>;
  stageId?: InputMaybe<IdFilterComparison>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
  value?: InputMaybe<NumberFieldComparison>;
};

export type DealFilterCompanyFilter = {
  and?: InputMaybe<Array<DealFilterCompanyFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  businessType?: InputMaybe<BusinessTypeFilterComparison>;
  companySize?: InputMaybe<CompanySizeFilterComparison>;
  country?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<DealFilterCompanyFilter>>;
  salesOwnerId?: InputMaybe<StringFieldComparison>;
  totalRevenue?: InputMaybe<NumberFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
  website?: InputMaybe<StringFieldComparison>;
};

export type DealFilterContactFilter = {
  and?: InputMaybe<Array<DealFilterContactFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  companyName?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<DealFilterContactFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  salesOwnerId?: InputMaybe<StringFieldComparison>;
  score?: InputMaybe<NumberFieldComparison>;
  status?: InputMaybe<ContactStatusFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DealFilterDealStageFilter = {
  and?: InputMaybe<Array<DealFilterDealStageFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<DealFilterDealStageFilter>>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DealFilterUserFilter = {
  and?: InputMaybe<Array<DealFilterUserFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<DealFilterUserFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  role?: InputMaybe<RoleFilterComparison>;
  source?: InputMaybe<UserSourceFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DealMaxAggregate = {
  closeDate?: Maybe<Scalars["DateTime"]["output"]>;
  closeDateMonth?: Maybe<Scalars["Int"]["output"]>;
  closeDateYear?: Maybe<Scalars["Int"]["output"]>;
  companyId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  dealContactId?: Maybe<Scalars["String"]["output"]>;
  dealOwnerId?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  stageId?: Maybe<Scalars["ID"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DealMinAggregate = {
  closeDate?: Maybe<Scalars["DateTime"]["output"]>;
  closeDateMonth?: Maybe<Scalars["Int"]["output"]>;
  closeDateYear?: Maybe<Scalars["Int"]["output"]>;
  companyId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  dealContactId?: Maybe<Scalars["String"]["output"]>;
  dealOwnerId?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  stageId?: Maybe<Scalars["ID"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DealSort = {
  direction: SortDirection;
  field: DealSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export type DealSortFields =
  | "closeDate"
  | "closeDateMonth"
  | "closeDateYear"
  | "companyId"
  | "createdAt"
  | "createdById"
  | "dealContactId"
  | "dealOwnerId"
  | "id"
  | "stageId"
  | "title"
  | "updatedAt"
  | "value";

export type DealStage = {
  createdAt: Scalars["DateTime"]["output"];
  createdBy?: Maybe<User>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  deals: DealStageDealsConnection;
  dealsAggregate: Array<DealStageDealsAggregateResponse>;
  id: Scalars["ID"]["output"];
  title: Scalars["String"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
};

export type DealStageDealsArgs = {
  filter?: DealFilter;
  paging?: OffsetPaging;
  sorting?: Array<DealSort>;
};

export type DealStageDealsAggregateArgs = {
  filter?: InputMaybe<DealAggregateFilter>;
};

export type DealStageConnection = {
  /** Array of nodes. */
  nodes: Array<DealStage>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars["Int"]["output"];
};

export type DealStageDealsAggregateGroupBy = {
  closeDate?: Maybe<Scalars["DateTime"]["output"]>;
  closeDateMonth?: Maybe<Scalars["Int"]["output"]>;
  closeDateYear?: Maybe<Scalars["Int"]["output"]>;
  companyId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  dealContactId?: Maybe<Scalars["String"]["output"]>;
  dealOwnerId?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  stageId?: Maybe<Scalars["ID"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DealStageDealsAggregateResponse = {
  avg?: Maybe<DealStageDealsAvgAggregate>;
  count?: Maybe<DealStageDealsCountAggregate>;
  groupBy?: Maybe<DealStageDealsAggregateGroupBy>;
  max?: Maybe<DealStageDealsMaxAggregate>;
  min?: Maybe<DealStageDealsMinAggregate>;
  sum?: Maybe<DealStageDealsSumAggregate>;
};

export type DealStageDealsAvgAggregate = {
  closeDateMonth?: Maybe<Scalars["Float"]["output"]>;
  closeDateYear?: Maybe<Scalars["Float"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DealStageDealsConnection = {
  /** Array of nodes. */
  nodes: Array<Deal>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars["Int"]["output"];
};

export type DealStageDealsCountAggregate = {
  closeDate?: Maybe<Scalars["Int"]["output"]>;
  closeDateMonth?: Maybe<Scalars["Int"]["output"]>;
  closeDateYear?: Maybe<Scalars["Int"]["output"]>;
  companyId?: Maybe<Scalars["Int"]["output"]>;
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  createdById?: Maybe<Scalars["Int"]["output"]>;
  dealContactId?: Maybe<Scalars["Int"]["output"]>;
  dealOwnerId?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["Int"]["output"]>;
  stageId?: Maybe<Scalars["Int"]["output"]>;
  title?: Maybe<Scalars["Int"]["output"]>;
  updatedAt?: Maybe<Scalars["Int"]["output"]>;
  value?: Maybe<Scalars["Int"]["output"]>;
};

export type DealStageDealsMaxAggregate = {
  closeDate?: Maybe<Scalars["DateTime"]["output"]>;
  closeDateMonth?: Maybe<Scalars["Int"]["output"]>;
  closeDateYear?: Maybe<Scalars["Int"]["output"]>;
  companyId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  dealContactId?: Maybe<Scalars["String"]["output"]>;
  dealOwnerId?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  stageId?: Maybe<Scalars["ID"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DealStageDealsMinAggregate = {
  closeDate?: Maybe<Scalars["DateTime"]["output"]>;
  closeDateMonth?: Maybe<Scalars["Int"]["output"]>;
  closeDateYear?: Maybe<Scalars["Int"]["output"]>;
  companyId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  dealContactId?: Maybe<Scalars["String"]["output"]>;
  dealOwnerId?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  stageId?: Maybe<Scalars["ID"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DealStageDealsSumAggregate = {
  closeDateMonth?: Maybe<Scalars["Float"]["output"]>;
  closeDateYear?: Maybe<Scalars["Float"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DealStageDeleteFilter = {
  and?: InputMaybe<Array<DealStageDeleteFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<DealStageDeleteFilter>>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DealStageDeleteResponse = {
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type DealStageFilter = {
  and?: InputMaybe<Array<DealStageFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdBy?: InputMaybe<DealStageFilterUserFilter>;
  createdById?: InputMaybe<StringFieldComparison>;
  deals?: InputMaybe<DealStageFilterDealFilter>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<DealStageFilter>>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DealStageFilterDealFilter = {
  and?: InputMaybe<Array<DealStageFilterDealFilter>>;
  closeDate?: InputMaybe<DateFieldComparison>;
  closeDateMonth?: InputMaybe<IntFieldComparison>;
  closeDateYear?: InputMaybe<IntFieldComparison>;
  companyId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  dealContactId?: InputMaybe<StringFieldComparison>;
  dealOwnerId?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<DealStageFilterDealFilter>>;
  stageId?: InputMaybe<IdFilterComparison>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
  value?: InputMaybe<NumberFieldComparison>;
};

export type DealStageFilterUserFilter = {
  and?: InputMaybe<Array<DealStageFilterUserFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<DealStageFilterUserFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  role?: InputMaybe<RoleFilterComparison>;
  source?: InputMaybe<UserSourceFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DealStageSort = {
  direction: SortDirection;
  field: DealStageSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export type DealStageSortFields =
  "createdAt" | "createdById" | "id" | "title" | "updatedAt";

export type DealStageUpdateFilter = {
  and?: InputMaybe<Array<DealStageUpdateFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<DealStageUpdateFilter>>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DealSumAggregate = {
  closeDateMonth?: Maybe<Scalars["Float"]["output"]>;
  closeDateYear?: Maybe<Scalars["Float"]["output"]>;
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DealUpdateFilter = {
  and?: InputMaybe<Array<DealUpdateFilter>>;
  closeDate?: InputMaybe<DateFieldComparison>;
  closeDateMonth?: InputMaybe<IntFieldComparison>;
  closeDateYear?: InputMaybe<IntFieldComparison>;
  companyId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  dealContactId?: InputMaybe<StringFieldComparison>;
  dealOwnerId?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<DealUpdateFilter>>;
  stageId?: InputMaybe<IdFilterComparison>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
  value?: InputMaybe<NumberFieldComparison>;
};

export type DeleteManyCompaniesInput = {
  /** Filter to find records to delete */
  filter: CompanyDeleteFilter;
};

export type DeleteManyContactsInput = {
  /** Filter to find records to delete */
  filter: ContactDeleteFilter;
};

export type DeleteManyDealStagesInput = {
  /** Filter to find records to delete */
  filter: DealStageDeleteFilter;
};

export type DeleteManyDealsInput = {
  /** Filter to find records to delete */
  filter: DealDeleteFilter;
};

export type DeleteManyResponse = {
  /** The number of records deleted. */
  deletedCount: Scalars["Int"]["output"];
};

export type DeleteManyTaskStagesInput = {
  /** Filter to find records to delete */
  filter: TaskStageDeleteFilter;
};

export type DeleteManyTasksInput = {
  /** Filter to find records to delete */
  filter: TaskDeleteFilter;
};

export type DeleteManyUsersInput = {
  /** Filter to find records to delete */
  filter: UserDeleteFilter;
};

export type DeleteOneCompanyInput = {
  /** The id of the record to delete. */
  id: Scalars["ID"]["input"];
};

export type DeleteOneContactInput = {
  /** The id of the record to delete. */
  id: Scalars["ID"]["input"];
};

export type DeleteOneDealInput = {
  /** The id of the record to delete. */
  id: Scalars["ID"]["input"];
};

export type DeleteOneDealStageInput = {
  /** The id of the record to delete. */
  id: Scalars["ID"]["input"];
};

export type DeleteOneTaskInput = {
  /** The id of the record to delete. */
  id: Scalars["ID"]["input"];
};

export type DeleteOneTaskStageInput = {
  /** The id of the record to delete. */
  id: Scalars["ID"]["input"];
};

export type DeleteOneUserInput = {
  /** The id of the record to delete. */
  id: Scalars["ID"]["input"];
};

/** Group by */
export type GroupBy = "DAY" | "MONTH" | "WEEK" | "YEAR";

export type IdFilterComparison = {
  eq?: InputMaybe<Scalars["ID"]["input"]>;
  gt?: InputMaybe<Scalars["ID"]["input"]>;
  gte?: InputMaybe<Scalars["ID"]["input"]>;
  iLike?: InputMaybe<Scalars["ID"]["input"]>;
  in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  is?: InputMaybe<Scalars["Boolean"]["input"]>;
  isNot?: InputMaybe<Scalars["Boolean"]["input"]>;
  like?: InputMaybe<Scalars["ID"]["input"]>;
  lt?: InputMaybe<Scalars["ID"]["input"]>;
  lte?: InputMaybe<Scalars["ID"]["input"]>;
  neq?: InputMaybe<Scalars["ID"]["input"]>;
  notILike?: InputMaybe<Scalars["ID"]["input"]>;
  notIn?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  notLike?: InputMaybe<Scalars["ID"]["input"]>;
};

export type IntFieldComparison = {
  between?: InputMaybe<IntFieldComparisonBetween>;
  eq?: InputMaybe<Scalars["Int"]["input"]>;
  gt?: InputMaybe<Scalars["Int"]["input"]>;
  gte?: InputMaybe<Scalars["Int"]["input"]>;
  in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  is?: InputMaybe<Scalars["Boolean"]["input"]>;
  isNot?: InputMaybe<Scalars["Boolean"]["input"]>;
  lt?: InputMaybe<Scalars["Int"]["input"]>;
  lte?: InputMaybe<Scalars["Int"]["input"]>;
  neq?: InputMaybe<Scalars["Int"]["input"]>;
  notBetween?: InputMaybe<IntFieldComparisonBetween>;
  notIn?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

export type IntFieldComparisonBetween = {
  lower: Scalars["Int"]["input"];
  upper: Scalars["Int"]["input"];
};

export type LoginInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type Mutation = {
  createManyCompanies: Array<Company>;
  createManyContacts: Array<Contact>;
  createManyDealStages: Array<DealStage>;
  createManyDeals: Array<Deal>;
  createManyTaskStages: Array<TaskStage>;
  createManyUsers: Array<User>;
  createOneCompany: Company;
  createOneContact: Contact;
  createOneDeal: Deal;
  createOneDealStage: DealStage;
  createOneTask: Task;
  createOneTaskStage: TaskStage;
  createOneUser: User;
  deleteManyCompanies: DeleteManyResponse;
  deleteManyContacts: DeleteManyResponse;
  deleteManyDealStages: DeleteManyResponse;
  deleteManyDeals: DeleteManyResponse;
  deleteManyTaskStages: DeleteManyResponse;
  deleteManyTasks: DeleteManyResponse;
  deleteManyUsers: DeleteManyResponse;
  deleteOneCompany: CompanyDeleteResponse;
  deleteOneContact: ContactDeleteResponse;
  deleteOneDeal: DealDeleteResponse;
  deleteOneDealStage: DealStageDeleteResponse;
  deleteOneTask: TaskDeleteResponse;
  deleteOneTaskStage: TaskStageDeleteResponse;
  deleteOneUser: UserDeleteResponse;
  login: AuthResponse;
  register: User;
  updateManyCompanies: UpdateManyResponse;
  updateManyContacts: UpdateManyResponse;
  updateManyDealStages: UpdateManyResponse;
  updateManyDeals: UpdateManyResponse;
  updateManyTaskStages: UpdateManyResponse;
  updateManyUsers: UpdateManyResponse;
  updateOneCompany: Company;
  updateOneContact: Contact;
  updateOneDeal: Deal;
  updateOneDealStage: DealStage;
  updateOneTask: Task;
  updateOneTaskStage: TaskStage;
  updateOneUser: User;
};

export type MutationCreateManyCompaniesArgs = {
  input: CreateManyCompaniesInput;
};

export type MutationCreateManyContactsArgs = {
  input: CreateManyContactsInput;
};

export type MutationCreateManyDealStagesArgs = {
  input: CreateManyDealStagesInput;
};

export type MutationCreateManyDealsArgs = {
  input: CreateManyDealsInput;
};

export type MutationCreateManyTaskStagesArgs = {
  input: CreateManyTaskStagesInput;
};

export type MutationCreateManyUsersArgs = {
  input: CreateManyUsersInput;
};

export type MutationCreateOneCompanyArgs = {
  input: CreateOneCompanyInput;
};

export type MutationCreateOneContactArgs = {
  input: CreateOneContactInput;
};

export type MutationCreateOneDealArgs = {
  input: CreateOneDealInput;
};

export type MutationCreateOneDealStageArgs = {
  input: CreateOneDealStageInput;
};

export type MutationCreateOneTaskArgs = {
  input: CreateOneTaskInput;
};

export type MutationCreateOneTaskStageArgs = {
  input: CreateOneTaskStageInput;
};

export type MutationCreateOneUserArgs = {
  input: CreateOneUserInput;
};

export type MutationDeleteManyCompaniesArgs = {
  input: DeleteManyCompaniesInput;
};

export type MutationDeleteManyContactsArgs = {
  input: DeleteManyContactsInput;
};

export type MutationDeleteManyDealStagesArgs = {
  input: DeleteManyDealStagesInput;
};

export type MutationDeleteManyDealsArgs = {
  input: DeleteManyDealsInput;
};

export type MutationDeleteManyTaskStagesArgs = {
  input: DeleteManyTaskStagesInput;
};

export type MutationDeleteManyTasksArgs = {
  input: DeleteManyTasksInput;
};

export type MutationDeleteManyUsersArgs = {
  input: DeleteManyUsersInput;
};

export type MutationDeleteOneCompanyArgs = {
  input: DeleteOneCompanyInput;
};

export type MutationDeleteOneContactArgs = {
  input: DeleteOneContactInput;
};

export type MutationDeleteOneDealArgs = {
  input: DeleteOneDealInput;
};

export type MutationDeleteOneDealStageArgs = {
  input: DeleteOneDealStageInput;
};

export type MutationDeleteOneTaskArgs = {
  input: DeleteOneTaskInput;
};

export type MutationDeleteOneTaskStageArgs = {
  input: DeleteOneTaskStageInput;
};

export type MutationDeleteOneUserArgs = {
  input: DeleteOneUserInput;
};

export type MutationLoginArgs = {
  loginInput: LoginInput;
};

export type MutationRegisterArgs = {
  registerInput: RegisterInput;
};

export type MutationUpdateManyCompaniesArgs = {
  input: UpdateManyCompaniesInput;
};

export type MutationUpdateManyContactsArgs = {
  input: UpdateManyContactsInput;
};

export type MutationUpdateManyDealStagesArgs = {
  input: UpdateManyDealStagesInput;
};

export type MutationUpdateManyDealsArgs = {
  input: UpdateManyDealsInput;
};

export type MutationUpdateManyTaskStagesArgs = {
  input: UpdateManyTaskStagesInput;
};

export type MutationUpdateManyUsersArgs = {
  input: UpdateManyUsersInput;
};

export type MutationUpdateOneCompanyArgs = {
  input: UpdateOneCompanyInput;
};

export type MutationUpdateOneContactArgs = {
  input: UpdateOneContactInput;
};

export type MutationUpdateOneDealArgs = {
  input: UpdateOneDealInput;
};

export type MutationUpdateOneDealStageArgs = {
  input: UpdateOneDealStageInput;
};

export type MutationUpdateOneTaskArgs = {
  input: UpdateOneTaskInput;
};

export type MutationUpdateOneTaskStageArgs = {
  input: UpdateOneTaskStageInput;
};

export type MutationUpdateOneUserArgs = {
  input: UpdateOneUserInput;
};

export type NumberFieldComparison = {
  between?: InputMaybe<NumberFieldComparisonBetween>;
  eq?: InputMaybe<Scalars["Float"]["input"]>;
  gt?: InputMaybe<Scalars["Float"]["input"]>;
  gte?: InputMaybe<Scalars["Float"]["input"]>;
  in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  is?: InputMaybe<Scalars["Boolean"]["input"]>;
  isNot?: InputMaybe<Scalars["Boolean"]["input"]>;
  lt?: InputMaybe<Scalars["Float"]["input"]>;
  lte?: InputMaybe<Scalars["Float"]["input"]>;
  neq?: InputMaybe<Scalars["Float"]["input"]>;
  notBetween?: InputMaybe<NumberFieldComparisonBetween>;
  notIn?: InputMaybe<Array<Scalars["Float"]["input"]>>;
};

export type NumberFieldComparisonBetween = {
  lower: Scalars["Float"]["input"];
  upper: Scalars["Float"]["input"];
};

export type OffsetPageInfo = {
  /** true if paging forward and there are more records. */
  hasNextPage?: Maybe<Scalars["Boolean"]["output"]>;
  /** true if paging backwards and there are more records. */
  hasPreviousPage?: Maybe<Scalars["Boolean"]["output"]>;
};

export type OffsetPaging = {
  /** Limit the number of records returned */
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  /** Offset to start returning records from */
  offset?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Query = {
  companies: CompanyConnection;
  company: Company;
  companyAggregate: Array<CompanyAggregateResponse>;
  contact: Contact;
  contacts: ContactConnection;
  deal: Deal;
  dealAggregate: Array<DealAggregateResponse>;
  dealStage: DealStage;
  dealStages: DealStageConnection;
  deals: DealConnection;
  me: User;
  task: Task;
  taskStage: TaskStage;
  taskStages: TaskStageConnection;
  tasks: TaskConnection;
  user: User;
  users: UserConnection;
};

export type QueryCompaniesArgs = {
  filter?: CompanyFilter;
  paging?: OffsetPaging;
  sorting?: Array<CompanySort>;
};

export type QueryCompanyArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryCompanyAggregateArgs = {
  filter?: InputMaybe<CompanyAggregateFilter>;
};

export type QueryContactArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryContactsArgs = {
  filter?: ContactFilter;
  paging?: OffsetPaging;
  sorting?: Array<ContactSort>;
};

export type QueryDealArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryDealAggregateArgs = {
  filter?: InputMaybe<DealAggregateFilter>;
};

export type QueryDealStageArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryDealStagesArgs = {
  filter?: DealStageFilter;
  paging?: OffsetPaging;
  sorting?: Array<DealStageSort>;
};

export type QueryDealsArgs = {
  filter?: DealFilter;
  paging?: OffsetPaging;
  sorting?: Array<DealSort>;
};

export type QueryTaskArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryTaskStageArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryTaskStagesArgs = {
  filter?: TaskStageFilter;
  paging?: OffsetPaging;
  sorting?: Array<TaskStageSort>;
};

export type QueryTasksArgs = {
  filter?: TaskFilter;
  paging?: OffsetPaging;
  sorting?: Array<TaskSort>;
};

export type QueryUserArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryUsersArgs = {
  filter?: UserFilter;
  paging?: OffsetPaging;
  sorting?: Array<UserSort>;
};

export type RegisterInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type Role = "ADMIN" | "SALES_INTERN" | "SALES_MANAGER" | "SALES_PERSON";

export type RoleFilterComparison = {
  eq?: InputMaybe<Role>;
  gt?: InputMaybe<Role>;
  gte?: InputMaybe<Role>;
  iLike?: InputMaybe<Role>;
  in?: InputMaybe<Array<Role>>;
  is?: InputMaybe<Scalars["Boolean"]["input"]>;
  isNot?: InputMaybe<Scalars["Boolean"]["input"]>;
  like?: InputMaybe<Role>;
  lt?: InputMaybe<Role>;
  lte?: InputMaybe<Role>;
  neq?: InputMaybe<Role>;
  notILike?: InputMaybe<Role>;
  notIn?: InputMaybe<Array<Role>>;
  notLike?: InputMaybe<Role>;
};

/** Sort Directions */
export type SortDirection = "ASC" | "DESC";

/** Sort Nulls Options */
export type SortNulls = "NULLS_FIRST" | "NULLS_LAST";

export type StringFieldComparison = {
  eq?: InputMaybe<Scalars["String"]["input"]>;
  gt?: InputMaybe<Scalars["String"]["input"]>;
  gte?: InputMaybe<Scalars["String"]["input"]>;
  iLike?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  is?: InputMaybe<Scalars["Boolean"]["input"]>;
  isNot?: InputMaybe<Scalars["Boolean"]["input"]>;
  like?: InputMaybe<Scalars["String"]["input"]>;
  lt?: InputMaybe<Scalars["String"]["input"]>;
  lte?: InputMaybe<Scalars["String"]["input"]>;
  neq?: InputMaybe<Scalars["String"]["input"]>;
  notILike?: InputMaybe<Scalars["String"]["input"]>;
  notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
  notLike?: InputMaybe<Scalars["String"]["input"]>;
};

export type Task = {
  checklist: Array<CheckListItem>;
  completed: Scalars["Boolean"]["output"];
  contacts: Array<Contact>;
  createdAt: Scalars["DateTime"]["output"];
  createdBy?: Maybe<User>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  dueDate?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  stage?: Maybe<TaskStage>;
  stageId?: Maybe<Scalars["ID"]["output"]>;
  title: Scalars["String"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
  users: Array<User>;
};

export type TaskConnection = {
  /** Array of nodes. */
  nodes: Array<Task>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars["Int"]["output"];
};

export type TaskDeleteFilter = {
  and?: InputMaybe<Array<TaskDeleteFilter>>;
  completed?: InputMaybe<BooleanFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  description?: InputMaybe<StringFieldComparison>;
  dueDate?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<TaskDeleteFilter>>;
  stageId?: InputMaybe<IdFilterComparison>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type TaskDeleteResponse = {
  checklist?: Maybe<Array<CheckListItem>>;
  completed?: Maybe<Scalars["Boolean"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  dueDate?: Maybe<Scalars["DateTime"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  stageId?: Maybe<Scalars["ID"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type TaskFilter = {
  and?: InputMaybe<Array<TaskFilter>>;
  completed?: InputMaybe<BooleanFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdBy?: InputMaybe<TaskFilterUserFilter>;
  createdById?: InputMaybe<StringFieldComparison>;
  description?: InputMaybe<StringFieldComparison>;
  dueDate?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<TaskFilter>>;
  stage?: InputMaybe<TaskFilterTaskStageFilter>;
  stageId?: InputMaybe<IdFilterComparison>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type TaskFilterTaskStageFilter = {
  and?: InputMaybe<Array<TaskFilterTaskStageFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<TaskFilterTaskStageFilter>>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type TaskFilterUserFilter = {
  and?: InputMaybe<Array<TaskFilterUserFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<TaskFilterUserFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  role?: InputMaybe<RoleFilterComparison>;
  source?: InputMaybe<UserSourceFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type TaskSort = {
  direction: SortDirection;
  field: TaskSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export type TaskSortFields =
  | "completed"
  | "createdAt"
  | "createdById"
  | "description"
  | "dueDate"
  | "id"
  | "stageId"
  | "title"
  | "updatedAt";

export type TaskStage = {
  createdAt: Scalars["DateTime"]["output"];
  createdBy?: Maybe<User>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  title: Scalars["String"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
};

export type TaskStageConnection = {
  /** Array of nodes. */
  nodes: Array<TaskStage>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars["Int"]["output"];
};

export type TaskStageDeleteFilter = {
  and?: InputMaybe<Array<TaskStageDeleteFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<TaskStageDeleteFilter>>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type TaskStageDeleteResponse = {
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type TaskStageFilter = {
  and?: InputMaybe<Array<TaskStageFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdBy?: InputMaybe<TaskStageFilterUserFilter>;
  createdById?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<TaskStageFilter>>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type TaskStageFilterUserFilter = {
  and?: InputMaybe<Array<TaskStageFilterUserFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<TaskStageFilterUserFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  role?: InputMaybe<RoleFilterComparison>;
  source?: InputMaybe<UserSourceFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type TaskStageSort = {
  direction: SortDirection;
  field: TaskStageSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export type TaskStageSortFields =
  "createdAt" | "createdById" | "id" | "title" | "updatedAt";

export type TaskStageUpdateFilter = {
  and?: InputMaybe<Array<TaskStageUpdateFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  createdById?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<TaskStageUpdateFilter>>;
  title?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type UpdateCompanyInput = {
  businessType?: InputMaybe<BusinessType>;
  companySize?: InputMaybe<CompanySize>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  createdById?: InputMaybe<Scalars["ID"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  salesOwnerId?: InputMaybe<Scalars["ID"]["input"]>;
  totalRevenue?: InputMaybe<Scalars["Float"]["input"]>;
  website?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateContactInput = {
  companyName?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  jobTitle?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  phone?: InputMaybe<Scalars["String"]["input"]>;
  salesOwnerId?: InputMaybe<Scalars["ID"]["input"]>;
  score?: InputMaybe<Scalars["Float"]["input"]>;
  status?: InputMaybe<ContactStatus>;
  timezone?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateDealInput = {
  closeDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  companyId?: InputMaybe<Scalars["ID"]["input"]>;
  dealContactId?: InputMaybe<Scalars["ID"]["input"]>;
  dealOwnerId?: InputMaybe<Scalars["ID"]["input"]>;
  stageId?: InputMaybe<Scalars["ID"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  value?: InputMaybe<Scalars["Float"]["input"]>;
};

export type UpdateDealStageInput = {
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateManyCompaniesInput = {
  /** Filter used to find fields to update */
  filter: CompanyUpdateFilter;
  /** The update to apply to all records found using the filter */
  update: UpdateCompanyInput;
};

export type UpdateManyContactsInput = {
  /** Filter used to find fields to update */
  filter: ContactUpdateFilter;
  /** The update to apply to all records found using the filter */
  update: UpdateContactInput;
};

export type UpdateManyDealStagesInput = {
  /** Filter used to find fields to update */
  filter: DealStageUpdateFilter;
  /** The update to apply to all records found using the filter */
  update: UpdateDealStageInput;
};

export type UpdateManyDealsInput = {
  /** Filter used to find fields to update */
  filter: DealUpdateFilter;
  /** The update to apply to all records found using the filter */
  update: UpdateDealInput;
};

export type UpdateManyResponse = {
  /** The number of records updated. */
  updatedCount: Scalars["Int"]["output"];
};

export type UpdateManyTaskStagesInput = {
  /** Filter used to find fields to update */
  filter: TaskStageUpdateFilter;
  /** The update to apply to all records found using the filter */
  update: UpdateTaskStageInput;
};

export type UpdateManyUsersInput = {
  /** Filter used to find fields to update */
  filter: UserUpdateFilter;
  /** The update to apply to all records found using the filter */
  update: UpdateUserInput;
};

export type UpdateOneCompanyInput = {
  /** The id of the record to update */
  id: Scalars["ID"]["input"];
  /** The update to apply. */
  update: UpdateCompanyInput;
};

export type UpdateOneContactInput = {
  /** The id of the record to update */
  id: Scalars["ID"]["input"];
  /** The update to apply. */
  update: UpdateContactInput;
};

export type UpdateOneDealInput = {
  /** The id of the record to update */
  id: Scalars["ID"]["input"];
  /** The update to apply. */
  update: UpdateDealInput;
};

export type UpdateOneDealStageInput = {
  /** The id of the record to update */
  id: Scalars["ID"]["input"];
  /** The update to apply. */
  update: UpdateDealStageInput;
};

export type UpdateOneTaskInput = {
  id: Scalars["ID"]["input"];
  update: UpdateTaskInput;
};

export type UpdateOneTaskStageInput = {
  /** The id of the record to update */
  id: Scalars["ID"]["input"];
  /** The update to apply. */
  update: UpdateTaskStageInput;
};

export type UpdateOneUserInput = {
  /** The id of the record to update */
  id: Scalars["ID"]["input"];
  /** The update to apply. */
  update: UpdateUserInput;
};

export type UpdateTaskInput = {
  checklist?: InputMaybe<Array<ChecklistItemInput>>;
  completed?: InputMaybe<Scalars["Boolean"]["input"]>;
  contactIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  stageId?: InputMaybe<Scalars["ID"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  userIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type UpdateTaskStageInput = {
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars["String"]["input"]>;
  jobTitle?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  phone?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Role>;
  source?: InputMaybe<UserSource>;
  timezone?: InputMaybe<Scalars["String"]["input"]>;
};

export type User = {
  avatarUrl?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  jobTitle?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  phone?: Maybe<Scalars["String"]["output"]>;
  role: Role;
  source: UserSource;
  timezone?: Maybe<Scalars["String"]["output"]>;
  updatedAt: Scalars["DateTime"]["output"];
};

export type UserConnection = {
  /** Array of nodes. */
  nodes: Array<User>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars["Int"]["output"];
};

export type UserDeleteFilter = {
  and?: InputMaybe<Array<UserDeleteFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<UserDeleteFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  role?: InputMaybe<RoleFilterComparison>;
  source?: InputMaybe<UserSourceFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type UserDeleteResponse = {
  avatarUrl?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  jobTitle?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  phone?: Maybe<Scalars["String"]["output"]>;
  role?: Maybe<Role>;
  source?: Maybe<UserSource>;
  timezone?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type UserFilter = {
  and?: InputMaybe<Array<UserFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<UserFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  role?: InputMaybe<RoleFilterComparison>;
  source?: InputMaybe<UserSourceFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type UserSort = {
  direction: SortDirection;
  field: UserSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export type UserSortFields =
  | "avatarUrl"
  | "createdAt"
  | "email"
  | "id"
  | "jobTitle"
  | "name"
  | "phone"
  | "role"
  | "source"
  | "timezone"
  | "updatedAt";

export type UserSource = "SALES_OWNER" | "TASK_MEMBER";

export type UserSourceFilterComparison = {
  eq?: InputMaybe<UserSource>;
  gt?: InputMaybe<UserSource>;
  gte?: InputMaybe<UserSource>;
  iLike?: InputMaybe<UserSource>;
  in?: InputMaybe<Array<UserSource>>;
  is?: InputMaybe<Scalars["Boolean"]["input"]>;
  isNot?: InputMaybe<Scalars["Boolean"]["input"]>;
  like?: InputMaybe<UserSource>;
  lt?: InputMaybe<UserSource>;
  lte?: InputMaybe<UserSource>;
  neq?: InputMaybe<UserSource>;
  notILike?: InputMaybe<UserSource>;
  notIn?: InputMaybe<Array<UserSource>>;
  notLike?: InputMaybe<UserSource>;
};

export type UserUpdateFilter = {
  and?: InputMaybe<Array<UserUpdateFilter>>;
  avatarUrl?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  jobTitle?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<UserUpdateFilter>>;
  phone?: InputMaybe<StringFieldComparison>;
  role?: InputMaybe<RoleFilterComparison>;
  source?: InputMaybe<UserSourceFilterComparison>;
  timezone?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};
