import React from 'react';
import type { Player } from '../types/fifa';

interface FUTCardProps {
  player: Player;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
}

export const FUTCard: React.FC<FUTCardProps> = ({ player, onClick, size = 'md', selected = false }) => {
  const getCardRarityClass = () => {
    switch (player.rarity) {
      case 'icon':
        return 'fut-card-icon';
      case 'toty':
        return 'fut-card-toty';
      case 'hero':
        return 'fut-card-hero';
      default:
        return 'fut-card-gold';
    }
  };

  const scaleClass = size === 'sm' ? 'fut-card-sm' : size === 'lg' ? 'fut-card-lg' : 'fut-card-md';

  return (
    <div
      onClick={onClick}
      className={`fut-card ${getCardRarityClass()} ${scaleClass} ${selected ? 'fut-card-selected' : ''}`}
    >
      <div className="fut-card-inner">
        {/* Top Badges */}
        <div className="fut-card-top">
          <div className="fut-rating-box">
            <span className="fut-rating">{player.rating}</span>
            <span className="fut-position">{player.position}</span>
          </div>
          <div className="fut-badges">
            <span className="fut-flag" title={player.nation}>{player.nationFlag}</span>
            <span className="fut-club" title={player.club}>{player.clubBadge}</span>
          </div>
        </div>

        {/* Player Image */}
        <div className="fut-avatar-container">
          <img src={player.avatar} alt={player.name} className="fut-avatar" />
          <div className="fut-avatar-glow" />
        </div>

        {/* Player Name */}
        <div className="fut-name-container">
          <h3 className="fut-name">{player.shortName.toUpperCase()}</h3>
          <div className="fut-divider" />
        </div>

        {/* Stats Grid */}
        <div className="fut-stats-grid">
          <div className="fut-stat">
            <span className="fut-stat-val">{player.stats.pace}</span>
            <span className="fut-stat-lbl">PAC</span>
          </div>
          <div className="fut-stat">
            <span className="fut-stat-val">{player.stats.shooting}</span>
            <span className="fut-stat-lbl">SHO</span>
          </div>
          <div className="fut-stat">
            <span className="fut-stat-val">{player.stats.passing}</span>
            <span className="fut-stat-lbl">PAS</span>
          </div>
          <div className="fut-stat">
            <span className="fut-stat-val">{player.stats.dribbling}</span>
            <span className="fut-stat-lbl">DRI</span>
          </div>
          <div className="fut-stat">
            <span className="fut-stat-val">{player.stats.defending}</span>
            <span className="fut-stat-lbl">DEF</span>
          </div>
          <div className="fut-stat">
            <span className="fut-stat-val">{player.stats.physical}</span>
            <span className="fut-stat-lbl">PHY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
