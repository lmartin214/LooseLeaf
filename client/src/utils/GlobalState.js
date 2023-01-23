import React, { createContext, useContext } from "react";
import { useProductReducer } from './reducers'

const StoreContext = createContext(); //store context using React.CreateContext()
const { Provider } = StoreContext;

const StoreProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = useProductReducer({
    products: [],
    cart: [],
    cartOpen: false,
    categories: [],
    currentCategory: '',
  });

  return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => { //custom hook that allows easy access to our StoreContext values
  return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };