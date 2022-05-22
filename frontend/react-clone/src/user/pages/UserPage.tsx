import { useParams } from "react-router-dom";
import {
  optionIds,
  sortOptionIcons,
  sortOptionValues,
} from "../../homepage/constants/sort-modes";
import { usePostsClient } from "../../hooks/post-hook";
import PostCollection from "../../posts/components/PostCollection";
import Dropdown from "../../shared/components/Dropdown";
import UserHeader from "../components/UserHeader";
import UserSubreddits from "../components/UserSubreddits";

const RESULTS_PER_PAGE = 25;
const User: React.FC<{}> = (props) => {
  const params = useParams<{ userId: string }>();
  const postClient = usePostsClient(
    false,
    undefined,
    params.userId,
    undefined,
    RESULTS_PER_PAGE
  );
  return (
    <div className="pt-14 bg-zinc-900 min-h-screen">
      <UserHeader />
      <div className="w-full p-5">
        <h1 className="text-white text-xl pb-5">Subreddits</h1>
        <UserSubreddits userId={params.userId} />
        <div className="pb-20"></div>
        <h1 className="text-white text-xl pb-5">Posts</h1>
        <div className="xs:w-full z-10 relative">
          <Dropdown
            navbar={false}
            optionIds={optionIds}
            optionValues={sortOptionValues}
            optionIcons={sortOptionIcons}
            selectedOption={postClient.selectedOption}
            handleSelectedOption={postClient.handleSelectedOption}
          />
        </div>
        <PostCollection
          query={postClient.query}
          hitLimit={postClient.hitLimit}
          atBottom={postClient.atBottom}
          posts={postClient.posts}
          isLoading={postClient.httpIsLoading}
          httpIsLoading={postClient.httpIsLoading}
          numResultsPerPage={RESULTS_PER_PAGE}
          page={postClient.page}
          expandResults={postClient.expandResults}
          handleHitBottom={postClient.handleHitBottom}
        />
      </div>
    </div>
  );
};
export default User;
