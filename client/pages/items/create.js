import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";

const createItem = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;
    setPrice(value.toFixed(2));
  };

  const { submitRequest, errors } = useRequest({
    url: "/api/items",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push("/"),
  });

  //To-do: user feedback on successful creation

  const onSubmit = (event) => {
    event.preventDefault();
    submitRequest();
  };

  return (
    <div className="container-md my-4 mx-4">
      <h2 className="container-title">Sell an item</h2>
      <form className="item-form my-4" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control px-3"
            placeholder="Enter item name"
          />
        </div>
        <div className="form-group">
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control px-3"
            placeholder="Enter item price (Eur)"
          />
        </div>
        {errors}
        <button className="btn btn-primary my-3">Submit</button>
      </form>
    </div>
  );
};

export default createItem;
