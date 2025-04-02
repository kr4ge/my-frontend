import HandleLoading from "../components/HandleLoading";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import apiConn from "../api";

function UserRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    apiConn
      .post("api/user/register/", { username, email, password })
      .then(() => {
        localStorage.clear();
        navigate("/login");
      })
      .catch((err) => alert("Registration failed. Try again." + err))
      .finally(() => setIsLoading(false));
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="form-container w-[380px] bg-white rounded-lg shadow-md p-6 mx-auto"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: 0.2,
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <h2 className="text-5xl font-semibold text-center text-gray-700 pt-3">
        Register
      </h2>

      <form className="mt-10" onSubmit={handleSubmit}>
        {/* Username */}
        <motion.div className="mb-4" variants={sectionVariants}>
          <label
            htmlFor="username"
            className="block text-lg font-medium text-gray-600"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none"
            placeholder="Enter your username"
            required
          />
        </motion.div>

        {/* Email */}
        <motion.div className="mb-4" variants={sectionVariants}>
          <label
            htmlFor="email"
            className="block text-lg font-medium text-gray-600"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </motion.div>

        {/* Password */}
        <motion.div className="mb-4" variants={sectionVariants}>
          <label
            htmlFor="password"
            className="block text-lg font-medium text-gray-600"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none"
            placeholder="Enter your password"
            required
          />
        </motion.div>

        {isLoading && <HandleLoading />}

        <button
          type="submit"
          className="w-full mt-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Register
        </button>
      </form>

      <p className="mt-5 text-center text-gray-600 text-lg">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-blue-500 font-medium hover:text-blue-800"
        >
          Login
        </a>
      </p>
    </motion.div>
  );
}

export default UserRegister;
