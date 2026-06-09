import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

const waveform = [22, 34, 18, 48, 70, 38, 58, 92, 44, 76, 52, 30, 64, 26, 42, 34];
const frozenWaveformScale = [0.72, 0.88, 0.64, 0.94, 0.8, 0.9, 0.7, 0.86];
const initialElapsed = 18;
const libraryTracks = [
  { title: 'Levitating', artist: 'Dua Lipa', tag: 'Playing', length: '3:23', duration: 203, bpm: 103 },
  { title: 'Houdini', artist: 'Dua Lipa', tag: 'Queued', length: '3:05', duration: 185, bpm: 117 },
  { title: 'Physical', artist: 'Dua Lipa', tag: 'Queued', length: '3:13', duration: 193, bpm: 147 },
];

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLooping, setIsLooping] = useState(false);
  const [view, setView] = useState<'player' | 'library'>('player');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [isQueued, setIsQueued] = useState(false);
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(initialElapsed);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);

  const currentTrack = libraryTracks[selectedTrackIndex];
  const trackDuration = currentTrack.duration;
  const shouldSpin = isPlaying;
  const currentTime = formatTime(elapsedSeconds);
  const totalTime = formatTime(trackDuration);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => {
        if (current >= trackDuration) {
          return isLooping ? 0 : trackDuration;
        }

        return current + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isLooping, isPlaying, trackDuration]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToastMessage('');
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const openMore = () => {
    setShareState('idle');
    setToastMessage('');
    setIsMoreOpen(true);
  };

  const shareTrack = () => {
    setShareState((current) => {
      const nextState = current === 'copied' ? 'idle' : 'copied';

      if (nextState === 'copied') {
        setIsInPlaylist(false);
        setIsFavorite(false);
        setIsQueued(false);
      }

      return nextState;
    });
  };

  const selectTrack = (index: number) => {
    setSelectedTrackIndex(index);
    setElapsedSeconds(index === 0 ? initialElapsed : 0);
    setIsPlaying(true);
    setView('player');
  };

  const toggleSingleAction = (action: 'playlist' | 'favorite' | 'queue') => {
    setShareState('idle');
    setIsInPlaylist((current) => action === 'playlist' ? !current : false);
    setIsFavorite((current) => action === 'favorite' ? !current : false);
    setIsQueued((current) => action === 'queue' ? !current : false);
  };

  const closeActionSheet = () => {
    setIsMoreOpen(false);

    if (isInPlaylist) {
      setToastMessage('Added to list');
      return;
    }

    if (shareState === 'copied') {
      setToastMessage('Share link copied');
      return;
    }

    if (isFavorite) {
      setToastMessage('Added to favorites');
      return;
    }

    if (isQueued) {
      setToastMessage('Added to queue');
    }
  };

  return (
    <main className="player-shell">
      <section
        className={`phone-player ${view === 'library' ? 'is-library' : ''} ${isPlaying ? 'is-playing' : 'is-paused'} ${isLooping ? 'is-looping' : ''}`}
        aria-label="Mobile vinyl music player"
      >
        <div className="ios-status-bar" aria-hidden="true">
          <span>9:41</span>
          <div className="ios-status-icons">
            <span className="signal-bars">
              <i />
              <i />
              <i />
            </span>
            <span className="battery-icon">
              <i />
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'player' ? (
            <motion.div
              className="screen-stack"
              key="player"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <header className="phone-topbar">
                <button
                  type="button"
                  aria-label="Back"
                  onClick={() => setView('library')}
                  onPointerUp={() => setView('library')}
                >
                  <IconChevronLeft />
                </button>
                <span>Afterglow</span>
                <button type="button" aria-label="More" onClick={openMore}>
                  <IconMore />
                </button>
              </header>

              <section className="hero-strip" aria-label="Now playing">
                <div>
                  <span className="eyebrow">Live cut</span>
                  <h1>{currentTrack.title}</h1>
                </div>
                <span className="status-pill">{!isPlaying ? 'Stopped' : isLooping ? 'Loop on' : 'Playing'}</span>
              </section>

              <section className="turntable-card" aria-label="Turntable">
                <span className="glass-orbit orbit-one" />
                <span className="glass-orbit orbit-two" />
                <div
                  className="vinyl-record"
                  role="img"
                  aria-label="Interactive vinyl record"
                >
                  <span className="record-label" />
                  <button
                    className="record-light-line"
                    type="button"
                    aria-label="Record highlight"
                  />
                </div>
                <div className={`tonearm ${isPlaying ? 'tonearm-playing' : 'tonearm-paused'}`} aria-hidden="true">
                  <span className="arm-base" />
                  <span className="arm-stick" />
                  <span className="needle" />
                </div>
                <button
                  className="loop-control"
                  type="button"
                  aria-label={isLooping ? 'Disable loop' : 'Enable loop'}
                  aria-pressed={isLooping}
                  onClick={() => setIsLooping((current) => !current)}
                >
                  <IconLoop />
                </button>
              </section>

              <section className="track-section">
                <p>{currentTrack.artist}</p>
                <div className="meta-row" aria-label="Track details">
                  <span>Dance pop</span>
                  <span>{currentTrack.bpm} BPM</span>
                  <span>Lossless</span>
                </div>
              </section>

              <section className="wave-section" aria-label="Track waveform">
                <div className="waveform">
                  {waveform.map((height, index) => (
                    <motion.span
                      key={`${height}-${index}`}
                      style={{ height: `${height}%` }}
                      animate={{ scaleY: shouldSpin ? [0.72, 0.9, 0.78, 0.86, 0.74] : frozenWaveformScale[index % frozenWaveformScale.length] }}
                      transition={{
                        delay: shouldSpin ? (index % 4) * 0.08 : 0,
                        duration: shouldSpin ? 1.45 : 0.18,
                        repeat: shouldSpin ? Infinity : 0,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
                <div className="time-row">
                  <span>{currentTime}</span>
                  <span>{totalTime}</span>
                </div>
              </section>

              <nav className="transport-controls" aria-label="Playback controls">
                <button type="button" aria-label="Previous">
                  <IconPrevious />
                </button>
                <motion.button
                  className={`play-button ${isPlaying ? '' : 'paused'}`}
                  type="button"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  onClick={() => {
                    setIsPlaying((current) => !current);
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  {isPlaying ? <IconPause /> : <IconPlay />}
                </motion.button>
                <button type="button" aria-label="Next">
                  <IconNext />
                </button>
              </nav>
            </motion.div>
          ) : (
            <motion.div
              className="screen-stack library-screen"
              key="library"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 18 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <header className="phone-topbar">
                <button
                  type="button"
                  aria-label="Return to player"
                  onClick={() => setView('player')}
                  onPointerUp={() => setView('player')}
                >
                  <IconChevronLeft />
                </button>
                <span>Crate</span>
                <button type="button" aria-label="More" onClick={openMore}>
                  <IconMore />
                </button>
              </header>

              <section className="library-hero" aria-label="Music library">
                <span className="eyebrow">Soft crate</span>
                <h1>Afterglow</h1>
                <p>Saved cuts, queued favorites, and late-night repeats in one soft stack.</p>
              </section>

              <section className="library-card" aria-label="Current record">
                <div className="mini-record" aria-hidden="true">
                  <span />
                </div>
                <div>
                  <span className="library-kicker">On the platter</span>
                  <h2>{currentTrack.title}</h2>
                </div>
              </section>

              <section className="track-list" aria-label="Track list">
                {libraryTracks.map((track, index) => (
                  <button
                    className={`track-row ${index === selectedTrackIndex ? 'active' : ''}`}
                    key={track.title}
                    type="button"
                    onClick={() => selectTrack(index)}
                  >
                    <span className="track-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="track-copy">
                      <strong>{track.title}</strong>
                      <small>{track.artist}</small>
                    </span>
                    <span className="track-tag">
                      {index === selectedTrackIndex ? 'Playing' : track.tag}
                    </span>
                    <span className="track-time">{track.length}</span>
                  </button>
                ))}
              </section>

              <button className="return-player" type="button" onClick={() => setView('player')}>
                <IconPlay />
                Return to player
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMoreOpen ? (
            <motion.div
              className="sheet-layer"
              key="more-sheet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <button className="sheet-scrim" type="button" aria-label="Close actions" onClick={() => setIsMoreOpen(false)} />
              <motion.section
                className="more-sheet"
                aria-label="Track actions"
                initial={{ y: 24, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 24, opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <div className="sheet-handle" aria-hidden="true" />
                <div className="sheet-current">
                  <div className="mini-record sheet-record" aria-hidden="true">
                    <span />
                  </div>
                  <div>
                    <span className="library-kicker">{currentTrack.title}</span>
                    <h2>Share and collect</h2>
                    <p>{shareState === 'copied' ? 'Share link copied' : 'Choose an action for this cut'}</p>
                  </div>
                </div>

                <div className="action-grid">
                  <ActionButton label={shareState === 'copied' ? 'Copied' : 'Share'} active={shareState === 'copied'} onClick={shareTrack}>
                    <IconShare />
                  </ActionButton>
                  <ActionButton
                    label={isInPlaylist ? 'In list' : 'Add list'}
                    active={isInPlaylist}
                    onClick={() => toggleSingleAction('playlist')}
                  >
                    <IconList />
                  </ActionButton>
                  <ActionButton
                    label={isFavorite ? 'Saved' : 'Favorite'}
                    active={isFavorite}
                    onClick={() => toggleSingleAction('favorite')}
                  >
                    <IconHeart />
                  </ActionButton>
                  <ActionButton
                    label={isQueued ? 'Queued' : 'Queue'}
                    active={isQueued}
                    onClick={() => toggleSingleAction('queue')}
                  >
                    <IconQueue />
                  </ActionButton>
                </div>

                <div className="sheet-summary">
                  <button type="button" onClick={closeActionSheet}>Done</button>
                </div>
              </motion.section>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {toastMessage ? (
            <motion.div
              className="action-toast"
              role="status"
              aria-live="polite"
              initial={{ y: 16, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <span>{toastMessage}</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="home-indicator" aria-hidden="true" />
      </section>
    </main>
  );
}

function ActionButton({
  active,
  children,
  label,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button className={`action-button ${active ? 'active' : ''}`} type="button" aria-pressed={active} onClick={onClick}>
      {children}
      <span>{label}</span>
    </button>
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function IconChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 18 9 12l6-6" />
    </svg>
  );
}

function IconMore() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h.01M12 12h.01M19 12h.01" />
    </svg>
  );
}

function IconPrevious() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 6v12" />
      <path d="m18 7-7 5 7 5" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 6v12" />
      <path d="m6 7 7 5-7 5" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7.5" y="5.5" width="3.8" height="13" rx="1.9" fill="currentColor" stroke="none" />
      <rect x="12.7" y="5.5" width="3.8" height="13" rx="1.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.8 6.8c0-1.15 1.26-1.86 2.25-1.26l8.1 4.98c.94.58.94 1.94 0 2.52l-8.1 4.98c-.99.6-2.25-.11-2.25-1.26V6.8Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconLoop() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 3l3 3-3 3" />
      <path d="M4 11V9a3 3 0 0 1 3-3h13" />
      <path d="M7 21l-3-3 3-3" />
      <path d="M20 13v2a3 3 0 0 1-3 3H4" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
      <path d="m16 6-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  );
}

function IconList() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" />
    </svg>
  );
}

function IconQueue() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h12" />
      <path d="M4 12h9" />
      <path d="M4 18h7" />
      <path d="M18 14v6" />
      <path d="M15 17h6" />
    </svg>
  );
}

export default App;
