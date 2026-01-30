'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Simple mock product fetch
const getProductById = async (id) => {
  return {
    id,
    name: `Product ${id}`,
    price: 1999,
    rating: 4.3,
    reviews: 56,
    description:
      'This is a simple product detail page built without any external UI libraries. Clean, fast, and easy to understand.',
    features: [
      'Good build quality',
      'Long-lasting performance',
      'Affordable price',
      'Easy to use',
    ],
    image: 'https://via.placeholder.com/300x350',
  };
};

export default function Page() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      getProductById(id).then(setProduct);
    }
  }, [id]);

  if (!product) {
    return <p style={{ padding: 20 }}>Loading product...</p>;
  }

  return (
    <div style={styles.container}>
      {/* Image Section */}
      <div style={styles.imageBox}>
        {/* <Image
          src={product.image}
          alt={product.name}
          fill
          style={{ objectFit: 'contain' }}
          priority
        /> */}
      </div>

      {/* Details Section */}
      <div style={styles.details}>
        <h1>{product.name}</h1>

        <p style={styles.price}>₹ {product.price}</p>

        <p style={styles.rating}>
          ⭐ {product.rating} / 5 ({product.reviews} reviews)
        </p>

        <p style={styles.description}>{product.description}</p>

        <h3>Features</h3>
        <ul>
          {product.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>

        <div style={styles.actions}>
          <button style={styles.primaryBtn}>Add to Cart</button>
          <button style={styles.secondaryBtn}>Buy Now</button>
        </div>

        <p style={styles.productId}>Product ID: {id}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '40px auto',
    display: 'flex',
    gap: '40px',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  imageBox: {
    flex: 1,
    border: '1px solid #ddd',
    padding: '10px',
    position: 'relative',
    height: '350px',
  },
  details: {
    flex: 1,
  },
  price: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#0a7',
  },
  rating: {
    margin: '10px 0',
  },
  description: {
    margin: '15px 0',
    lineHeight: 1.6,
  },
  actions: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
  },
  primaryBtn: {
    padding: '10px 20px',
    background: '#000',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '10px 20px',
    background: '#fff',
    border: '1px solid #000',
    cursor: 'pointer',
  },
  productId: {
    marginTop: '30px',
    fontSize: '12px',
    color: '#777',
  },
};
