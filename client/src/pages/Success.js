import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Segment, Header } from 'semantic-ui-react';
import { ADD_ORDER } from '../utils/mutations';
import { idbPromise } from '../utils/helpers';

function Success() {
  const [addOrder] = useMutation(ADD_ORDER);

  useEffect(() => {
    async function saveOrder() {
      const cart = await idbPromise('cart', 'get');
      const products = cart.map((item) => item._id);

      if (products.length) {
        const { data } = await addOrder({ variables: { products } });
        const productData = data.addOrder.products;

        productData.forEach((item) => {
          idbPromise('cart', 'delete', item);
        });
      }

      setTimeout(() => {
        window.location.assign('/');
      }, 3000);
    }

    saveOrder();
  }, [addOrder]);

  return (
    <div>
      <Segment>
        <Header as='h1'>Success!</Header>
        <Header as='h2'>Thank you for your purchase!</Header>
        <Header as='h2'>You will now be redirected to the home page</Header>
      </Segment>
    </div>
  );
}

export default Success;