import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const BottomBar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {sidebarLinks.map((link: INavLink) => {
        const isActive = pathname === link.route;

        return (
          <Link
            to={link.route}
            className={`${
              isActive && "bg-primary-500 rounded-[10px]"
            } flex-center flex-col gap-1 p-2 transition`}
            key={link.label}
          >
            <img
              src={link.imgURL}
              alt={`sidebar ${link.label}`}
              width={16}
              height={16}
              className={`${isActive && "invert-white"}`}
            />
            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default BottomBar;
