import useRequest from "../../hooks/useRequest";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;

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
    return (
      <div className="container-md my-4 text-center">
        <h2>Order expired</h2>
      </div>
    );
  }

  // Formatting time
  let minutes = Math.floor(timeLeft / 60);
  minutes = minutes > 9 ? minutes.toString() : "0" + minutes.toString();
  let seconds = timeLeft % 60;
  seconds = seconds > 9 ? seconds.toString() : "0" + seconds.toString();
  const formattedTime = `${minutes} : ${seconds}`;

  return !paymentCharged ? (
    <div className="container-md payment-container">
      <h2 className="text-center">{`Item is reserved for ${formattedTime} min`}</h2>
      <div className="my-4 text-center">
        <StripeCheckout
          token={(id) => {
            submitRequest({ token: id });
          }}
          stripeKey={STRIPE_PUBLIC_KEY}
          amount={order.item.price * 100}
          email={currentUser.email}
        />
      </div>
      {errors}
    </div>
  ) : (
    <div class="container-md">
      <h2 className="my-2 text-center">Order successfully paid!</h2>
    </div>
  );
};

OrderDisplay.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderDisplay;
