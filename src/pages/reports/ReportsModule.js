/* eslint-disable no-unused-vars */
import React from 'react';
import { useClients, useTickets } from '../../services/finops';

export default function ReportsModule() {
  const CLIENTS = useClients();
  const TICKETS = useTickets();
  const hasData = CLIENTS.length > 0 || TICKETS.length > 0;

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Reports & Analytics</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Clients', value: CLIENTS.length },
          { label: 'Total Tickets', value: TICKETS.length },
          { label: 'Open Tickets', value: TICKETS.filter((t) => t.stage !== 'approved').length },
          { label: 'Completed', value: TICKETS.filter((t) => t.stage === 'approved').length },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {!hasData ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-sm">No report data yet.</p>
          <p className="text-gray-400 text-xs mt-2">Onboard clients and create tickets — charts will populate as you add data.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600">
            Live counts from your workspace. Advanced revenue charts will be added in a future release.
          </p>
        </div>
      )}
    </div>
  );
}
