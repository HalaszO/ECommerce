import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";

const useUser = ({ redirectTo, redirectIfFound = false } = {}) => {
  // Fetching user using swr
  const { data } = useSWR("/api/users/currentuser");
  const user = data.currentUser;
  useEffect(() => {
    // if redirect is undefined (already logged in) or data fetching is in progress, then do nothing
    if (!redirectTo || !user) {
      return;
    }
    // once data fetching is complete redirect if user was not found
    // or if redirectIfFound is defined and user was found
    if (
      (redirectTo && !redirectIfFound && !user) ||
      (redirectIfFound && user)
    ) {
      Router.push(redirectTo);
    }
  }, [user, redirectTo, redirectIfFound]);

  return { user };
};

export default useUser;

// To-do: Return loading state
