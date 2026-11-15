import type { ClothingProduct } from "../data/data";
import type { ProductInfo } from "./Thrift Happens";
import type { CheckoutItem } from "./Thrift Happens";

// Extend catalog fields with current state and the actions this card can request.
// These callbacks hide how the parent stores and updates its state arrays.
interface ProductCardProps extends ClothingProduct {
  productInfo: ProductInfo;
  handleQuantityAdjust: (delta: number) => void;
  handleAddToCart: (cartItem: CheckoutItem) => void;
}

// Presentational component: render the supplied values and report interactions.
// Props are inputs; calling a callback asks Thrift Happens to supply updated values.
export default function ItemCard({
  name,
  price,
  image,
  fit,
  category,
  color,
  description,
  size,
  productInfo,
  handleQuantityAdjust,
  handleAddToCart,
}: ProductCardProps) {
  return (
    <div className="ItemCard">
      <h2>{name}</h2>
      <img src={image} alt="" height="100px" />
      <br />
      <p>Fit: {fit}</p>
      <p>Category: {category}</p>
      <p>Colour: {color}</p>
      <p>Description: {description}</p>
      <p>Size: {size}</p>
      <p>Price: {price}</p>
      <div>
        {productInfo.quantity > 0
          ? "Stock:" + productInfo.quantity
          : "Out of Stock"}
      </div>
      {/* Arrow functions defer actions until a click; the parent enforces the floor. */}
      <div>
        <button onClick={() => handleQuantityAdjust(-1)}>{" - "}</button>
        <span>{productInfo.itemQuantity}</span>
        <button onClick={() => handleQuantityAdjust(1)}>{" + "}</button>
      </div>
      {/* This preview derives its total from the current selection.
          toFixed(2) returns a display string; it does not change the numbers
          or apply formatting to values later passed to another component. */}
      <p>
        Total Price: {(productInfo.itemQuantity * productInfo.price).toFixed(2)}
        $
      </p>
      {/* Build a snapshot only when clicked. A shared id will merge instances of a given product together
          Keep price and total numeric for calculations; cart components format
          their own displays. Later selection changes do not alter this snapshot. */}
      <button
        onClick={() => {
          if (productInfo.itemQuantity > 0) {
            handleAddToCart({
              id: productInfo.id,
              image: image,
              name: name,
              price: price,
              quantity: productInfo.itemQuantity,
              total: productInfo.itemQuantity * productInfo.price,
            });
            productInfo.quantity -= productInfo.itemQuantity;
            productInfo.itemQuantity = 0;
          }
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
