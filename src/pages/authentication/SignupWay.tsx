import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaStore } from "react-icons/fa";

const SignupWay = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-5xl bg-white rounded-2xl p-10 shadow-lg border border-gray-100">

        {/* TITLE */}
        <h2 className="text-center text-3xl md:text-4xl font-semibold text-gray-800 mb-10">
          Create your account to get started
        </h2>

        {/* CARDS WRAPPER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* BUYER CARD */}
          <div className="bg-white border border-gray-200 rounded-2xl p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition duration-300">

            <div className="bg-orange-50 p-6 rounded-full mb-6">
              <FaShoppingCart className="text-6xl text-orange-600" />
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-orange-600 mb-3">
              Register as a Buyer
            </h3>

            <p className="text-gray-600 text-lg mb-8">
              Shop for the best products.
            </p>

            <button
              onClick={() => navigate("/buyer/signup")}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg text-lg transition"
            >
              Sign Up as Buyer
            </button>
          </div>

          {/* SELLER CARD */}
          <div className="bg-white border border-gray-200 rounded-2xl p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition duration-300">

            <div className="bg-green-50 p-6 rounded-full mb-6">
              <FaStore className="text-6xl text-green-600" />
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-green-600 mb-3">
              Register as a Seller
            </h3>

            <p className="text-gray-600 text-lg mb-8">
              Start selling your products.
            </p>

            <button
              onClick={() => navigate("/seller/signup")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg text-lg transition"
            >
              Sign Up as Seller
            </button>
          </div>
        </div>

        {/* LOGIN LINK */}
        <div className="text-center mt-10 text-gray-600 text-lg">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            Log in
          </span>
        </div>

      </div>
    </div>
  );
};

export default SignupWay;