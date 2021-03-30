import useRequest from "../../hooks/useRequest";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

// To-do: extract key to env var
const STRIPE_PUB_KEY =
  "pk_test_51IX6VFCUnkyQdSge8PjmrrdKMDiSk6mzJ3Dbo5j0C8BY8H0SLGeNb33W8JN9lP8vxxLJnbJDDxo1HsSSwPU3BvtB00pnq1Psd2";

const OrderDisplay = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [paymentCharged, setPaymentCharged] = useState(false);

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

    calcTimeLeft(); // first render
    const timerId = setInterval(calcTimeLeft, 1000);

    // Clear the timer when navigating away
    return () => {
      clearInterval(timerId);
    };
  }, []);

  // If the timer goes below 0, the order has expired
  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  // Formatting time
  let minutes = Math.floor(timeLeft / 60);
  minutes = minutes > 9 ? minutes.toString() : "0" + minutes.toString();
  let seconds = timeLeft % 60;
  seconds = seconds > 9 ? seconds.toString() : "0" + seconds.toString();
  const formattedTime = `${minutes} : ${seconds}`;

  return !paymentCharged ? (
    <div>
      <h2>{`Item is reserved for ${formattedTime} min`}</h2>
      <StripeCheckout
        token={(id) => {
          submitRequest({ token: id });
        }}
        stripeKey={STRIPE_PUB_KEY}
        amount={order.item.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  ) : (
    <div>
      <h1>Order successfully paid!</h1>
    </div>
  );
};

OrderDisplay.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderDisplay;
