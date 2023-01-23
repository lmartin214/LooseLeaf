import React from 'react';
import { useStoreContext } from "../../utils/GlobalState";
import { Input, Image, Button, Icon, Item } from "semantic-ui-react";
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";

const CartItem = ({ item }) => {

  const [, dispatch] = useStoreContext();

  const removeFromCart = item => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: item._id
    });
    idbPromise('cart', 'delete', { ...item });

  };

  const onChange = (e) => {
    const value = e.target.value;
    if (value === '0') {
      dispatch({
        type: REMOVE_FROM_CART,
        _id: item._id
      });
      idbPromise('cart', 'delete', { ...item });

    } else {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: item._id,
        purchaseQuantity: parseInt(value)
      });
      idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });

    }
  }

  return (
    <Item.Group>
      <Item>
      <Image centered size='tiny' src={`/images/${item.image}`} alt={item.name}/>
      <Item.Content>
      <Item.Header>{item.name}, ${item.price}</Item.Header>
        <Item.Description>
        <span>Qty:</span>
          <Input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={onChange}
          />
       </Item.Description>
       <Item.Extra>     
       <Button onClick={() => removeFromCart(item)}>
            <Icon name="trash" />
          </Button>
      </Item.Extra>
      </Item.Content>
    </Item>
    </Item.Group>
  );
}

export default CartItem;