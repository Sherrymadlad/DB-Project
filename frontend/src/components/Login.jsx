import Logo from "../assets/Logo.png";

const Login = () => {
  return (
    <div className="w-full h-screen flex flex-row text-theme-brown bg-gray-100">

      <div className="w-1/2 flex items-center justify-center bg-white rounded-r-[20%]">
        <img src={Logo} alt="Logo" className="w-full object-contain p-10" />
      </div>

      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <div className="flex flex-col gap-6 rounded-2xl w-[80%] max-w-md p-10 bg-white shadow-2xl">
          <h2 className="text-2xl font-semibold text-center">Login to Your Account</h2>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm mb-1">Username</label>
              <input
                type="username"
                placeholder="e.g. Ali123"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-theme-pink"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-theme-pink"
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-theme-pink text-theme-cream rounded px-4 py-2 hover:bg-pink-700 transition"
            >
              Log In
            </button>
          </form>

          <p className="text-sm text-center">
            Don't have an account? <a className="text-theme-pink hover:underline" href="#">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
