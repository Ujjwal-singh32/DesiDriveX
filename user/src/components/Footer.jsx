import React from "react";
import logo from "../assets/carassets/logo.png"
import { NavLink } from "react-router-dom";
const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-l text-black">
        <div>
          <img src={logo} className="mb-5 w-32 ml-8" alt=""></img>
          <p className="w-full md:w-2/3 text-black ml-5">
            {" "}
            This is a Car Lending App where user can Lend any Car for
            their work and Owner can earn money through this....
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-black">
            <li>
              <NavLink to="/" className="hover:text-purple-600">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="hover:text-purple-600">
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/privacy-policy" className="hover:text-purple-600">
                Privacy Policy
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5"> REACH US</p>
          <ul className="flex flex-col gap-1 text-black">
            <li>+91-9341658002</li>
            <li>ujjwalchauhan654@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center text-blue-500">
          Copyright 2024@ujjwalchauhan-- All Right Reserved..
        </p>
      </div>
    </div>
  );
};

export default Footer;
