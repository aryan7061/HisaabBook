import { lazy, Suspense, useEffect } from "react";

import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { dataProvider, liveProvider, authProvider } from "./providers";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp, ConfigProvider, Spin } from "antd";
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import Layout from "./components/layout";
import { resources } from "./config/resources";
import { hisaabBookTheme } from "./config/theme";

const Home = lazy(() => import("./pages").then((m) => ({ default: m.Home })));
const ForgotPassword = lazy(() =>
  import("./pages").then((m) => ({ default: m.ForgotPassword })),
);
const Login = lazy(() => import("./pages").then((m) => ({ default: m.Login })));
const Register = lazy(() =>
  import("./pages").then((m) => ({ default: m.Register })),
);
const CompanyList = lazy(() =>
  import("./pages").then((m) => ({ default: m.CompanyList })),
);
const Create = lazy(() =>
  import("./pages").then((m) => ({ default: m.Create })),
);
const EditPage = lazy(() =>
  import("./pages").then((m) => ({ default: m.EditPage })),
);
const List = lazy(() =>
  import("./pages/tasks/list").then((m) => ({ default: m.List })),
);
const TasksCreatePage = lazy(() => import("./pages/tasks/create"));
const TasksEditPage = lazy(() => import("./pages/tasks/edit"));
const CompleteProfile = lazy(() => import("./pages/complete-profile"));

const SuspenseFallback = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    }}
  >
    <Spin size="large" />
  </div>
);

const APP_NAME = "HisaabBook";

const customTitleHandler = ({
  resource,
  action,
  params,
  pathname,
}: {
  resource?: { name: string; meta?: { label?: string } };
  action?: string;
  params?: { id?: string };
  pathname?: string;
}) => {
  if (!resource) {
    if (pathname === "/login") return `Sign in | ${APP_NAME}`;
    if (pathname === "/register") return `Sign up | ${APP_NAME}`;
    if (pathname === "/forgot-password") return `Reset password | ${APP_NAME}`;
    if (pathname === "/complete-profile")
      return `Complete your profile | ${APP_NAME}`;
    return APP_NAME;
  }

  const label = resource.meta?.label ?? resource.name;
  const actionPrefix: Record<string, string> = {
    create: "Create ",
    edit: "Edit ",
  };
  const prefix = action ? (actionPrefix[action] ?? "") : "";
  const id = params?.id ? ` #${params.id}` : "";

  return `${prefix}${label}${id} | ${APP_NAME}`;
};

const DEEP_LINK_PATTERNS = [/^\/companies\/edit\/.+$/, /^\/tasks\/edit\/.+$/];

const ForceDashboardOnLoad = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isDeepLink = DEEP_LINK_PATTERNS.some((pattern) =>
      pattern.test(location.pathname),
    );

    if (location.pathname !== "/" && !isDeepLink) {
      navigate("/", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ConfigProvider theme={hisaabBookTheme}>
          <AntdApp>
            <Refine
              dataProvider={dataProvider}
              liveProvider={liveProvider}
              notificationProvider={useNotificationProvider}
              routerProvider={routerProvider}
              authProvider={authProvider}
              resources={resources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "Sqq7yH-8CrWAY-jKvPMW",
                liveMode: "auto",
              }}
            >
              <Suspense fallback={<SuspenseFallback />}>
                <Routes>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  <Route
                    path="/complete-profile"
                    element={
                      <Authenticated
                        key="complete-profile"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <CompleteProfile />
                      </Authenticated>
                    }
                  />

                  <Route
                    element={
                      <Authenticated
                        key="authenticated-layout"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ForceDashboardOnLoad />
                        <Layout>
                          <Outlet />
                        </Layout>
                      </Authenticated>
                    }
                  >
                    <Route index element={<Home />} />
                    <Route path="/companies">
                      <Route index element={<CompanyList />} />
                      <Route path="new" element={<Create />} />
                      <Route path="edit/:id" element={<EditPage />} />
                    </Route>
                    <Route
                      path="/tasks"
                      element={
                        <List>
                          <Outlet />
                        </List>
                      }
                    >
                      <Route path="new" element={<TasksCreatePage />} />
                      <Route path="edit/:id" element={<TasksEditPage />} />
                    </Route>
                  </Route>
                </Routes>
              </Suspense>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler handler={customTitleHandler} />
            </Refine>
          </AntdApp>
        </ConfigProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
