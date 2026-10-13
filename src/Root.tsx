import { Composition } from "remotion";
import { Consistency, CONSISTENCY_FRAMES } from "./posts/Consistency";
import { Boosting, BOOSTING_FRAMES } from "./posts/Boosting";
import { ShopDoor, SHOPDOOR_FRAMES } from "./posts/ShopDoor";
import { TalkToOne, TALKTOONE_FRAMES } from "./posts/TalkToOne";
import { ReplyFast, REPLYFAST_FRAMES } from "./posts/ReplyFast";
import { Followers, FOLLOWERS_FRAMES } from "./posts/Followers";

// All posts: 1080x1350 (4:5, works on LinkedIn + Instagram feed), always 60fps.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Consistency" component={Consistency} durationInFrames={CONSISTENCY_FRAMES} fps={60} width={1080} height={1350} />
      <Composition id="Followers" component={Followers} durationInFrames={FOLLOWERS_FRAMES} fps={60} width={1080} height={1350} />
      <Composition id="Boosting" component={Boosting} durationInFrames={BOOSTING_FRAMES} fps={60} width={1080} height={1350} />
      <Composition id="ShopDoor" component={ShopDoor} durationInFrames={SHOPDOOR_FRAMES} fps={60} width={1080} height={1350} />
      <Composition id="TalkToOne" component={TalkToOne} durationInFrames={TALKTOONE_FRAMES} fps={60} width={1080} height={1350} />
      <Composition id="ReplyFast" component={ReplyFast} durationInFrames={REPLYFAST_FRAMES} fps={60} width={1080} height={1350} />
    </>
  );
};
