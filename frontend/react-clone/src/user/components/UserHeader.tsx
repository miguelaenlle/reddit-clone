import React from "react";

import { PencilIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import { User } from "../../models/User";
import LightButton from "../../shared/components/LightButton";

const UserHeader: React.FC<{}> = (props) => {
  const params = useParams<{ userId: string }>();
  const editingEnabled = false;
  const httpClient = useHttpClient();

  const [user, setUser] = useState<User | null>(null);

  const initializeUser = async () => {
    try {
      const userId = params.userId;
      const user = await httpClient.fetchUser(userId);
      if (user) {
        const userData = user.data;
        setUser(new User(userId, userData.username, userData.num_upvotes));
      }
    } catch (error) {}
  };

  useEffect(() => {
    initializeUser();
  }, []);

  return (
    <div>
      <div className="items-center space-x-5 flex p-5 bg-zinc-800 border-y border-zinc-700">
        <div>
          <div
            className={`group flex ${
              editingEnabled ? "hover:cursor-pointer hover:border-zinc-400" : ""
            } justify-center items-center group h-24 w-24 bg-zinc-700 border-4 border-zinc-600 rounded-full`}
          >
            <h2 className="text-center text-zinc-500 text-5xl">
              {`u/`}
            </h2>
          </div>
        </div>
        <div className="space-y-1">
          <div className="items-center flex space-x-3">
            {httpClient.isLoading ? (
              <div className="animate-pulse bg-zinc-600 h-8 w-52 "></div>
            ) : (
              <h1 className="text-white text-2xl">u/{user?.username ?? ""}</h1>
            )}
          </div>
          {httpClient.isLoading ? (
            <div className="animate-pulse bg-zinc-700 h-8 w-32 "></div>
          ) : (
            <h1 className="text-zinc-400 text-lg">
              {user?.upvotes ?? 0} karma
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};
export default React.memo(UserHeader);
