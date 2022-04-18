import React, { useEffect } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const state: any = location.state;
  const background = state && state.background;

  return (
    <HeaderWrapper>
      <Switch location={background || location}>
        <Route path="/home">
          <Homepage />
        </Route>
        <Route exact path="/search/*">
          <Search />
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

      {background && (
        <Route exact path="/post/:postId">
          <PostPage />
        </Route>
      )}
    </HeaderWrapper>
  );
}

export default App;
