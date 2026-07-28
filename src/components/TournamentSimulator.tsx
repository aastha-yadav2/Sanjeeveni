import React, { useState } from 'react';
import { Trophy, Play, RefreshCw, Sparkles } from 'lucide-react';
import { WORLD_CUP_TEAMS } from '../data/mockData';
import type { Team, TournamentMatch, MatchEvent } from '../types/fifa';
import { audioEngine } from '../utils/audioEngine';
import confetti from 'canvas-confetti';

export const TournamentSimulator: React.FC = () => {
  const [qfMatches, setQfMatches] = useState<TournamentMatch[]>([
    { id: 'qf1', stage: 'Quarter Final', homeTeam: WORLD_CUP_TEAMS[0], awayTeam: WORLD_CUP_TEAMS[7], completed: false, events: [] }, // ARG vs NED
    { id: 'qf2', stage: 'Quarter Final', homeTeam: WORLD_CUP_TEAMS[1], awayTeam: WORLD_CUP_TEAMS[6], completed: false, events: [] }, // FRA vs POR
    { id: 'qf3', stage: 'Quarter Final', homeTeam: WORLD_CUP_TEAMS[2], awayTeam: WORLD_CUP_TEAMS[5], completed: false, events: [] }, // BRA vs GER
    { id: 'qf4', stage: 'Quarter Final', homeTeam: WORLD_CUP_TEAMS[3], awayTeam: WORLD_CUP_TEAMS[4], completed: false, events: [] }  // ENG vs ESP
  ]);

  const [sfMatches, setSfMatches] = useState<TournamentMatch[]>([]);
  const [finalMatch, setFinalMatch] = useState<TournamentMatch | null>(null);
  const [champion, setChampion] = useState<Team | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<TournamentMatch | null>(null);

  const simulateSingleMatch = (match: TournamentMatch): TournamentMatch => {
    // Attack rating difference boost
    const homeAttack = match.homeTeam.attack + Math.floor(Math.random() * 3);
    const awayAttack = match.awayTeam.attack + Math.floor(Math.random() * 3);

    let homeScore = Math.max(0, Math.floor((homeAttack - 70) / 7 + Math.random() * 3));
    let awayScore = Math.max(0, Math.floor((awayAttack - 70) / 7 + Math.random() * 3));

    let homePenalty: number | undefined = undefined;
    let awayPenalty: number | undefined = undefined;
    let winner: Team;

    if (homeScore === awayScore) {
      // Penalty shootout tie-breaker
      homePenalty = 4 + (Math.random() > 0.5 ? 1 : 0);
      awayPenalty = homePenalty === 5 ? 4 : 5;
      winner = homePenalty > awayPenalty ? match.homeTeam : match.awayTeam;
    } else {
      winner = homeScore > awayScore ? match.homeTeam : match.awayTeam;
    }

    const events: MatchEvent[] = [
      { minute: 1, type: 'whistle', description: 'Referee blows kick-off whistle!', team: 'home' },
      { minute: 45, type: 'whistle', description: 'Half-time whistle sounded.', team: 'home' }
    ];

    for (let i = 0; i < homeScore; i++) {
      events.push({
        minute: Math.floor(10 + Math.random() * 75),
        type: 'goal',
        description: `⚽ GOAL! ${match.homeTeam.name} score a breathtaking strike!`,
        team: 'home'
      });
    }

    for (let i = 0; i < awayScore; i++) {
      events.push({
        minute: Math.floor(10 + Math.random() * 75),
        type: 'goal',
        description: `⚽ GOAL! ${match.awayTeam.name} level the score!`,
        team: 'away'
      });
    }

    events.sort((a, b) => a.minute - b.minute);

    audioEngine.playKick();

    return {
      ...match,
      homeScore,
      awayScore,
      homePenaltyScore: homePenalty,
      awayPenaltyScore: awayPenalty,
      completed: true,
      winner,
      events
    };
  };

  const simulateQuarterFinals = () => {
    audioEngine.playWhistle();
    const updated = qfMatches.map(m => simulateSingleMatch(m));
    setQfMatches(updated);

    // Setup Semi-finals
    const sf: TournamentMatch[] = [
      {
        id: 'sf1',
        stage: 'Semi Final',
        homeTeam: updated[0].winner!,
        awayTeam: updated[1].winner!,
        completed: false,
        events: []
      },
      {
        id: 'sf2',
        stage: 'Semi Final',
        homeTeam: updated[2].winner!,
        awayTeam: updated[3].winner!,
        completed: false,
        events: []
      }
    ];
    setSfMatches(sf);
  };

  const simulateSemiFinals = () => {
    audioEngine.playWhistle();
    const updated = sfMatches.map(m => simulateSingleMatch(m));
    setSfMatches(updated);

    // Setup Final
    setFinalMatch({
      id: 'final',
      stage: 'Final',
      homeTeam: updated[0].winner!,
      awayTeam: updated[1].winner!,
      completed: false,
      events: []
    });
  };

  const simulateFinal = () => {
    if (!finalMatch) return;
    audioEngine.playGoalHorn();
    audioEngine.playCheer();
    const completedFinal = simulateSingleMatch(finalMatch);
    setFinalMatch(completedFinal);
    setChampion(completedFinal.winner!);

    confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 } });
  };

  const simulateFullTournament = () => {
    audioEngine.playClick();
    const updatedQF = qfMatches.map(m => simulateSingleMatch(m));
    setQfMatches(updatedQF);

    const sf1 = simulateSingleMatch({
      id: 'sf1',
      stage: 'Semi Final',
      homeTeam: updatedQF[0].winner!,
      awayTeam: updatedQF[1].winner!,
      completed: false,
      events: []
    });
    const sf2 = simulateSingleMatch({
      id: 'sf2',
      stage: 'Semi Final',
      homeTeam: updatedQF[2].winner!,
      awayTeam: updatedQF[3].winner!,
      completed: false,
      events: []
    });
    setSfMatches([sf1, sf2]);

    const fin = simulateSingleMatch({
      id: 'final',
      stage: 'Final',
      homeTeam: sf1.winner!,
      awayTeam: sf2.winner!,
      completed: false,
      events: []
    });
    setFinalMatch(fin);
    setChampion(fin.winner!);

    audioEngine.playGoalHorn();
    audioEngine.playCheer();
    confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
  };

  const resetTournament = () => {
    audioEngine.playClick();
    setQfMatches([
      { id: 'qf1', stage: 'Quarter Final', homeTeam: WORLD_CUP_TEAMS[0], awayTeam: WORLD_CUP_TEAMS[7], completed: false, events: [] },
      { id: 'qf2', stage: 'Quarter Final', homeTeam: WORLD_CUP_TEAMS[1], awayTeam: WORLD_CUP_TEAMS[6], completed: false, events: [] },
      { id: 'qf3', stage: 'Quarter Final', homeTeam: WORLD_CUP_TEAMS[2], awayTeam: WORLD_CUP_TEAMS[5], completed: false, events: [] },
      { id: 'qf4', stage: 'Quarter Final', homeTeam: WORLD_CUP_TEAMS[3], awayTeam: WORLD_CUP_TEAMS[4], completed: false, events: [] }
    ]);
    setSfMatches([]);
    setFinalMatch(null);
    setChampion(null);
    setSelectedMatch(null);
  };

  return (
    <div className="tournament-container">
      {/* Action Header */}
      <div className="tournament-header">
        <div className="tourney-title">
          <Trophy className="gold-trophy-icon" size={28} />
          <div>
            <h2>FIFA WORLD CUP 2026 BRACKET</h2>
            <p>Knockout stage simulator with real-time match events & penalty shootouts</p>
          </div>
        </div>

        <div className="tourney-actions">
          <button className="btn-tourney auto" onClick={simulateFullTournament}>
            <Sparkles size={18} /> Instant Auto-Simulate Tournament
          </button>
          <button className="btn-tourney reset" onClick={resetTournament}>
            <RefreshCw size={18} /> Reset Bracket
          </button>
        </div>
      </div>

      {/* Champion Banner if won */}
      {champion && (
        <div className="champion-banner">
          <div className="champion-badge">
            <Trophy size={48} className="champion-trophy" />
            <div className="champion-flag">{champion.flag}</div>
          </div>
          <div className="champion-info">
            <span className="champion-label">🏆 WORLD CUP CHAMPIONS</span>
            <h1 className="champion-name">{champion.name.toUpperCase()}</h1>
            <p>Conquered the FIFA 26 World Cup Tournament!</p>
          </div>
        </div>
      )}

      {/* Bracket Layout */}
      <div className="bracket-layout">
        {/* Quarter Finals */}
        <div className="bracket-column">
          <div className="column-header">
            <h3>QUARTER FINALS</h3>
            {!qfMatches[0].completed && (
              <button className="btn-sim-stage" onClick={simulateQuarterFinals}>
                <Play size={14} /> Sim QF
              </button>
            )}
          </div>
          <div className="matches-stack">
            {qfMatches.map(m => (
              <MatchCard key={m.id} match={m} onClick={() => setSelectedMatch(m)} />
            ))}
          </div>
        </div>

        {/* Semi Finals */}
        <div className="bracket-column">
          <div className="column-header">
            <h3>SEMI FINALS</h3>
            {sfMatches.length > 0 && !sfMatches[0].completed && (
              <button className="btn-sim-stage" onClick={simulateSemiFinals}>
                <Play size={14} /> Sim SF
              </button>
            )}
          </div>
          <div className="matches-stack sf-stack">
            {sfMatches.length === 0 ? (
              <div className="placeholder-card">Complete Quarter Finals to advance</div>
            ) : (
              sfMatches.map(m => (
                <MatchCard key={m.id} match={m} onClick={() => setSelectedMatch(m)} />
              ))
            )}
          </div>
        </div>

        {/* Final Match */}
        <div className="bracket-column final-column">
          <div className="column-header">
            <h3>GRAND FINAL</h3>
            {finalMatch && !finalMatch.completed && (
              <button className="btn-sim-stage gold" onClick={simulateFinal}>
                <Play size={14} /> Play Final
              </button>
            )}
          </div>
          <div className="matches-stack">
            {!finalMatch ? (
              <div className="placeholder-card final">Awaiting Finalists...</div>
            ) : (
              <MatchCard match={finalMatch} isFinal onClick={() => setSelectedMatch(finalMatch)} />
            )}
          </div>
        </div>
      </div>

      {/* Selected Match Details Modal */}
      {selectedMatch && (
        <div className="match-modal-backdrop" onClick={() => setSelectedMatch(null)}>
          <div className="match-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4>{selectedMatch.stage} - Match Report</h4>
              <button className="close-btn" onClick={() => setSelectedMatch(null)}>×</button>
            </div>

            <div className="modal-scoreboard">
              <div className="modal-team">
                <span className="modal-flag">{selectedMatch.homeTeam.flag}</span>
                <h3>{selectedMatch.homeTeam.name}</h3>
              </div>

              <div className="modal-score">
                <span>{selectedMatch.homeScore ?? 0}</span>
                <span className="sep">-</span>
                <span>{selectedMatch.awayScore ?? 0}</span>

                {selectedMatch.homePenaltyScore !== undefined && (
                  <div className="penalty-tag">
                    Penalties ({selectedMatch.homePenaltyScore} - {selectedMatch.awayPenaltyScore})
                  </div>
                )}
              </div>

              <div className="modal-team">
                <span className="modal-flag">{selectedMatch.awayTeam.flag}</span>
                <h3>{selectedMatch.awayTeam.name}</h3>
              </div>
            </div>

            <div className="modal-events">
              <h5>Match Timeline</h5>
              {selectedMatch.events.length === 0 ? (
                <p className="no-events">No match events available (Match not simulated yet).</p>
              ) : (
                selectedMatch.events.map((ev, idx) => (
                  <div key={idx} className={`event-row ${ev.team}`}>
                    <span className="event-min">{ev.minute}'</span>
                    <span className="event-desc">{ev.description}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MatchCard: React.FC<{ match: TournamentMatch; isFinal?: boolean; onClick?: () => void }> = ({
  match,
  isFinal = false,
  onClick
}) => {
  return (
    <div
      className={`bracket-card ${match.completed ? 'completed' : ''} ${isFinal ? 'is-final' : ''}`}
      onClick={onClick}
    >
      <div className={`card-team ${match.winner?.id === match.homeTeam.id ? 'winner' : ''}`}>
        <div className="team-flag-name">
          <span>{match.homeTeam.flag}</span>
          <span className="name">{match.homeTeam.name}</span>
        </div>
        <span className="score">
          {match.homeScore ?? '-'}
          {match.homePenaltyScore !== undefined && ` (${match.homePenaltyScore})`}
        </span>
      </div>

      <div className="card-divider" />

      <div className={`card-team ${match.winner?.id === match.awayTeam.id ? 'winner' : ''}`}>
        <div className="team-flag-name">
          <span>{match.awayTeam.flag}</span>
          <span className="name">{match.awayTeam.name}</span>
        </div>
        <span className="score">
          {match.awayScore ?? '-'}
          {match.awayPenaltyScore !== undefined && ` (${match.awayPenaltyScore})`}
        </span>
      </div>
    </div>
  );
};
