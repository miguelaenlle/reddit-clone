import React from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import ConfirmEmail from "./account/pages/Confirmation/ConfirmEmail";
import WaitConfirmEmail from "./account/pages/Confirmation/WaitConfirmEmail";
import Login from "./account/pages/Login";
import ResetPassword from "./account/pages/ResetPassword/ResetPassword";
import Signup from "./account/pages/Signup";
import Homepage from "./homepage/pages/Homepage";
import HeaderWrapper from "./navbar/wrappers/HeaderWrapper";
import AllPosts from "./posts/pages/AllPosts";
import PostPage from "./posts/pages/Post";
import Search from "./search/pages/Search";
import AllSubreddits from "./subreddit/pages/AllSubreddits";
import Subreddit from "./subreddit/pages/Subreddit";
import AllUsers from "./user/pages/AllUsers";
import User from "./user/pages/UserPage";

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
        <Route path="*">
          <Redirect to="/home" />
        </Route>
      </Switch>

      {background && (
        <Switch>
          <Route exact path="/post/:postId">
            <PostPage />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>

          <Route exact path="/reset-password">
            <ResetPassword />
          </Route>
        </Switch>
      )}
    </HeaderWrapper>
  );
}

export default App;
