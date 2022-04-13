import { useState } from "react";

import { Post } from "../../models/Post";
import LightButton from "../../shared/components/LightButton";
import VoteItem from "../../shared/components/VoteItem";
import { ReplyIcon, PencilIcon, XIcon } from "@heroicons/react/outline";

const PrimaryContent: React.FC<{
  post: Post;
}> = (props) => {
  const [upvotes, setUpvotes] = useState(0);
  const [voteDirection, setVoteDirection] = useState(0);

  const handleUpvote = () => {
    setVoteDirection((previousVote) => {
      if (previousVote === 1) {
        setUpvotes((previousVotes) => previousVotes - 1);
        return 0;
      } else if (previousVote === 0) {
        setUpvotes((previousVotes) => previousVotes + 1);
        return 1;
      } else if (previousVote === -1) {
        setUpvotes((previousVotes) => previousVotes + 2);
        return 1;
      } else {
        return previousVote;
      }
    });
  };
  const handleDownvote = () => {
    setVoteDirection((previousVote) => {
      if (previousVote === -1) {
        setUpvotes((previousVotes) => previousVotes + 1);
        return 0;
      } else if (previousVote === 0) {
        setUpvotes((previousVotes) => previousVotes - 1);
        return -1;
      } else if (previousVote === 1) {
        setUpvotes((previousVotes) => previousVotes - 2);
        return -1;
      } else {
        return previousVote;
      }
    });
  };

  const imageCSS = "h-4 text-zinc-400 group-hover:text-white transition-colors";
  return (
    <div>
      <p>
        <span className="text-sm text-white hover:underline hover:cursor-pointer">
          u/{props.post.opName}
        </span>{" "}
        <span className="text-zinc-400">
          on{" "}
          <span className="hover:underline hover:cursor-pointer">
            r/battlestations
          </span>{" "}
          3 hours ago
        </span>{" "}
      </p>
      <h1 className="mt-1.5 text-3xl text-white">The best PC setup of 2022</h1>
      <p className="mt-3 text-zinc-200 text-lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
        euismod, urna eu tincidunt consectetur, nisl urna euismod nisi, eu
        porttitor nisl nisi euismod nisl.
      </p>
      <div className="mt-14 space-x-2 flex">
        <VoteItem
          voteDirection={voteDirection}
          numUpvotes={upvotes}
          handleUpvote={handleUpvote}
          handleDownvote={handleDownvote}
        />
        <LightButton
          buttonImage={<ReplyIcon className={imageCSS} />}
          buttonText="Reply"
        />
        <LightButton
          buttonImage={<PencilIcon className={imageCSS} />}
          buttonText="Edit"
        />
        <LightButton
          buttonImage={<XIcon className={imageCSS} />}
          buttonText="Delete"
        />
      </div>
    </div>
  );
};
export default PrimaryContent;
