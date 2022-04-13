import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import { Post } from "../../models/Post";
import Dropdown from "../../shared/components/Dropdown";
import Modal from "../../shared/components/Modal";
import VoteItem from "../../shared/components/VoteItem";
import PrimaryContent from "../components/PrimaryContent";
import {
  sortOptionIcons,
  sortOptionIds,
  sortOptionValues,
} from "../constants/sort-options";
import ButtonNoBorder from "../../shared/components/ButtonNoBorder";
import PostItem from "../components/PostItem";

const PostPage: React.FC<{}> = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const httpClient = useHttpClient();

  const [post, setPost] = useState<Post | null>(null);
  const [selectedOption, setSelectedOption] = useState("new");

  const handleSelectedOption = (newSelectedOption: string) => {
    setSelectedOption(newSelectedOption);
  };

  const handleDismiss = () => {
    // navigate(-1);
  };

  const pullPost = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/posts/${params.postId}`;
      const data = await httpClient.sendRequest(url, "GET");
      const postData = data.post;
      console.log(data);
      const post = new Post(
        postData.id,
        postData.title,
        postData.sub_id.name,
        postData.user_id.username,
        postData.post_time,
        postData.num_upvotes,
        postData.num_comments
      );
      setPost(post);
      console.log(post);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    pullPost();
  }, []);

  // pull the post information from the API
  const imageCSS = "h-4 text-zinc-400 group-hover:text-white transition-colors";
  return (
    <Modal onDismiss={handleDismiss}>
      <div className="mt-20 p-5 mx-20 w/80 bg-zinc-800 border border-zinc-700">
        {httpClient.isLoading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <div>{post && <PrimaryContent post={post} />}</div>
        )}
      </div>
      <div className="mt-5 p-5 mx-20 w/80 bg-zinc-800 border border-zinc-700 m-96">
        <div className="flex items-center space-x-5">
          <p className="text-white">579 comments</p>
          <Dropdown
            light={true}
            navbar={false}
            optionIds={sortOptionIds}
            optionValues={sortOptionValues}
            optionIcons={sortOptionIcons}
            selectedOption={selectedOption}
            handleSelectedOption={handleSelectedOption}
          />
        </div>
        <PostItem>
          <PostItem>
            <PostItem>
              <PostItem></PostItem>
            </PostItem>
          </PostItem>
        </PostItem>

        <PostItem>
          <PostItem></PostItem>
        </PostItem>
      </div>
    </Modal>
  );
};
export default PostPage;
