import { Route, Routes } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { FaceWidget } from './components/FaceWidget';
import { Home, ProjectView } from './routes/Home';
import { TaskView } from './routes/TaskView';
import { Team } from './routes/Team';
import { EmployeePage } from './routes/EmployeePage';
import { Approvals } from './routes/Approvals';
import { RunDetail, Runs } from './routes/Runs';
import { Performance } from './routes/Performance';
import { PlanPage } from './routes/Plan';
import { Trust } from './routes/Trust';
import { Settings } from './routes/Settings';

export default function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Right gutter is reserved for the widget, which floats above everything. */}
        <div className="max-w-5xl px-8 py-10 pb-40 xl:pr-[332px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/task/:id" element={<TaskView />} />
            <Route path="/project/:id" element={<ProjectView />} />
            <Route path="/team" element={<Team />} />
            <Route path="/employee/:id" element={<EmployeePage />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/runs" element={<Runs />} />
            <Route path="/runs/:id" element={<RunDetail />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/plan" element={<PlanPage />} />
            <Route path="/trust" element={<Trust />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
      <FaceWidget />
    </div>
  );
}
