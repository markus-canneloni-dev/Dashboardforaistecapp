import { TitleBar } from './components/glacier/TitleBar';
import { Taskbar } from './components/glacier/Taskbar';
import { Header } from './components/glacier/Header';
import { KPICard } from './components/glacier/KPICard';
import { MapPanel } from './components/glacier/MapPanel';
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

          {/* Header */}
          <Header />

          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <KPICard
              label="Risk score"
              value={74}
              unit="/100"
              delta="↑ Accelerating · High tier"
              type="red"
              deltaType="up"
            />
            <KPICard
              label="Lake area 2024"
              value={2.41}
              unit="km²"
              delta="↑ +0.18 km² vs 2023 (+8.1%)"
              type="blue"
              deltaType="up"
            />
            <KPICard
              label="GLOF probability / 5yr"
              value={12}
              unit="%"
              delta="↑ Above baseline threshold"
              type="amber"
              deltaType="up"
            />
          </div>

          {/* Full Width Map */}
          <MapPanel />

          {/* Dropdowns */}
          <DropdownSection title="Downstream Infrastructure">
            <InfrastructureDropdown />
          </DropdownSection>

        </div>
      </div>

      <Taskbar />
    </div>
  );
}