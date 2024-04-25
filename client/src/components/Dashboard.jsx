import React from "react";
import { Bookdrawer, Navbar, UserBookSearch } from "../components";

export default function Dashboard({ profile, logOut }) {
  return (
    <div>
      <div className="flex justify-between">
        <Bookdrawer />
        <Navbar profile={profile} logOut={logOut} />
      </div>
      <UserBookSearch />
    </div>
  );
}
