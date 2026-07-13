import {
  DashboardTotalCountCard,
  DealsChart,
  LatestActivities,
  UpcomingEvents,
} from "@/components";
import { DASHBOARD_TOTAL_COUNTS_QUERY } from "@/graphql/queries";
import { DashboardTotalCountsQuery } from "@/graphql/types";
import { isDemoAccount } from "@/utilities/helpers";
import { useCustom, useGetIdentity } from "@refinedev/core";
import { Col, Row } from "antd";

type Identity = {
  id: string;
  email: string;
};

export const Home = () => {
  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();

  const isDemo = isDemoAccount(identity?.email);

  const { query } = useCustom<DashboardTotalCountsQuery>({
    url: "",
    method: "get",
    meta: {
      gqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY,
      variables: {
        companiesFilter: isDemo
          ? {}
          : { createdBy: { id: { eq: identity?.id } } },
        contactsFilter: isDemo
          ? {}
          : { createdBy: { id: { eq: identity?.id } } },
        dealsFilter: isDemo ? {} : { dealOwnerId: { eq: identity?.id } },
      },
    },
    queryOptions: {
      enabled: !!identity?.id,
    },
  });

  const isLoading = identityLoading || query.isLoading;

  return (
    <div>
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="companies"
            isLoading={isLoading}
            totalCount={query.data?.data.companies.totalCount ?? 0}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="contacts"
            isLoading={isLoading}
            totalCount={query.data?.data.contacts.totalCount ?? 0}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="deals"
            isLoading={isLoading}
            totalCount={query.data?.data.deals.totalCount ?? 0}
          />
        </Col>
      </Row>

      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24} sm={24} xl={8} style={{ height: "460px" }}>
          <UpcomingEvents />
        </Col>
        <Col xs={24} sm={24} xl={16} style={{ height: "460px" }}>
          <DealsChart />
        </Col>
      </Row>

      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24} sm={24} xl={24}>
          <LatestActivities />
        </Col>
      </Row>
    </div>
  );
};
