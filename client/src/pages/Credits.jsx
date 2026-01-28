import { useEffect, useState } from "react";
import Loading from "./Loading";
import { dummyPlans } from "../assets/assets";

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    setPlans(dummyPlans);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-semibold mb-10 xl:mb-30 text-gray-800 dark:text-purple-100">
        Subscription Plans
      </h2>
      <div className="flex flex-wrap gap-8 justify-center">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`border border-gray-200 dark:border-purple-700
              rounded-lg shadow hover:shadow-lg transition-shadow p-6 min-w-75 flex flex-col
              ${plan._id === "pro" ? "bg-purple-400 dark:bg-purple-800 text-white" : "bg-white dark:bg-transparent text-gray-800 dark:text-purple-100"}`}
          >
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-purple-100">
                {plan.name}
              </h3>
              <p className="text-4xl font-bold mb-6">
                ${plan.price}
                <span className="text-lg font-normal text-gray-600 dark:text-purple-300">
                  {" "}
                  / {plan.credits} Credits
                </span>
              </p>
              <ul className="mb-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span
                      className="inline-block w-6 h-6 mr-3
                    bg-green-500 text-white rounded-full text-center
                    flex items-center justify-center"
                    >
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className={`w-full py-3 px-4 rounded-md font-semibold cursor-pointer
              ${plan._id === "pro" ? "bg-white text-purple-600 hover:bg-purple-100" : "bg-purple-600 text-white hover:bg-purple-700"}`}
            >
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
