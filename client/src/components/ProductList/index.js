//Import dependencies, components, utils  
import React, { useEffect } from 'react';
import ProductItem from '../ProductItem';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_PRODUCTS } from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import { Loader, Image, Header, Grid } from 'semantic-ui-react'; //Import for styling 
import spinner from '../../assets/spinner.gif';

function ProductList() { //custom hook to handle productList query
  const [state, dispatch] = useStoreContext();

  const { currentCategory } = state;

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => { //hook used tp update productList in the state and date later
    if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get').then((products) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products,
        });
      });
    }
  }, [data, loading, dispatch]);

  function filterProducts() { //used to filter the product list by category.
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  return ( //render page with components and styling
    <div className="my-2">
      <Header as='h2'>Our Products</Header>
      {state.products.length ? (
        <Grid columns={3} stackable>
          {filterProducts().map((product) => (
            <Grid.Column key={product._id}>
              <ProductItem
                _id={product._id}
                image={product.image}
                name={product.name}
                price={product.price}
                quantity={product.quantity}
              />
            </Grid.Column>
          ))}
        </Grid>
      ) : (
        <Header as='h3'>Products not availabel at the moment, Please check back later</Header>
      )}
      { loading ? <Loader active inline='centered'><Image src={spinner} /></Loader> : null }
    </div>
  );
}

export default ProductList;
