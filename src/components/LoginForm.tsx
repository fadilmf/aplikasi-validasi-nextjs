"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials");
        return;
      }

      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <Image
            className="mx-auto"
            src={"/img/PINS_logo.jpg"}
            alt={"PINS_logo"}
            width={300}
            height={300}
          />
          <h2 className="text-2xl font-semibold mb-6">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full border rounded-full px-3 py-2 focus:outline-none focus:border-blue-500"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full border rounded-full px-3 py-2 focus:outline-none focus:border-blue-500"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="bg-green-800 hover:bg-green-900 text-white w-full py-2 px-4 rounded-full"
              >
                Login
              </button>
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
