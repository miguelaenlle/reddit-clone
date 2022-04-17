import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ConfirmEmail from "./account/pages/Confirmation/ConfirmEmail";
import WaitConfirmEmail from "./account/pages/Confirmation/WaitConfirmEmail";
import Login from "./account/pages/Login";
import RequestResetPassword from "./account/pages/ResetPassword/RequestResetPassword";
import ResetPassword from "./account/pages/ResetPassword/ResetPassword";
import WaitResetPassword from "./account/pages/ResetPassword/WaitResetPassword";
import Signup from "./account/pages/Signup";
import Homepage from "./homepage/pages/Homepage";
import HeaderWrapper from "./navbar/wrappers/HeaderWrapper";
import AllPosts from "./posts/pages/AllPosts";
import Post from "./posts/pages/Post";
import Search from "./search/pages/Search";
import AllSubreddits from "./subreddit/pages/AllSubreddits";
import Subreddit from "./subreddit/pages/Subreddit";
import AllUsers from "./user/pages/AllUsers";
import User from "./user/pages/UserPage";
import CreateSubreddit from "./subreddit/pages/CreateSubreddit";
import CreatePost from "./posts/pages/CreatePost";
import PostPage from "./posts/pages/Post";

function App() {
  return (
    <HeaderWrapper>
      <Switch>
        <Route path="/home">
          <Homepage />
        </Route>
        {/* <Route path={`/post/:postId`} element={<Post />} />
          <Route path={`/signup`} element={<Signup />} />
          <Route path={`/login`} element={<Login />} />
          <Route path={`/reset-password`} element={<RequestResetPassword />} />
          <Route
            path={`/wait-reset-password`}
            element={<WaitResetPassword />}
          />
          <Route path={`/reset-password-prompt`} element={<ResetPassword />} />
          <Route path={`/wait-confirm-email`} element={<WaitConfirmEmail />} />
          <Route
            path={`/confirm-email/:passwordToken`}
            element={<ConfirmEmail />}
          />
          <Route path={`/create-post`} element={<CreatePost />} />
          <Route path={`/create-sub`} element={<CreateSubreddit />} /> */}
        {/* </Route> */}
        <Route exact path="/search/*">
          <Search />
        </Route>
        <Route exact path="/post/:postId">
          <div className="w-screen h-screen bg-zinc-800">
            <PostPage />
          </div>
        </Route>
        <Route exact path="/sub/:subId">
          <Subreddit />
        </Route>
        <Route exact path="/user/:userId">
          <User />
        </Route>

        <Route exact path="/all/subs">
          <AllSubreddits />
        </Route>
        <Route exact path="/all/users">
          <AllUsers />
        </Route>
        <Route exact path="/all/posts">
          <AllPosts />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </Switch>
    </HeaderWrapper>
  );
}

export default App;
