import { createLazyFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async () => {
    setLoading(true);

    console.log("Register");
  };

  return (
    <div className="p-2">
      <p className="text-4xl text-accent font-bold">Create an Account</p>
      <p className="mb-3">Register to get your access!</p>
      <div className="card w-96 bg-base-100 shadow-sm border mb-3 rounded-md">
        <div className="card-body">
          <form action="">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Username</span>
              </div>
              <input
                type="text"
                placeholder="input your username here"
                className="input input-bordered w-full max-w-xs"
              />
              <div className="label">
                <span className="label-text-alt"></span>
              </div>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                placeholder="input your password here"
                className="input input-bordered w-full max-w-xs"
              />
              <div className="label">
                <span className="label-text-alt text-error"></span>
              </div>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Confirm Password</span>
              </div>
              <input
                type="password"
                placeholder="input your password here"
                className="input input-bordered w-full max-w-xs"
              />
              <div className="label">
                <span className="label-text-alt text-error"></span>
              </div>
            </label>
            <button
              className="btn btn-primary w-full mt-2"
              onClick={(e) => {
                e.preventDefault();
                handleRegister();
              }}
              disabled={loading}
            >
              {loading && (
                <span className="loading loading-infinity loading-sm"></span>
              )}
              Register
            </button>
          </form>
        </div>
      </div>
      <p>
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-accent"
        >
          Login
        </Link>{" "}
      </p>
    </div>
  );
}
