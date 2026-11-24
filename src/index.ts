import {Composition, registerRoot} from 'remotion';
import {MyVideo, TOTAL} from './MyVideo';

const RemotionRoot: React.FC = () => (
  <Composition
    id="MyVideo"
    component={MyVideo}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);

registerRoot(RemotionRoot);
