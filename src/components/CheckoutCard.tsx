import type { CheckoutItem } from "./Thrift Happens";

interface CheckoutCardProps extends CheckoutItem {
  handleRemoveFromCart(cartItem: CheckoutItem): void;
}

// Displays one saved cart snapshot. The default export is imported as CartCard
// by the list component.
// Destructuring extracts fields from React's single props object.
export default function CartCard({
  id,
  name,
  image,
  price,
  quantity,
  total,
  handleRemoveFromCart,
}: CheckoutCardProps) {
  return (
    <div className="CartCard">
      <h2>{name}</h2>
      <img src={image} alt="" height="100px" />
      <p>quantity: {quantity}</p>
      {/* Format each monetary value where it is displayed. toFixed returns a
          string and hides floating-point display artifacts; it does not mutate
          the numeric price or total stored in the cart. */}
      <p>price: {price.toFixed(2)}$</p>
      <p>total: {total.toFixed(2)}$</p>
      <button
        onClick={() => {
          handleRemoveFromCart({
            id:id,
            name: name,
            image: image,
            price: price,
            quantity: quantity,
            total: total,
          });
        }}
      >
        Remove
      </button>
    </div>
  );
}
