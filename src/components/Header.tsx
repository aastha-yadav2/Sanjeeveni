import React from 'react';
import { Trophy, Gamepad2, Users, Database, Target, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export type ActiveTab = 'arcade' | 'tournament' | 'squad' | 'database' | 'penalty';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled
}) => {
  const handleTabChange = (tab: ActiveTab) => {
    audioEngine.playClick();
    setActiveTab(tab);
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    audioEngine.enabled = nextState;
    setSoundEnabled(nextState);
    if (nextState) audioEngine.playClick();
  };

  return (
    <header className="fifa-header">
      <div className="header-container">
        {/* Brand / Logo */}
        <div className="brand-box">
          <div className="logo-badge">
            <Trophy className="trophy-icon" />
            <div className="logo-glow" />
          </div>
          <div>
            <div className="brand-title">
              <span className="ea-text">EA FC</span>
              <span className="fifa-text">FIFA 26</span>
              <span className="badge-pro">PRO ULTIMATE</span>
            </div>
            <p className="brand-subtitle">Official Next-Gen Football Simulation & Tournament Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'arcade' ? 'active' : ''}`}
            onClick={() => handleTabChange('arcade')}
          >
            <Gamepad2 className="tab-icon" />
            <span>2D Match Arena</span>
            <span className="live-dot" />
          </button>

          <button
            className={`nav-tab ${activeTab === 'tournament' ? 'active' : ''}`}
            onClick={() => handleTabChange('tournament')}
          >
            <Trophy className="tab-icon" />
            <span>World Cup Bracket</span>
          </button>

          <button
            className={`nav-tab ${activeTab === 'squad' ? 'active' : ''}`}
            onClick={() => handleTabChange('squad')}
          >
            <Users className="tab-icon" />
            <span>Squad Builder</span>
          </button>

          <button
            className={`nav-tab ${activeTab === 'penalty' ? 'active' : ''}`}
            onClick={() => handleTabChange('penalty')}
          >
            <Target className="tab-icon" />
            <span>Penalty Shootout</span>
          </button>

          <button
            className={`nav-tab ${activeTab === 'database' ? 'active' : ''}`}
            onClick={() => handleTabChange('database')}
          >
            <Database className="tab-icon" />
            <span>Player Database</span>
          </button>
        </nav>

        {/* Controls */}
        <div className="header-controls">
          <button
            className={`sound-btn ${soundEnabled ? 'on' : 'off'}`}
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span>{soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
          </button>

          <div className="quick-info">
            <Sparkles className="sparkle-icon" size={16} />
            <span>NEXT-GEN ENGINE</span>
          </div>
        </div>
      </div>
    </header>
  );
};
