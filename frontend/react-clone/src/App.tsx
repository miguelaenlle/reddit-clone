import React from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import ConfirmEmail from "./account/pages/Confirmation/ConfirmEmail";
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
import { useAuth } from "./hooks/auth-hook";
import { AuthContext } from "./context/auth-context";
import RequestResetPassword from "./account/pages/ResetPassword/RequestResetPassword";
import SetNewPassword from "./account/pages/Confirmation/ConfirmEmail";
import CreateSubreddit from "./subreddit/pages/CreateSubreddit";

function App() {
  const auth = useAuth();
  const location = useLocation();

  const state: any = location.state;
  const background = state && state.background;

  return (
    <AuthContext.Provider
      value={{
        username: auth.username,
        isLoggedIn: auth.isLoggedIn,
        userId: auth.userId,
        token: auth.token,
        login: auth.login,
        logout: auth.logout,
      }}
    >
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

          <Route exact path="/verify-email">
            <ConfirmEmail />
          </Route>

          <Route exact path="/new-password">
            <ResetPassword />
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
              <RequestResetPassword />
            </Route>
            <Route exact path="/create-sub">
              <CreateSubreddit />
            </Route>
          </Switch>
        )}
      </HeaderWrapper>
    </AuthContext.Provider>
  );
}

export default App;
