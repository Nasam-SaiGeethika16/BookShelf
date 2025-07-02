const Subscription = require('./subscription.model');

// Create a new subscription
const createSubscription = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingSubscription = await Subscription.findOne({ email });

    if (existingSubscription) {
      return res.status(409).json({ message: 'Email already subscribed' });
    }

    const newSubscription = new Subscription({ email });
    await newSubscription.save();

    res.status(201).json({
      message: 'Successfully subscribed to the newsletter!',
      subscription: newSubscription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = {
  createSubscription,
};