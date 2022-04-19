import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import { Post } from "../../models/Post";
import Modal from "../../shared/components/Modal";
import Comments from "../components/Comments";
import PrimaryContent from "../components/PrimaryContent";

const PostPage: React.FC<{}> = (props) => {
  const history = useHistory();
  const params = useParams<{ postId: string }>();
  const httpClient = useHttpClient();

  const [post, setPost] = useState<Post | null>(null);
  const handleDismiss = () => {
    history.goBack();
  };

  const pullPost = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/posts/${params.postId}`;
      const data = await httpClient.sendRequest(url, "GET");
      const postData = data.post;
      const post = new Post(
        postData.id,
        postData.title,
        postData.text,
        postData.sub_id.name,
        postData.sub_id._id,
        postData.user_id.username,
        postData.user_id._id,
        postData.post_time,
        postData.num_upvotes,
        postData.num_comments
      );
      setPost(post);
    } catch (error) {}
  };

  useEffect(() => {
    pullPost();
  }, []);

  // pull the post information from the API
  return (
    <Modal >
      <div className="z-50 mt-20 p-5 mx-20 w/80 bg-zinc-800 border border-zinc-700">
        {httpClient.isLoading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <div>{post && <PrimaryContent post={post} />}</div>
        )}
      </div>
      {post && <Comments post={post} />}
    </Modal>
  );
};
export default PostPage;
