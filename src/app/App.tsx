import { TitleBar } from './components/glacier/TitleBar';
import { Taskbar } from './components/glacier/Taskbar';
import { Header } from './components/glacier/Header';
import { KPICard } from './components/glacier/KPICard';
import { MapPanel } from './components/glacier/MapPanel';
import { RiskScoreBreakdown } from './components/glacier/RiskScoreBreakdown';
import { DropdownSection } from './components/glacier/DropdownSection';
import { InfrastructureDropdown } from './components/glacier/InfrastructureDropdown';

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{
      fontFamily: "'DM Sans', sans-serif",
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #fef3c7 100%)',
      color: 'var(--text)'
    }}>
      <TitleBar />

      <div className="flex flex-col pb-12">
        <div className="flex-1 flex flex-col p-5 gap-4 max-w-[1440px] w-full mx-auto">

          {/* Header and Risk Score Row */}
          <div className="flex items-start justify-between gap-6">
            <Header />
            <div className="w-80 flex-shrink-0">
              <KPICard
                label="RISK SCORE"
                value={0.86}
                unit="/ 1"
                delta="↑ Accelerating · High tier"
                type="red"
                deltaType="up"
              />
            </div>
          </div>

          {/* Tabbed Interface with Map and Risk Analysis */}
          <MapPanel />

          {/* These sections are now inside MapPanel based on tab selection */}

        </div>
      </div>

      <Taskbar />
    </div>
  );
}