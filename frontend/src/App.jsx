import { Suspense, lazy } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));

const App = () => (
  <Suspense fallback={<div className="app-shell">Loading...</div>}>
    <HomePage />
  </Suspense>
);

export default App;
