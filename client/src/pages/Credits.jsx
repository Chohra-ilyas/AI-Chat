import { useEffect, useState } from "react";
import Loading from "./Loading";
import { dummyPlans } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, axios } = useAppContext();

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get("/api/credits/plans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setPlans(data.plans);
      } else {
        toast.error(data.message || "Failed to fetch plans. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("An error occurred while fetching plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const purchasePlan = async (planId) => {
    try {
      const { data } = await axios.post(
        "/api/credits/purchase",
        { planId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(
          data.message || "Failed to purchase plan. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error purchasing plan:", error);
      toast.error(
        "An error occurred while purchasing the plan. Please try again.",
      );
    }
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
                    bg-green-500 text-white rounded-full text-center items-center justify-center"
                    >
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() =>
                toast.promise(purchasePlan(plan._id), {
                  loading: "Processing your purchase...",
                  success: "Redirecting to payment gateway!",
                  error: "Failed to process purchase. Please try again.",
                })
              }
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
