import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductToview, addproducts } from "../../actions";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import customFetch from "../../apiCall";
import { ToastContainer } from "react-toastify";
import { showToastMessage } from "../../Notification/notify";
import "react-toastify/dist/ReactToastify.css";
import { addCart, CartItems } from "../../actions";

export default function ProductItem({ item }) {
  const [addedItem, setaddedItem] = useState(true);
  const [title, settitle] = useState(item.title);
  const [price, setprice] = useState(item.price);
  const [rating, setrating] = useState(item.rating);
  const [description, setdescription] = useState(item.description);
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dispatchCart = useDispatch();
  const dispatchTotal = useDispatch();
  const dispatchProduct = useDispatch();

  const filledStars = Math.round(item.rating);
  // Calculate the number of empty stars
  const emptyStars = 5 - filledStars;

  // Function to generate filled star icons
  const renderFilledStars = () => {
    const stars = [];
    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <span key={i} style={{ color: "gold" }}>
          &#9733;
        </span>
      );
    }
    return stars;
  };
  function handleCart(item) {
    if (addedItem) {
      item.qty = 1;
      dispatchCart(addCart(item));
      dispatchTotal(CartItems());
      setaddedItem(false);
      showToastMessage("item Added to cart", "success");
    } else {
      navigate("/cart");
    }
  }

  // Function to generate empty star icons
  const renderEmptyStars = () => {
    const stars = [];
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={i + filledStars}>&#9734;</span>);
    }
    return stars;
  };

  function handleClick(item) {
    dispatch(ProductToview(item));
    navigate(`/productdetails/${item.id}`);
  }
  function handleEdit(item) {
    item.edit = false;
    dispatchProduct(addproducts([...products]));
  }
  // making delete request
  function handleDelelteProduct(item) {
    let url = `https://my-json-server.typicode.com/smitranjansingh29/projectData/products/${item.id}`;
    let result = customFetch(url, { method: "DELETE" });

    let index = products.indexOf(item);
    products.splice(index, 1);
    dispatchProduct(addproducts([...products]));
    showToastMessage("item deleted", "warning");
  }
  // closing edit mode
  function handleCancel(item) {
    item.edit = true;
    dispatchProduct(addproducts([...products]));
  }
  // making put request after click on save button of edit
  function handleSave(item) {
    let url = `https://my-json-server.typicode.com/smitranjansingh29/projectData/products/${item.id}`;
    let result = customFetch(url, {
      body: {
        ...item,
        title,
        price,
        rating,
        description,
        edit: true,
      },
      method: "PUT",
    });
    result.then((data) => {
      let index = products.indexOf(item);
      products[index] = data;

      dispatchProduct(addproducts([...products]));
      showToastMessage("Edit suceesful", "success");
    });
  }
  return (
    //   container
    <div className="d-flex container-sm bg-white px-1 py-5 mt-4 flex-column flex-lg-row gap-3">
      {/* left section  */}
      <ToastContainer />
      <div className="d-flex container-sm gap-5">
        <img
          src={item.thumbnail}
          alt="Not found"
          width={"200rem"}
          onClick={() => handleClick(item)}
        />
        {/* right-part Content  */}
        <div className="d-flex flex-column gap-2">
          {item.edit ? (
            <span>Product Name: {item.title}</span>
          ) : (
            <>
              Product Name:
              <input
                type="text"
                value={title}
                className="w-50"
                onChange={(e) => settitle(e.target.value)}
              ></input>
            </>
          )}
          {item.edit ? (
            <span>Price: {item.price}</span>
          ) : (
            <>
              Price:
              <input
                type="text"
                value={price}
                className="w-50"
                onChange={(e) => setprice(e.target.value)}
              ></input>
            </>
          )}
          {item.edit ? (
            <span>
              {renderFilledStars()}
              {renderEmptyStars()}
            </span>
          ) : (
            <>
              Rating:
              <div>
                <input
                  type="number"
                  max={"5"}
                  min={"0"}
                  value={rating}
                  step={"0.5"}
                  onChange={(e) => setrating(parseFloat(e.target.value))}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {/* right section  */}
      <div className="p-2">
        {item.edit ? (
          <span> Product Deatils: {item.description}</span>
        ) : (
          <div className="form-floating">
            Product Deatils:
            <textarea
              className="form-control"
              value={description}
              id="floatingTextarea"
              style={{ width: "20rem", height: "5rem" }}
              onChange={(e) => setdescription(e.target.value)}
            ></textarea>
          </div>
        )}
      </div>
      {/* footer section  */}
      <div className="align-self-end d-flex align-items-center gap-4 flex-lg-grow-1 p-1">
        {item.edit ? (
          <button
            type="button"
            className="btn btn-primary"
            style={{
              width: "9rem",
              backgroundColor: "var(--nav)",
            }}
            onClick={() => handleCart(item)}
          >
            {addedItem ? "Add to Cart" : "Go to Cart "}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => handleCancel(item)}
          >
            Cancel
          </button>
        )}
        {item.edit ? (
          <>
            <span>
              <img
                src="https://cdn-icons-png.flaticon.com/512/3196/3196909.png"
                alt="error"
                width={"30rem"}
                style={{ cursor: "pointer" }}
                onClick={() => handleEdit(item)}
              />
            </span>
            <span>
              <img
                src="https://cdn-icons-png.flaticon.com/512/8556/8556073.png"
                alt="error"
                width={"30rem"}
                style={{ cursor: "pointer" }}
                onClick={() => handleDelelteProduct(item)}
              />
            </span>
          </>
        ) : (
          <>
            

            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => handleSave(item)}
            >
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}
