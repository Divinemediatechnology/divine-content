import { Composition } from "remotion";
import { Consistency, CONSISTENCY_FRAMES } from "./posts/Consistency";

// All posts: 1080x1350 (4:5, works on LinkedIn + Instagram feed), always 60fps.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Consistency" component={Consistency} durationInFrames={CONSISTENCY_FRAMES} fps={60} width={1080} height={1350} />
    </>
  );
};
