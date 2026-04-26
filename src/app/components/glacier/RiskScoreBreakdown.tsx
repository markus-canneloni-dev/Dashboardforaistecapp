const riskComponents = [
  {
    name: 'Behaviour Score',
    value: 0.78,
    explanation: 'Measures how unusually the lake is changing over time, especially growth, acceleration, and persistent anomalies.'
  },
  {
    name: 'Susceptibility Score',
    value: 0.91,
    explanation: 'Measures how physically prone the lake setting is to failure based on dam type, glacier proximity, slope, and freeboard.'
  },
  {
    name: 'Trigger Score',
    value: 0.88,
    explanation: 'Measures whether nearby conditions could suddenly destabilize the lake, such as steep slopes, rockfall risk, or SAR-detected ground movement.'
  },
  {
    name: 'Exposure Score',
    value: 0.82,
    explanation: 'Measures how many important downstream assets could be affected if water or debris follows the modeled flow path.'
  },
  {
    name: 'Confidence Score',
    value: 0.71,
    explanation: 'Measures how reliable the assessment is based on data quality, valid observations, cloud/snow gaps, and sensor agreement.'
  },
];

function getScoreColor(value: number) {
  if (value >= 0.85) return { bg: 'rgba(220,38,38,0.1)', text: '#dc2626', bar: '#dc2626' }; // High - red
  if (value >= 0.75) return { bg: 'rgba(245,166,35,0.1)', text: '#f59e0b', bar: '#f59e0b' }; // Medium - orange
  return { bg: 'rgba(16,185,129,0.1)', text: '#10b981', bar: '#10b981' }; // Low - green
}

function getRiskLevel(value: number): { level: string; color: string; bg: string } {
  if (value > 0.65) return { level: 'High Risk', color: '#dc2626', bg: 'rgba(220,38,38,0.1)' };
  if (value > 0.3) return { level: 'Medium Risk', color: '#f59e0b', bg: 'rgba(245,166,35,0.1)' };
  return { level: 'Low Risk', color: '#10b981', bg: 'rgba(16,185,129,0.1)' };
}

export function RiskScoreBreakdown() {
  const overallScore = 0.86;
  const riskLevel = getRiskLevel(overallScore);

  return (
    <div>
      <div className="mb-3">
        <div className="text-[14px] uppercase tracking-wider"
          style={{ color: 'var(--text-dim)' }}>
          Risk Score Components
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-4">
          {riskComponents.map((component, index) => {
            const colors = getScoreColor(component.value);
            const percentage = component.value * 100;

            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="text-[15px]" style={{ color: 'var(--text)' }}>
                    {component.name}
                  </div>
                  <div className="text-[15px] font-mono" style={{ color: colors.text }}>
                    {component.value.toFixed(2)}
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden"
                  style={{ background: 'var(--glacier-border)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      background: colors.bar
                    }}
                  />
                </div>
                <div className="text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {component.explanation}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t"
          style={{ borderColor: 'var(--glacier-border)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[14px]" style={{ color: 'var(--text-dim)' }}>
              Overall Risk Score
            </div>
            <div className="text-[17px] font-mono px-3 py-1.5 rounded"
              style={{
                background: riskLevel.bg,
                color: riskLevel.color,
                border: `0.5px solid ${riskLevel.color}`
              }}>
              {overallScore.toFixed(2)} / 1.0
            </div>
          </div>
          <div className="text-[13px] px-3 py-2 rounded"
            style={{
              background: riskLevel.bg,
              color: riskLevel.color,
              border: `0.5px solid ${riskLevel.color}`
            }}>
            <div className="mb-1.5">Rating: <strong>{riskLevel.level}</strong></div>
            <div className="text-[12px] opacity-90">
              • 0 - 0.30: Low Risk<br/>
              • 0.30 - 0.65: Medium Risk<br/>
              • &gt; 0.65: High Risk
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
