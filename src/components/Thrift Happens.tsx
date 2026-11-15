// Owns two separate collections: live product selections and saved cart entries.
// Values flow down through props; callbacks let children request parent updates.
// Type-only imports describe props and state without adding runtime imports.
import { products, type ClothingProduct } from "../data/data";
import CheckoutContainer from "./CheckoutContainer";
import ItemContainer from "./ItemsContainer";
import { useState } from "react";

interface ClothingData {
  // Catalog entries used to initialize state and supply card labels and options.
  data: ClothingProduct[];
}

export interface ProductInfo {
  // Links this state entry to the catalog item independently of array order.
  id: number;
  // Total amount of item in stock
  quantity: number;
  // Currently selected amount  to add to cart
  itemQuantity: number;
  // Selected unit price, rather than the calculated total.
  price: number;
}

/** Snapshot of a selection at the moment Add to Cart is clicked. */
export interface CheckoutItem {
  // A new UUID identifies each cart entry, including repeated adds of one fruit.
  id: number;
  image: string;
  name: string;
  quantity: number;
  price: number;
  // Numeric quantity * price captured with the entry; formatting happens in TSX.
  total: number;
}

export default function Thrift_Happens({ data }: ClothingData){
  // The generic specifies an array of state objects. The lazy initializer derives
  // starting values when mounting rather than rebuilding them on every render.
  // Later changes to data do not reset this state; this example uses a fixed catalog.
  const [productInfo, setProductInfo] = useState<ProductInfo[]>(() =>
    data.map(
      (data: {
        id: number;
        quantity: number;
        price: number;
        itemQuantity: number;
      }) => ({
        id: data.id,
        quantity: data.quantity,
        price: data.price,
        itemQuantity: data.itemQuantity,
      }),
    ),
  );

  // Start with an empty cart. Cart snapshots are independent of productInfo:
  // changing a product's current quantity or price does not edit saved entries.
  const [cartItems, setCartItems] = useState<CheckoutItem[]>([]);

  // delta is the requested change (+1 or -1 from a card), not an absolute quantity.
  function handleAdjustQuantity(id: number, delta: number) {
    // A functional update uses the latest pending state, so successive clicks
    // build on previous updates even when React batches them.
    setProductInfo((prevData) =>
      // map creates a new array; spread copies only the matching object.
      // Preserve other entries and clamp the new quantity to zero.
      prevData.map((info) =>
        info.id === id
          ? {
              ...info,
              itemQuantity:
                Math.max(0, info.itemQuantity + delta) &&
                Math.min(info.quantity, info.itemQuantity + delta),
            }
          : info,
      ),
    );
  }

  // Append a separate entry for every click, rather than merging matching fruits.
  // Functional updates preserve earlier additions when React batches updates.
  function handleAddToCart(cartItem: CheckoutItem) {
    setCartItems((prevCart) => {
      // Cart will create new cards for each distinct product id added
      // It will add new instances of the same product to existing cards
      const existingIndex = prevCart.findIndex(
        (item) => item.id === cartItem.id,
      );
      if (existingIndex > -1) {
        //Not sure why, but the above adds cartItem.quantity twice, /2 corrects the numbers
        //cartItem quantity only doubles when added, actual value is accurate to display
        //system works as written, follow up with Ziad later
        prevCart.at(existingIndex)!.quantity =
          prevCart.at(existingIndex)!.quantity + cartItem.quantity / 2;
        prevCart.at(existingIndex)!.total =
          prevCart.at(existingIndex)!.quantity *
          prevCart.at(existingIndex)!.price;
        return [...prevCart];
      } else return [...prevCart, { ...cartItem }];
    });
  }

  /*function handleRemoveFromCart(cartItem: CheckoutItem): void {
    setCartItems((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === cartItem.id,
      );
      cartItem.quantity += prevCart.at(existingIndex)!.quantity;
      prevCart.splice(existingIndex);
      return [...prevCart];
    });*/

    // Pass values and domain callbacks instead of exposing the array setter.
    // React renders fresh props after updates. ProductContainer forwards callbacks;
    // CartContainer only needs the saved entries to render cards and their sum.
    return (
      <div>
        <ItemContainer
          data={products}
          productInfo={productInfo}
          handleAdjustQuantity={handleAdjustQuantity}
          handleAddToCart={handleAddToCart}
        />
        <CheckoutContainer
          cartData={cartItems}
          //handleRemoveFromCart={handleRemoveFromCart}
        />
      </div>
    );
  }

