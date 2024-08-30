import React from "react";
import ProfileDropdown from "./ProfileDropdown";
import Link from "next/link";

const Nav: React.FC = () => {
  return (
    <nav>
      <div className="px-3 sm:px-6 py-3 flex justify-between items-center">
        <Link href="/">Wizard wallet</Link>
        <div className="flex items-center">
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
