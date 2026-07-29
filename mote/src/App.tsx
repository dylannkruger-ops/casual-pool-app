import { Route, Routes, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
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
  ['/approvals', 'Needs your yes'],
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
  const isHome = pathname === '/';

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader title={title} />
        <main className="min-w-0 flex-1 overflow-y-auto">
          {/* One comfortable reading column, centred. The widget used to float
              over this area, so the layout reserved a 332px gutter for it; the
              widget is docked in the sidebar now and the space came back. */}
          <div
            className={`mx-auto px-5 pb-52 sm:px-8 lg:pb-16 ${
              isHome ? 'max-w-3xl py-2 lg:py-6' : 'max-w-4xl py-4 lg:py-12'
            }`}
          >
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
      <MobileTabBar />
    </div>
  );
}
