import React, { useState } from 'react';
import { FORMATIONS, PLAYERS_DATABASE } from '../data/mockData';
import type { Player } from '../types/fifa';
import { FUTCard } from './FUTCard';
import { Sparkles, Plus, Zap } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export const SquadBuilder: React.FC = () => {
  const [selectedFormationIdx, setSelectedFormationIdx] = useState(0);
  const formation = FORMATIONS[selectedFormationIdx];

  // Map of position id to assigned Player
  const [assignedPlayers, setAssignedPlayers] = useState<{ [posId: string]: Player }>({
    gk: PLAYERS_DATABASE.find(p => p.position === 'GK') || PLAYERS_DATABASE[9],
    st: PLAYERS_DATABASE.find(p => p.shortName === 'Haaland') || PLAYERS_DATABASE[3],
    lw: PLAYERS_DATABASE.find(p => p.shortName === 'Vini Jr.') || PLAYERS_DATABASE[5],
    rw: PLAYERS_DATABASE.find(p => p.shortName === 'Messi') || PLAYERS_DATABASE[0],
    cam: PLAYERS_DATABASE.find(p => p.shortName === 'Bellingham') || PLAYERS_DATABASE[4],
    lcm: PLAYERS_DATABASE.find(p => p.shortName === 'De Bruyne') || PLAYERS_DATABASE[6],
    rcm: PLAYERS_DATABASE.find(p => p.shortName === 'Rodri') || PLAYERS_DATABASE[13],
    lcb: PLAYERS_DATABASE.find(p => p.shortName === 'Van Dijk') || PLAYERS_DATABASE[8],
    rcb: PLAYERS_DATABASE.find(p => p.shortName === 'Zidane') || PLAYERS_DATABASE[11],
    lb: PLAYERS_DATABASE.find(p => p.shortName === 'Davies') || PLAYERS_DATABASE[15],
    rb: PLAYERS_DATABASE.find(p => p.shortName === 'Trent') || PLAYERS_DATABASE[14]
  });

  const [activeSlot, setActiveSlot] = useState<{ id: string; name: string } | null>(null);
  const [showCardCreator, setShowCardCreator] = useState(false);

  // Custom player creation state
  const [customName, setCustomName] = useState('Super Star');
  const [customRating, setCustomRating] = useState(95);
  const [customPos, setCustomPos] = useState<'ST' | 'CAM' | 'RW' | 'LW' | 'CM' | 'CB'>('ST');
  const [customRarity, setCustomRarity] = useState<'gold' | 'toty' | 'icon'>('toty');

  // Calculate Overall Squad Rating
  const playersList = Object.values(assignedPlayers);
  const totalRating = playersList.length > 0
    ? Math.round(playersList.reduce((acc, p) => acc + p.rating, 0) / playersList.length)
    : 0;

  // Chemistry calculation (based on nations/clubs matching)
  const chemistry = Math.min(33, Math.round(playersList.length * 3));

  const handleSlotClick = (slot: { id: string; name: string }) => {
    audioEngine.playClick();
    setActiveSlot(slot);
  };

  const assignPlayerToSlot = (player: Player) => {
    if (!activeSlot) return;
    audioEngine.playKick();
    setAssignedPlayers(prev => ({
      ...prev,
      [activeSlot.id]: player
    }));
    setActiveSlot(null);
  };

  const handleCreateCustomPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playGoalHorn();
    const newPlayer: Player = {
      id: `custom_${Date.now()}`,
      name: customName,
      shortName: customName.split(' ')[0],
      rating: customRating,
      position: customPos,
      nation: 'Custom FC',
      nationFlag: '⭐',
      club: 'Ultimate XI',
      clubBadge: '⚡',
      rarity: customRarity,
      avatar: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80',
      stats: { pace: 95, shooting: 94, passing: 92, dribbling: 96, defending: 80, physical: 88 },
      preferredFoot: 'Right',
      skillMoves: 5,
      weakFoot: 5,
      description: 'Custom created superstar card with elite stats.'
    };

    PLAYERS_DATABASE.unshift(newPlayer);
    if (activeSlot) {
      assignPlayerToSlot(newPlayer);
    }
    setShowCardCreator(false);
  };

  return (
    <div className="squad-container">
      {/* Top Banner Stats */}
      <div className="squad-banner">
        <div className="squad-stat-card rating">
          <div className="stat-value">{totalRating}</div>
          <div className="stat-label">SQUAD RATING</div>
        </div>

        <div className="squad-stat-card chem">
          <div className="stat-value">{chemistry} / 33</div>
          <div className="stat-label">CHEMISTRY SCORE</div>
        </div>

        <div className="formation-selector-box">
          <label>FORMATION</label>
          <select
            value={selectedFormationIdx}
            onChange={e => {
              audioEngine.playClick();
              setSelectedFormationIdx(Number(e.target.value));
            }}
            className="formation-select"
          >
            {FORMATIONS.map((f, i) => (
              <option key={i} value={i}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn-create-card"
          onClick={() => {
            audioEngine.playClick();
            setShowCardCreator(true);
          }}
        >
          <Sparkles size={18} /> Create Custom FUT Card
        </button>
      </div>

      {/* Main Pitch View */}
      <div className="squad-pitch-wrapper">
        <div className="tactical-pitch">
          {/* Pitch Markings */}
          <div className="pitch-center-circle" />
          <div className="pitch-half-line" />

          {/* Player Nodes on Pitch */}
          {formation.positions.map(pos => {
            const player = assignedPlayers[pos.id];
            return (
              <div
                key={pos.id}
                className="pitch-slot-node"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => handleSlotClick(pos)}
              >
                {player ? (
                  <div className="pitch-player-card-mini">
                    <FUTCard player={player} size="sm" />
                    <div className="pos-badge">{pos.name}</div>
                  </div>
                ) : (
                  <div className="pitch-slot-empty">
                    <Plus size={24} />
                    <span>{pos.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Select Player Picker Modal */}
      {activeSlot && (
        <div className="picker-modal-backdrop" onClick={() => setActiveSlot(null)}>
          <div className="picker-modal-content" onClick={e => e.stopPropagation()}>
            <div className="picker-header">
              <h3>Assign Player for [{activeSlot.name}] Slot</h3>
              <button className="close-btn" onClick={() => setActiveSlot(null)}>×</button>
            </div>

            <div className="picker-grid">
              {PLAYERS_DATABASE.map(player => (
                <div key={player.id} className="picker-card-item">
                  <FUTCard player={player} size="sm" onClick={() => assignPlayerToSlot(player)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Custom FUT Card Modal */}
      {showCardCreator && (
        <div className="picker-modal-backdrop" onClick={() => setShowCardCreator(false)}>
          <div className="picker-modal-content creator" onClick={e => e.stopPropagation()}>
            <div className="picker-header">
              <h3>🎴 Custom FUT Card Creator</h3>
              <button className="close-btn" onClick={() => setShowCardCreator(false)}>×</button>
            </div>

            <form onSubmit={handleCreateCustomPlayer} className="creator-form">
              <div className="form-group">
                <label>Player Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Overall Rating (1-99)</label>
                  <input
                    type="number"
                    min={60}
                    max={99}
                    value={customRating}
                    onChange={e => setCustomRating(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Position</label>
                  <select value={customPos} onChange={e => setCustomPos(e.target.value as any)}>
                    <option value="ST">ST (Striker)</option>
                    <option value="CAM">CAM (Attacking Mid)</option>
                    <option value="LW">LW (Left Wing)</option>
                    <option value="RW">RW (Right Wing)</option>
                    <option value="CM">CM (Central Mid)</option>
                    <option value="CB">CB (Center Back)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Card Rarity</label>
                  <select value={customRarity} onChange={e => setCustomRarity(e.target.value as any)}>
                    <option value="toty">Team of the Year (TOTY)</option>
                    <option value="icon">ICON Legend</option>
                    <option value="gold">Rare Gold</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-submit-card">
                <Zap size={18} /> GENERATE & ASSIGN CARD
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
