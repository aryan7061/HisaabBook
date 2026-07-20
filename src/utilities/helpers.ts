import dayjs from "dayjs";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { CrudFilter } from "@refinedev/core";

import { DashboardDealsChartQuery } from "@/graphql/types";
import { DEMO_ACCOUNT_EMAIL } from "@/providers";

type DealStage = GetFieldsFromList<DashboardDealsChartQuery>;

type DealAggregate = DealStage["dealsAggregate"][0];

interface MappedDealData {
  timeUnix: number;
  timeText: string;
  value: number;
  state: string;
}

export const getDate = (startDate: string, endDate: string) => {
  const start = dayjs(startDate).format("MMM DD, YYYY - HH:mm");
  const end = dayjs(endDate).format("MMM DD, YYYY - HH:mm");

  return `${start} - ${end}`;
};

export const formatIndianCurrency = (value: number): string => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(2)} K`;
  }
  return `₹${value}`;
};

export const isDemoAccount = (email?: string): boolean => {
  return email === DEMO_ACCOUNT_EMAIL;
};

// Scopes a "pick a person" select (Sales Owner, Task assignees, etc.) to
// people the current user created. Demo account is exempt and sees the
// full shared roster, same as every other scoped resource in this app.
// This intentionally uses only a single plain field filter — the same
// shape already proven to work for Companies/Tasks/Contacts — rather than
// a logical "or" filter, since that construct was not verified against
// this data provider and caused real breakage when tried.
export const buildUserScopeFilters = (
  identityId?: string,
  isDemo?: boolean,
): CrudFilter[] => {
  if (isDemo || !identityId) return [];

  return [{ field: "createdBy.id", operator: "eq", value: identityId }];
};

const filterDeal = (deal?: DealAggregate) =>
  deal?.groupBy && deal.groupBy?.closeDateMonth && deal.groupBy?.closeDateYear;

const mapDeals = (
  deals: DealAggregate[] = [],
  state: string,
): MappedDealData[] => {
  return deals.filter(filterDeal).map((deal) => {
    const { closeDateMonth, closeDateYear } = deal.groupBy as NonNullable<
      DealAggregate["groupBy"]
    >;

    const date = dayjs(`${closeDateYear}-${closeDateMonth}-01`);

    return {
      timeUnix: date.unix(),
      timeText: date.format("MMM YYYY"),
      value: deal.sum?.value ?? 0,
      state,
    };
  });
};

export const mapDealsData = (
  dealStages: DealStage[] = [],
): MappedDealData[] => {
  const won = dealStages.find((stage) => stage.title === "WON");
  const wonDeals = mapDeals(won?.dealsAggregate, "Won");

  const lost = dealStages.find((stage) => stage.title === "LOST");
  const lostDeals = mapDeals(lost?.dealsAggregate, "Lost");

  return [...wonDeals, ...lostDeals].sort((a, b) => a.timeUnix - b.timeUnix);
};