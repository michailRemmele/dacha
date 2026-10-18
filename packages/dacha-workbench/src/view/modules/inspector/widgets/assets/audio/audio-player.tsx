import { useState, useRef, useEffect, useCallback, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Slider } from 'antd';
import { Play, Pause } from '@gravity-ui/icons';

import { IconButton } from '../../../../../components/icon-button';
import { NAMESPACE_EDITOR } from '../../../../../providers/schemas-provider/consts';
import { PreviewFrame, type PreviewStatus } from '../common/preview-frame';

import { formatTime, PRECISE_TIME_LIMIT } from './utils';
import * as styles from './audio-player.module.css';

interface AudioPlayerProps {
  src?: string;
}

interface PlayerProps {
  src: string;
}

const Player: FC<PlayerProps> = ({ src }) => {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<PreviewStatus>('loading');
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    return (): void => audio?.pause();
  }, []);

  const handleToggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (isPlaying) {
      audio.pause();
    } else {
      void audio.play();
    }
  }, [isPlaying]);

  const handleSeek = useCallback((value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
    setCurrentTime(value);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    setCurrentTime(audioRef.current?.currentTime ?? 0);
  }, []);
  const handleLoadedMetadata = useCallback(() => {
    setDuration(audioRef.current?.duration ?? 0);
    setStatus('ready');
  }, []);
  const handleError = useCallback(() => setStatus('error'), []);
  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);

  const withTenths = duration < PRECISE_TIME_LIMIT;

  const title = isPlaying
    ? t('inspector.assetPreview.audio.pause.button.title', {
        ns: NAMESPACE_EDITOR,
      })
    : t('inspector.assetPreview.audio.play.button.title', {
        ns: NAMESPACE_EDITOR,
      });

  return (
    <PreviewFrame
      className={styles.audioPreview}
      status={status}
      testId="audio-player"
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handlePause}
        data-testid="audio-player-element"
      />
      {status === 'ready' ? (
        <div className={styles.player}>
          <IconButton
            icon={isPlaying ? <Pause /> : <Play />}
            title={title}
            onClick={handleToggle}
            data-testid="audio-player-toggle"
          />
          <span className={styles.time} data-testid="audio-player-current-time">
            {formatTime(currentTime, withTenths)}
          </span>

          <Slider
            className={styles.slider}
            min={0}
            max={duration}
            step={0.01}
            value={currentTime}
            onChange={handleSeek}
            tooltip={{ open: false }}
          />
          <span className={styles.time} data-testid="audio-player-duration">
            {formatTime(duration, withTenths)}
          </span>
        </div>
      ) : null}
    </PreviewFrame>
  );
};

/** A small player for an audio asset. */
export const AudioPlayer: FC<AudioPlayerProps> = ({ src }) =>
  src ? <Player key={src} src={src} /> : null;
