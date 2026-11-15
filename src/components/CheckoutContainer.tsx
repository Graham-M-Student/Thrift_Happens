import { type CheckoutItem } from "./Thrift Happens";
import CheckoutCard from "./CheckoutCard";

// Receives saved cart entries from FruitsApp; it does not own or update cart state.
interface CartContainerProps {
  cartData: CheckoutItem[];
  //handleRemoveFromCart(cartItem: CheckoutItem): void;
}
// Render every separately added entry and calculate the combined cart total.
export default function CartContainer({
  cartData,
  //handleRemoveFromCart,
}: CartContainerProps) {
  return (
    <div className="CartContainer">
      {/* map produces one card per entry. The UUID is React's stable list key;
          spreading item passes its snapshot fields as the card's props. */}
      {cartData.map((item) => (
        <CheckoutCard
          key={item.id}
          {...item}
          //handleRemoveFromCart={handleRemoveFromCart}
        />
      ))}
      {/* reduce receives the running sum (acc) first and the current item second.
          Starting at 0 makes the accumulator numeric and handles an empty cart.
          Sum numeric totals before formatting the final display to two decimals. */}
      <h2>
        {cartData.length > 0
          ? `Cart Total: ${cartData.reduce((acc, item) => acc + item.total, 0).toFixed(2)}$`
          : "Cart is empty"}
      </h2>
      <button>Empty Cart</button>
    </div>
  );
}
