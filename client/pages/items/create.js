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
    <div>
      <h2 className="my-4">Create an item</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default createItem;
