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
import { App as AntdApp, Spin } from "antd";
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

// Forces a hard-reload/restart to always land on the dashboard when the
// stale route is just a list-level page (e.g. someone left /companies or
// /tasks open in a forgotten tab). Genuine deep links to a specific record
// (e.g. /companies/edit/42, /tasks/edit/7) are left untouched, since those
// are intentional bookmarks/shared links, not stale tabs. Runs exactly once
// per mount (i.e. once per hard refresh) since the dependency array is
// empty — it never fires again during normal client-side navigation within
// the same session.
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
            <DocumentTitleHandler />
          </Refine>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
