import React, { useState } from 'react';
import { PLAYERS_DATABASE } from '../data/mockData';
import type { Player } from '../types/fifa';
import { FUTCard } from './FUTCard';
import { Search, Filter, Star } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export const PlayerDatabase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [rarityFilter, setRarityFilter] = useState<string>('ALL');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const filteredPlayers = PLAYERS_DATABASE.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPosition = positionFilter === 'ALL' || p.position === positionFilter;
    const matchesRarity = rarityFilter === 'ALL' || p.rarity === rarityFilter;

    return matchesSearch && matchesPosition && matchesRarity;
  });

  const handlePlayerClick = (p: Player) => {
    audioEngine.playClick();
    setSelectedPlayer(p);
  };

  return (
    <div className="database-container">
      {/* Search & Filter Header */}
      <div className="database-header">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search players by name, club, or nation..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <Filter size={16} />
            <select value={positionFilter} onChange={e => setPositionFilter(e.target.value)}>
              <option value="ALL">All Positions</option>
              <option value="ST">Strikers (ST)</option>
              <option value="CAM">Attacking Mid (CAM)</option>
              <option value="CM">Midfielders (CM/CDM)</option>
              <option value="LW">Wings (LW/RW)</option>
              <option value="CB">Defenders (CB/LB/RB)</option>
              <option value="GK">Goalkeepers (GK)</option>
            </select>
          </div>

          <div className="filter-item">
            <Star size={16} />
            <select value={rarityFilter} onChange={e => setRarityFilter(e.target.value)}>
              <option value="ALL">All Rarities</option>
              <option value="icon">ICON Legend</option>
              <option value="toty">TOTY (Team of Year)</option>
              <option value="gold">Gold Rare</option>
            </select>
          </div>
        </div>
      </div>

      {/* Players Cards Grid */}
      <div className="database-grid">
        {filteredPlayers.map(player => (
          <div key={player.id} className="db-card-wrapper">
            <FUTCard player={player} onClick={() => handlePlayerClick(player)} />
          </div>
        ))}
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div className="detail-modal-backdrop" onClick={() => setSelectedPlayer(null)}>
          <div className="detail-modal-card" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPlayer(null)}>×</button>

            <div className="detail-grid">
              {/* FUT Card Preview */}
              <div className="detail-card-left">
                <FUTCard player={selectedPlayer} size="lg" />
              </div>

              {/* Attributes Details */}
              <div className="detail-info-right">
                <div className="detail-header-info">
                  <h2>{selectedPlayer.name}</h2>
                  <p className="detail-sub">
                    {selectedPlayer.nationFlag} {selectedPlayer.nation} • {selectedPlayer.clubBadge} {selectedPlayer.club}
                  </p>
                </div>

                <p className="detail-desc">{selectedPlayer.description}</p>

                <div className="detail-bio-pills">
                  <div className="bio-pill">
                    <span className="pill-lbl">Preferred Foot</span>
                    <span className="pill-val">{selectedPlayer.preferredFoot}</span>
                  </div>
                  <div className="bio-pill">
                    <span className="pill-lbl">Skill Moves</span>
                    <span className="pill-val">{'★'.repeat(selectedPlayer.skillMoves)}</span>
                  </div>
                  <div className="bio-pill">
                    <span className="pill-lbl">Weak Foot</span>
                    <span className="pill-val">{'★'.repeat(selectedPlayer.weakFoot)}</span>
                  </div>
                </div>

                {/* Attribute Bars */}
                <div className="stats-bars-list">
                  <StatBar label="Pace (PAC)" val={selectedPlayer.stats.pace} color="#00f2fe" />
                  <StatBar label="Shooting (SHO)" val={selectedPlayer.stats.shooting} color="#ff4757" />
                  <StatBar label="Passing (PAS)" val={selectedPlayer.stats.passing} color="#2ed573" />
                  <StatBar label="Dribbling (DRI)" val={selectedPlayer.stats.dribbling} color="#ffa502" />
                  <StatBar label="Defending (DEF)" val={selectedPlayer.stats.defending} color="#1e90ff" />
                  <StatBar label="Physical (PHY)" val={selectedPlayer.stats.physical} color="#e84393" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatBar: React.FC<{ label: string; val: number; color: string }> = ({ label, val, color }) => {
  return (
    <div className="stat-bar-item">
      <div className="stat-bar-hdr">
        <span>{label}</span>
        <span className="val">{val}</span>
      </div>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{ width: `${val}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};
