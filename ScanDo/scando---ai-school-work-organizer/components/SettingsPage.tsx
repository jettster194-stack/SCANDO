
import React, { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Database, Moon, Sun, Monitor, Trash2, Cpu, ScanLine, Smartphone, Check, Download, Key } from 'lucide-react';

interface SettingSectionProps {
  title: string;
  children?: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => (
  <div className="mb-12">
      <h3 className="text-[#F25F4C] font-mono text-xs uppercase tracking-widest mb-6 border-b border-white/10 pb-2">{title}</h3>
      <div className="space-y-4">
          {children}
      </div>
  </div>
);

interface ToggleItemProps {
  label: string;
  desc: string;
  active: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ label, desc, active, onToggle, icon }) => (
  <div 
      onClick={onToggle}
      className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5 cursor-pointer hover:bg-[#161616] transition-colors group"
  >
      <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${active ? 'bg-[#F25F4C]/20 text-[#F25F4C]' : 'bg-white/5 text-gray-500'}`}>
              {icon}
          </div>
          <div>
              <p className="font-bold text-sm text-white group-hover:text-[#F25F4C] transition-colors">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
          </div>
      </div>
      <div className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${active ? 'bg-[#F25F4C]' : 'bg-gray-700'}`}>
          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`}></div>
      </div>
  </div>
);

interface SettingsPageProps {
  onBack: () => void;
  onClearData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, onClearData }) => {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(() => 
    (localStorage.getItem('scando_theme') as any) || 'dark'
  );
  const [notifications, setNotifications] = useState(() => 
    localStorage.getItem('scando_notifications') === 'true'
  );
  const [autoSave, setAutoSave] = useState(() => 
    localStorage.getItem('scando_autosave') !== 'false'
  );
  const [highContrast, setHighContrast] = useState(() => 
    localStorage.getItem('scando_highcontrast') === 'true'
  );
  const [isPurging, setIsPurging] = useState(false);

  useEffect(() => {
    localStorage.setItem('scando_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('scando_notifications', String(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('scando_autosave', String(autoSave));
  }, [autoSave]);

  useEffect(() => {
    localStorage.setItem('scando_highcontrast', String(highContrast));
    if (highContrast) {
        document.documentElement.classList.add('high-contrast');
    } else {
        document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const handleNotificationToggle = async () => {
    const newState = !notifications;
    if (newState && 'Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            setNotifications(true);
            new Notification('ScanDo Notifications Enabled');
        } else {
            setNotifications(false);
        }
    } else {
        setNotifications(newState);
    }
  };

  const handlePurgeData = () => {
      if (window.confirm("Are you sure? This will delete all your documents and tasks locally.")) {
          setIsPurging(true);
          setTimeout(() => {
              localStorage.removeItem('scando_docs');
              onClearData();
              setIsPurging(false);
          }, 1000);
      }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
        <div className="flex items-end justify-between mb-16 border-b border-white/20 pb-4">
            <div>
                <h1 className="text-6xl font-anton uppercase tracking-tighter leading-none mb-2 text-white">Settings</h1>
                <p className="font-mono text-sm text-[#F25F4C] uppercase tracking-widest">
                    System Configuration
                </p>
            </div>
            <button onClick={onBack} className="text-gray-500 hover:text-white">Esc</button>
        </div>

        <SettingSection title="Appearance & Interface">
             <div className="grid grid-cols-3 gap-4 mb-6">
                {['Dark', 'Light', 'System'].map((t) => (
                    <button 
                        key={t}
                        onClick={() => setTheme(t.toLowerCase() as any)}
                        className={`
                            p-4 rounded-xl border flex flex-col items-center gap-3 transition-all
                            ${theme === t.toLowerCase() 
                                ? 'bg-[#F25F4C]/10 border-[#F25F4C] text-[#F25F4C]' 
                                : 'bg-[#111] border-white/5 text-gray-500 hover:border-white/20'
                            }
                        `}
                    >
                        {t === 'Dark' && <Moon size={20} />}
                        {t === 'Light' && <Sun size={20} />}
                        {t === 'System' && <Monitor size={20} />}
                        <span className="text-xs font-bold uppercase tracking-wider">{t} Mode</span>
                    </button>
                ))}
             </div>
             <ToggleItem 
                label="High Contrast Mode"
                desc="Increase border visibility and contrast"
                active={highContrast}
                onToggle={() => setHighContrast(!highContrast)}
                icon={<ScanLine size={18} />}
             />
        </SettingSection>

        <SettingSection title="Processing Configuration">
            <ToggleItem 
                label="Auto-Save to Local Storage"
                desc="Persist scanned documents securely on device"
                active={autoSave}
                onToggle={() => setAutoSave(!autoSave)}
                icon={<Database size={18} />}
            />
            <ToggleItem 
                label="Push Notifications"
                desc="Receive alerts for high priority tasks"
                active={notifications}
                onToggle={handleNotificationToggle}
                icon={<Bell size={18} />}
            />
        </SettingSection>

        <SettingSection title="Data & Privacy">
            <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-xl">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-red-500/20 text-red-500 rounded-lg">
                        <Trash2 size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-red-500">Clear Workspace Data</p>
                        <p className="text-xs text-red-400/60">Permanently delete all scanned documents and tasks.</p>
                    </div>
                 </div>
                 <button 
                    onClick={handlePurgeData}
                    disabled={isPurging}
                    className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                 >
                    {isPurging ? (
                        <>Purging...</>
                    ) : (
                        <>Execute Purge</>
                    )}
                 </button>
            </div>
        </SettingSection>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="font-mono text-xs text-gray-600 mb-2">SCANDO BUILD v2.4.1 (STABLE)</p>
            <div className="flex justify-center gap-4 text-gray-500">
                <Shield size={14} />
                <span className="text-[10px] uppercase tracking-wider">End-to-End Encrypted</span>
            </div>
        </div>
    </div>
  );
};
