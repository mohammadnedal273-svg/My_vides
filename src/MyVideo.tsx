import {AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Cairo';
import clips from './clips.json';
import config from './config.json';

const {fontFamily} = loadFont('normal', {weights: ['700'], subsets: ['arabic']});

export const TOTAL = 900;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const levels = [1.04, 1.18, 1.08, 1.22];
const GOLD = '#ffd34d';

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const seg = Math.floor(frame / 90);
  const local = frame - seg * 90;
  const cur = levels[seg % 4];
  const prev = seg === 0 ? cur : levels[(seg - 1) % 4];
  const pop = spring({frame: local, fps, durationInFrames: 18, config: {damping: 14}});
  const scale = lerp(prev, cur, pop) + local * 0.0004;
  const flash = seg === 0 ? 0 : interpolate(local, [0, 3, 8], [0.3, 0.15, 0], clamp);

  const introIn = spring({frame, fps, config: {damping: 14}});
  const introOpacity = interpolate(frame, [0, 10, 60, 78], [0, 1, 1, 0], clamp);
  const dim = interpolate(frame, [0, 60, 85], [0.55, 0.55, 0], clamp);

  const ltIn = spring({frame: Math.max(0, frame - 105), fps, config: {damping: 16}});
  const ltOut = spring({frame: Math.max(0, frame - 330), fps, config: {damping: 200}});
  const ltX = (1 - ltIn + ltOut) * 800;

  const cap = config.captions.find((c) => frame >= c.from * 30 && frame < c.to * 30);
  const capIn = cap ? spring({frame: frame - cap.from * 30, fps, config: {damping: 12}}) : 0;

  const ctaIn = spring({frame: Math.max(0, frame - 790), fps, config: {damping: 9}});
  const pulse = 1 + 0.04 * Math.sin(frame / 5);

  return (
    <AbsoluteFill style={{backgroundColor: 'black', fontFamily, fontWeight: 700, direction: 'rtl'}}>
      <AbsoluteFill style={{transform: `scale(${scale})`, filter: 'contrast(1.08) saturate(1.15)'}}>
        <OffthreadVideo src={staticFile(clips[0])} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
      <AbsoluteFill style={{backgroundColor: 'black', opacity: dim}} />
      <AbsoluteFill style={{backgroundColor: 'white', opacity: flash}} />
      <div style={{position: 'absolute', top: 90, left: 60, height: 8, width: (frame / TOTAL) * 960, background: GOLD, borderRadius: 4}} />

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, opacity: introOpacity}}>
        <div style={{color: 'white', fontSize: 120, textAlign: 'center', lineHeight: 1.4, textShadow: '0 4px 24px rgba(0,0,0,0.7)', transform: `scale(${lerp(0.8, 1, introIn)})`}}>{config.title}</div>
        <div style={{color: GOLD, fontSize: 56, textAlign: 'center', marginTop: 20}}>{config.subtitle}</div>
        <div style={{height: 8, width: `${introIn * 40}%`, background: GOLD, borderRadius: 4, marginTop: 36}} />
      </AbsoluteFill>

      <div style={{position: 'absolute', right: 0, bottom: 360, transform: `translateX(${ltX}px)`, background: 'rgba(0,0,0,0.55)', borderRight: `10px solid ${GOLD}`, padding: '20px 50px', color: 'white', fontSize: 46}}>
        {config.channel}
      </div>

      {cap && (
        <div style={{position: 'absolute', left: 60, right: 60, bottom: 560, textAlign: 'center'}}>
          <span style={{display: 'inline-block', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: 62, lineHeight: 1.5, padding: '10px 36px', borderRadius: 24, transform: `scale(${lerp(0.85, 1, capIn)})`}}>{cap.text}</span>
        </div>
      )}

      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 360}}>
        <div style={{background: GOLD, color: '#111', fontSize: 64, padding: '24px 80px', borderRadius: 60, transform: `scale(${ctaIn * pulse})`}}>{config.cta}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
