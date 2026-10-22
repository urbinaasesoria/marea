import { useEffect, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { StoreProvider, useStore } from "./store/StoreProvider";
import { I18nProvider } from "./i18n/I18nProvider";
import { ToastProvider } from "./components/ToastProvider";
import { AppShell } from "./components/AppShell";
import { Landing } from "./pages/Landing";
import { Legal } from "./pages/Legal";
import { Today } from "./pages/Today";
import { Library } from "./pages/Library";
import { Player } from "./pages/Player";
import { Breathe } from "./pages/Breathe";
import { Sleep } from "./pages/Sleep";
import { Focus } from "./pages/Focus";
import { Journal } from "./pages/Journal";
import { Progress } from "./pages/Progress";
import { Courses } from "./pages/Courses";
import { CourseDetail } from "./pages/CourseDetail";
import { Settings } from "./pages/Settings";
import { Onboarding } from "./pages/Onboarding";
import { NotFound } from "./pages/NotFound";

function RequireProfile({ children }: { children: ReactNode }) {
  const { data } = useStore();
  const location = useLocation();

  if (!data.profile.onboarded) {
    return <Navigate to="/onboarding" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/app"
          element={
            <RequireProfile>
              <AppShell />
            </RequireProfile>
          }
        >
          <Route index element={<Today />} />
          <Route path="library" element={<Library />} />
          <Route path="breathe" element={<Breathe />} />
          <Route path="sleep" element={<Sleep />} />
          <Route path="focus" element={<Focus />} />
          <Route path="journal" element={<Journal />} />
          <Route path="progress" element={<Progress />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route
          path="/app/practice/:id"
          element={
            <RequireProfile>
              <Player />
            </RequireProfile>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <I18nProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </I18nProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}
