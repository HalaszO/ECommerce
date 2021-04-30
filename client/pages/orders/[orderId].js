import useRequest from "../../hooks/useRequest";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import PropTypes from "prop-types";

OrderDisplay.propTypes = {
  currentUser: {
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  },
  order: {
    id: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    userId: PropTypes.string,
    expiresAt: PropTypes.string,
    item: PropTypes.object,
  },
};

// Public Stripe key
const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;

const OrderDisplay = ({ order, currentUser }) => {
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState(0);
  // Payment status
  const [paymentCharged, setPaymentCharged] = useState(false);

  // Request hook for posting about completed payment
  // The request is sent upon a successful Stripe payment
  // After the payment API was notified, set the paymentCharged to true
  const { submitRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: { orderId: order.id },
    onSuccess: (payment) => {
      console.log(payment);
      setPaymentCharged(true);
    },
  });

  // Timer
  useEffect(() => {
    const calcTimeLeft = () => {
      const secondsLeft = (new Date(order.expiresAt) - new Date()) / 1000;
      setTimeLeft(Math.round(secondsLeft));
    };
    // Manually evoke on first render
    calcTimeLeft();
    const timerId = setInterval(calcTimeLeft, 1000);

    // Clear the timer when navigating away
    return () => {
      clearInterval(timerId);
    };
  });

  // Helper function to format countdown timer
  const formatTime = (timeLeft) => {
    let minutes = Math.floor(timeLeft / 60);
    minutes = minutes > 9 ? minutes.toString() : "0" + minutes.toString();
    let seconds = timeLeft % 60;
    seconds = seconds > 9 ? seconds.toString() : "0" + seconds.toString();
    return `${minutes} : ${seconds}`;
  };

  // Formatting time
  const formattedTime = formatTime(timeLeft);

  console.log(`Stripe key: ${STRIPE_PUBLIC_KEY}`);

  // If the timer goes below 0, the order has expired
  if (timeLeft < 0) {
    return (
      <div className="container-md my-4 text-center">
        <h2>Order expired</h2>
      </div>
    );
  }

  // If unauthorized, display message
  if (!currentUser || currentUser.id !== order.userId) {
    return (
      <div className="container-subtitle">
        You don't have permission to visit this page
      </div>
    );
  }

  // Include StripeCheckout element
  // Stripe errors are handled inside the element
  // "token" prop contains the success callback
  return paymentCharged ? (
    <div className="container-md">
      <h2 className="my-2 text-center">Order successfully paid!</h2>
    </div>
  ) : (
    <div className="container-md payment-container">
      <h2 className="text-center">{`Item is reserved for ${formattedTime} min`}</h2>
      <div className="my-4 text-center">
        <StripeCheckout
          token={(token) => {
            submitRequest({ token });
          }}
          stripeKey={STRIPE_PUBLIC_KEY}
          amount={order.item.price * 100}
          currency="EUR"
          email={currentUser.email}
        />
      </div>
      {errors}
    </div>
  );
};

OrderDisplay.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderDisplay;
