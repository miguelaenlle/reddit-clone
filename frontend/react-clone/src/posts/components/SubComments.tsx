import React from "react";
import PostItem from "./PostItem";

const SubComments: React.FC<{
  comments: { [key: string]: any }[];
  deleteComment: (commentId: string) => void;
}> = (props) => {
  return (
    <React.Fragment>
      {props.comments && (
        <React.Fragment>
          {props.comments
            .sort((comment1: any, comment2: any) => {
              return comment1.date < comment2.date ? 1 : -1;
            })
            .map((commentData: { [key: string]: any }) => {
              return (
                <PostItem
                  key={`comment-response-${Math.random().toString()}`}
                  comment={commentData}
                  deleteComment={props.deleteComment}
                />
              );
            })}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default React.memo(SubComments);
