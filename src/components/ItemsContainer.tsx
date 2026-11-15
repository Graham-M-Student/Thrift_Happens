import type { ClothingProduct } from "../data/data";
import type { ProductInfo } from "./Thrift Happens";
import type { CheckoutItem } from "./Thrift Happens";
import ItemCard from "./ItemCard";

// This component arranges cards and connects catalog items to their current state.
// It forwards actions to Thrift Happens rather than implementing state updates itself.
interface ProductContainerProps {
  data: ClothingProduct[];
  productInfo: ProductInfo[];
  // Container callbacks include the ID because they can update any fruit.
  handleAdjustQuantity: (id: number, delta: number) => void;
  // Unlike quantity/price callbacks, this accepts the complete cart snapshot.
  handleAddToCart: (cartItem: CheckoutItem) => void;
}

// React supplies one props object; destructuring extracts its named properties.
export default function ProductContainer({
  data,
  productInfo,
  handleAdjustQuantity,
  handleAddToCart,
}: ProductContainerProps) {
  return (
    <div className="ProductContainer">
      {data.map((clothes) => {
        // Match by stable ID rather than assuming the arrays have the same order.
        const info = productInfo.find((info) => info.id === clothes.id);
        // Avoid rendering a card with undefined state if no matching entry exists.
        if (!info) return null;

        // key lets React track each card across list renders; it is not a card prop.
        // {...clothes} forwards catalog fields. The callbacks capture this item's ID,
        // so the card only supplies a quantity change or selected price.
        // Add to Cart is forwarded unchanged: the card constructs its snapshot.
        return (
          <ItemCard
            key={clothes.id}
            {...clothes}
            productInfo={info}
            handleQuantityAdjust={(delta) =>
              handleAdjustQuantity(clothes.id, delta)
            }
            handleAddToCart={handleAddToCart}
          />
        );
      })}
    </div>
  );
}
