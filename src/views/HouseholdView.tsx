import React from 'react';
import {
  Users,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  UserCheck,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Role } from '../types';

export const HouseholdView: React.FC = () => {
  const {
    t,
    members,
    activeMember,
    setActiveMember,
    auditLog,
    settings,
  } = useFinance();

  const permissionsMatrix: { feature: string; admin: boolean; contributor: boolean; viewer: boolean }[] = [
    { feature: 'Kurekodi Mapato na Matumizi (Record Tx)', admin: true, contributor: true, viewer: false },
    { feature: 'Kuhariri Miamala (Edit Tx)', admin: true, contributor: true, viewer: false },
    { feature: 'Kufuta Miamala ya Fedha (Delete Tx)', admin: true, contributor: false, viewer: false },
    { feature: 'Kurekebisha Viwango vya Bajeti (Edit Budgets)', admin: true, contributor: false, viewer: false },
    { feature: 'Kuongeza Pochi au Akaunti za Benki (Manage Wallets)', admin: true, contributor: false, viewer: false },
    { feature: 'Kuweka Akiba kwenye Malengo (Deposit Goals)', admin: true, contributor: true, viewer: false },
    { feature: 'Kupakua Nakala ya CSV & JSON (Export Data)', admin: true, contributor: true, viewer: true },
    { feature: 'Kurejesha au Kufuta Mfumo (Reset Vault)', admin: true, contributor: false, viewer: false },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text">
          {t('hhTitle')}
        </h1>
        <p className="text-xs text-text-muted mt-0.5">{t('hhSubtitle')}</p>
      </div>

      {/* Current Active User Banner */}
      <div className="rounded-2xl border border-primary/30 bg-primary-soft/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-white font-bold text-lg shadow-sm"
            style={{ backgroundColor: activeMember.avatarBg }}
          >
            {activeMember.name[0]}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text">{activeMember.name}</span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-white">
                {activeMember.role}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Huyu ndiye mtumiaji anayerekodi taarifa za kaya kwa sasa.
            </p>
          </div>
        </div>

        <div className="text-xs text-text-muted">
          <span>Simu: </span>
          <span className="font-mono text-text font-semibold">{activeMember.phone}</span>
        </div>
      </div>

      {/* Household Members Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-text flex items-center gap-2">
          <Users size={16} className="text-primary" />
          <span>Wanafamilia Waliosajiliwa kwenye Kaya</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {members.map((m) => {
            const isActive = m.id === activeMember.id;
            return (
              <div
                key={m.id}
                className={`rounded-2xl border bg-surface p-4 space-y-3 transition-all shadow-xs flex flex-col justify-between ${
                  isActive ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold text-sm"
                      style={{ backgroundColor: m.avatarBg }}
                    >
                      {m.name[0]}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        m.role === 'admin'
                          ? 'bg-primary text-white'
                          : m.role === 'contributor'
                          ? 'bg-income-soft text-income'
                          : 'bg-surface-raised text-text-muted'
                      }`}
                    >
                      {m.role === 'admin'
                        ? 'Msimamizi'
                        : m.role === 'contributor'
                        ? 'Mchangiaji'
                        : 'Mtazamaji'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-text">{m.name}</h3>
                    <p className="text-[11px] font-mono text-text-muted">{m.phone}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  {isActive ? (
                    <div className="w-full py-1.5 rounded-xl bg-primary text-white text-xs font-semibold flex items-center justify-center gap-1">
                      <UserCheck size={14} />
                      <span>Inatumika Sasa</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveMember(m.id)}
                      className="w-full py-1.5 rounded-xl border border-border hover:border-primary/50 text-text hover:text-primary text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Badili kuwa {m.name.split(' ')[0]}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Permissions Table */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-text flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            <span>Jedwali la Mamlaka na Ruhusa (Security RBAC)</span>
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Uthibitisho wa ulinzi kulingana na muundo wa majukumu ya kifamilia
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-border bg-surface-raised text-text-muted">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Kazi / Uwezo</th>
                <th className="py-2.5 px-3 font-semibold text-center">Msimamizi (Admin)</th>
                <th className="py-2.5 px-3 font-semibold text-center">Mchangiaji (Contributor)</th>
                <th className="py-2.5 px-3 font-semibold text-center">Mtazamaji (Viewer)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text">
              {permissionsMatrix.map((p, i) => (
                <tr key={i} className="hover:bg-surface-raised/50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-text">{p.feature}</td>
                  <td className="py-2.5 px-3 text-center">
                    {p.admin ? (
                      <CheckCircle2 size={16} className="text-income inline" />
                    ) : (
                      <XCircle size={16} className="text-text-faint inline" />
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {p.contributor ? (
                      <CheckCircle2 size={16} className="text-income inline" />
                    ) : (
                      <XCircle size={16} className="text-text-faint inline" />
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {p.viewer ? (
                      <CheckCircle2 size={16} className="text-income inline" />
                    ) : (
                      <XCircle size={16} className="text-text-faint inline" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable Security Audit Trail */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-text flex items-center gap-2">
              <History size={16} className="text-primary" />
              <span>{t('hhSecurityAudit')}</span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">{t('hhSecurityAuditDesc')}</p>
          </div>
          <span className="text-[10px] font-mono text-income bg-income-soft px-2 py-0.5 rounded-full font-bold">
            Imethibitishwa (Encrypted)
          </span>
        </div>

        <div className="divide-y divide-border border border-border rounded-xl overflow-hidden max-h-64 overflow-y-auto">
          {auditLog.map((log) => {
            const timeFormatted = new Date(log.timestamp).toLocaleString('sw-TZ', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            return (
              <div key={log.id} className="p-3 text-xs space-y-1 hover:bg-surface-raised transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary-soft">
                      {log.action}
                    </span>
                    <span className="font-semibold text-text">{log.actorName}</span>
                  </div>
                  <span className="text-[10px] text-text-faint font-mono">{timeFormatted}</span>
                </div>
                <p className="text-text-muted text-[11px]">{log.details}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
