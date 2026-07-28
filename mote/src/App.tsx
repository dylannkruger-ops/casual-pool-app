import { Route, Routes, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { FaceWidget } from './components/FaceWidget';
import { MobileHeader, MobileTabBar } from './components/MobileChrome';
import { Home, History, ProjectView } from './routes/Home';
import { TaskView } from './routes/TaskView';
import { Team } from './routes/Team';
import { EmployeePage } from './routes/EmployeePage';
import { Approvals } from './routes/Approvals';
import { RunDetail, Runs } from './routes/Runs';
import { Performance } from './routes/Performance';
import { PlanPage } from './routes/Plan';
import { Trust } from './routes/Trust';
import { Settings } from './routes/Settings';
import { Connectors } from './routes/Connectors';
import { Spend } from './routes/Spend';

const TITLES: [string, string][] = [
  ['/history', 'History'],
  ['/team', 'Your team'],
  ['/employee', 'Profile'],
  ['/approvals', 'Approvals'],
  ['/connectors', 'Connectors'],
  ['/spend', 'Spend guard'],
  ['/runs', 'Work log'],
  ['/performance', 'Performance'],
  ['/trust', 'Privacy'],
  ['/settings', 'Settings'],
  ['/plan', 'Plan'],
  ['/task', 'Task'],
  ['/project', 'Project'],
];

export default function App() {
  const { pathname } = useLocation();
  const title = TITLES.find(([p]) => pathname.startsWith(p))?.[1] ?? 'Home';

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader title={title} />
        <main className="flex-1 overflow-y-auto">
          {/* Right gutter is reserved for the widget, which floats above everything.
              On a phone the widget becomes a strip above the tab bar instead. */}
          <div className="max-w-5xl px-5 py-4 pb-44 sm:px-8 lg:py-10 xl:pr-[332px]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/history" element={<History />} />
              <Route path="/task/:id" element={<TaskView />} />
              <Route path="/project/:id" element={<ProjectView />} />
              <Route path="/team" element={<Team />} />
              <Route path="/employee/:id" element={<EmployeePage />} />
              <Route path="/approvals" element={<Approvals />} />
              <Route path="/connectors" element={<Connectors />} />
              <Route path="/spend" element={<Spend />} />
              <Route path="/runs" element={<Runs />} />
              <Route path="/runs/:id" element={<RunDetail />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/plan" element={<PlanPage />} />
              <Route path="/trust" element={<Trust />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
      <FaceWidget />
      <MobileTabBar />
    </div>
  );
}
