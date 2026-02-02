import Transaction from "../models/Transaction";
import Stripe from "stripe";

const plans = [
  {
    _id: "basic",
    name: "Basic",
    price: 10,
    credits: 100,
    features: [
      "100 text generations",
      "50 image generations",
      "Standard support",
      "Access to basic models",
    ],
  },
  {
    _id: "pro",
    name: "Pro",
    price: 20,
    credits: 500,
    features: [
      "500 text generations",
      "200 image generations",
      "Priority support",
      "Access to pro models",
      "Faster response time",
    ],
  },
  {
    _id: "premium",
    name: "Premium",
    price: 30,
    credits: 1000,
    features: [
      "1000 text generations",
      "500 image generations",
      "24/7 VIP support",
      "Access to premium models",
      "Dedicated account manager",
    ],
  },
];

// Function to get all plans
export const getAllPlans = (req, res) => {
  try {
    res.status(200).json({ plans, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const stripe = new Stripe(process.env.SECRET_KEY);

// Api for purchase plan
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;
    const plan = plans.find((p) => p._id === planId);

    if (!plan) {
      return res
        .status(404)
        .json({ message: "Plan not found", success: false });
    }

    // Create new transaction
    const transaction = await Transaction.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false,
    });

    const { origin } = req.headers;
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
            },
            unit_amount: plan.price * 100,
          },
          quantity: 2,
        },
      ],
      mode: "payment",
      success_url: `${origin}/loading`,
      cancel_url: `${origin}`,
      metadata: { transactionId: transaction._id.toString(), appId: "AI-Chat" },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    res.status(200).json({ url: session.url, success: true });
  } catch {
    res.status(500).json({ message: error.message, success: false });
  }
};
