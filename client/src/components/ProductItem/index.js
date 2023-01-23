//Import dependencies, components, hooks, utils 
import React from "react";
import { Link } from "react-router-dom";
import { pluralize } from "../../utils/helpers"
import { useStoreContext } from "../../utils/GlobalState";
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
import { Card, Button, Image } from 'semantic-ui-react';//Import for styling

function ProductItem(item) {
  const [state, dispatch] = useStoreContext();

  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item;

  const { cart } = state
/*adds the item to the cart, either by updating the quantity if the item is already in the cart, 
or by adding the item to the cart if it is not already there*/
  const addToCart = () => { 
    const itemInCart = cart.find((cartItem) => cartItem._id === _id)
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: _id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...item, purchaseQuantity: 1 }
      });
      idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
    }
  }

  return (//render page with components and styling
    <Card>
      <Link to={`/products/${_id}`}>
        <Image src={`/images/${image}`} alt={name}/>
        <Card.Content>
          <Card.Header>{name}</Card.Header>
        </Card.Content>
      </Link>
      <Card.Content>
        <div>
          <div>{quantity} {pluralize("item", quantity)} in stock</div>
          <span>${price}</span>
        </div>
      </Card.Content>
      <Card.Content extra>
        <Button onClick={addToCart}>Add to cart</Button>
      </Card.Content>
    </Card>
  );
}

export default ProductItem;