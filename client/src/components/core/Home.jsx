import React, { useState, useEffect } from 'react';
import Loader from 'react-loader-spinner';
import { getProducts } from '../../api/products';
import ProductCard from '../products/ProductCard';

function Home() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const getProductsRequest = async () => {
    setLoading(true);
    const res = await getProducts();
    setProducts(res);
    setLoading(false);
  };

  useEffect(() => {
    getProductsRequest();
  }, []);

  return (
    <>
      <h1>Welcome to Vendo.</h1>
      {loading ? (
        <Loader type="Oval" color="#627884" height={200} width={200} />
      ) : (
        <div>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}

export default Home;
