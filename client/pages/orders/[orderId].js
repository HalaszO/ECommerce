import useRequest from "../../hooks/useRequest";
import { useEffect, useState } from "react";

const OrderDisplay = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState("");

  // Timer
  useEffect(() => {
    const calcTimeLeft = () => {
      const secondsLeft = (new Date(order.expiresAt) - new Date()) / 1000;
      setTimeLeft(formatTime(Math.round(secondsLeft)));
    };

    calcTimeLeft(); // first render
    const timerId = setInterval(calcTimeLeft, 1000);

    // Clear the timer when navigating away
    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft.minutes && timeLeft.seconds < 0) {
    return <div>Order expired</div>;
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    minutes = minutes > 10 ? minutes.toString() : "0" + minutes.toString();
    let seconds = time % 60;
    seconds = seconds > 10 ? seconds.toString() : "0" + seconds.toString();
    return { minutes, seconds };
  };

  return (
    <h2>{`Item is reserved for ${timeLeft.minutes} : ${timeLeft.seconds} min`}</h2>
  );
};

OrderDisplay.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderDisplay;
