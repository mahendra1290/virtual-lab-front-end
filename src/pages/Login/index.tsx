import React from "react";
import { Link } from "react-router-dom";

export const Login = () => {
  return (
    <div className="h-full p-2">
      <div className="mx-auto mt-24 flex w-full flex-col gap-4 rounded-md border-2 p-8 sm:w-2/3 lg:w-1/3">
        <h1 className="mb-1 text-2xl">Login</h1>
        <label className="block">
          <span className="text-gray-700">Email</span>
          <input
            className="mt-1 block w-full rounded-sm"
            type="text"
            name="email"
            id="email"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Password</span>
          <input
            className="mt-1 block w-full rounded-sm"
            type="text"
            name="password"
            id="password"
          />
        </label>

        <button className="rounded-full bg-blue-200 px-4 py-2">Login</button>
        <Link to="forgot password" className="text-sm">
          Forgot password?
        </Link>
        <div className="flex items-center gap-2">
          <hr className="flex-1" />
          <span>Or</span>
          <hr className="flex-1" />
        </div>
        <button className="rounded-full border-2 px-4 py-2">
          Login with Google
        </button>
        <div className="mx-auto">
          <span className="text-sm">Don't have an account?</span>
          <span className="ml-1 text-blue-500">
            <Link className="text-sm" to="/sign-up">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
