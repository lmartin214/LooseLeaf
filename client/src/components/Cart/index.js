import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/client';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import { Button, Header, Icon, Segment, Modal } from 'semantic-ui-react';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';

const stripePromise = loadStripe('STRIPE_PUBLIC_KEY');

const Cart = () => {
  const [state, dispatch] = useStoreContext();
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  const [open, setOpen] = React.useState(false)
  
  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise('cart', 'get');
      dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
    }

    if (!state.cart.length) {
      getCart();
    }
  }, [state.cart.length, dispatch]);

  function toggleCart() {
    dispatch({ type: TOGGLE_CART });
    setOpen (false); 
  }

  function calculateTotal() {
    let sum = 0;
    state.cart.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  function submitCheckout() {
    const productIds = [];

    state.cart.forEach((item) => {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });

    getCheckout({
      variables: { products: productIds },
    });
  }

  if (!state.cartOpen) {
    return (
      <Segment className="cart-closed" onClick={toggleCart}>
        <Header as="h2" icon>
          <Icon name="shopping cart" />
          Shopping Cart
        </Header>
      </Segment>
    );
  }

  return (
    <Modal
      closeIcon
      open={open}
      trigger={<Segment className="cart" onClick={()=> setOpen(true)}>
        <Header as="h2" icon>
          <Icon name="shopping cart" />
          Shopping Cart
        </Header>
      </Segment>}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Segment className="cart">
        <Header as="h2" icon>
          <Icon name="shopping cart" />
          Shopping Cart
        </Header>
        {state.cart.length ? (
          <div>
            {state.cart.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}

            <div className="flex-row space-between">
              <strong>Total: ${calculateTotal()}</strong>

              {Auth.loggedIn() ? (
                <Button onClick={submitCheckout}>Checkout</Button>
              ) : (
                <span>(log in to check out)</span>
              )}
            </div>
          </div>
        ) : (
          <Segment placeholder>
            <Header icon>
              <Icon name="shopping cart" />
              You haven't added anything to your cart yet!
            </Header>
          </Segment>
        )}
      </Segment>
    </Modal>
  );
};

export default Cart;