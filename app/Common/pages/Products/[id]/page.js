'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// Mock product fetch
const getProductById = async (id) => {
  return {
    id,
    name: `Product ${id}`,
    price: 1999,
    rating: 4.3,
    reviews: 56,
    description:
      'This is a modern, clean product detail page design with better layout, spacing, and UX without external UI libraries.',
    features: [
      'Premium build quality',
      'Long-lasting performance',
      'Affordable pricing',
      'Easy to use interface',
    ],
    image: 'https://via.placeholder.com/500x600',
  };
};

export default function Page() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) getProductById(id).then(setProduct);
  }, [id]);

  if (!product) {
    return <div style={styles.loader}>Loading product...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Image Section */}
        <div style={styles.imageSection}>
          {/* <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
            priority
          /> */}
        </div>

        {/* Details Section */}
        <div style={styles.detailsSection}>
          <h1 style={styles.title}>{product.name}</h1>

          <div style={styles.metaRow}>
            <span style={styles.price}>₹ {product.price}</span>
            <span style={styles.rating}>⭐ {product.rating} ({product.reviews})</span>
          </div>

          <p style={styles.description}>{product.description}</p>

          <div style={styles.featuresBox}>
            <h3>Key Features</h3>
            <ul style={styles.featureList}>
              {product.features.map((f, i) => (
                <li key={i} style={styles.featureItem}>✔ {f}</li>
              ))}
            </ul>
          </div>

          <div style={styles.actions}>
            <button style={styles.cartBtn}>Add to Cart</button>
            <button style={styles.buyBtn}>Buy Now</button>
          </div>

          <div style={styles.footerRow}>
            <span style={styles.productId}>Product ID: {id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(120deg, #f8f9fb, #eef1f5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
    fontFamily: 'Inter, system-ui, sans-serif',
  },

  card: {
    maxWidth: '1100px',
    width: '100%',
    background: '#fff',
    borderRadius: '20px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },

  imageSection: {
    position: 'relative',
    background: '#f5f6f8',
    padding: '40px',
  },

  detailsSection: {
    padding: '50px 45px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '10px',
  },

  metaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '10px 0 20px',
  },

  price: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0a7',
  },

  rating: {
    background: '#f1f3f5',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
  },

  description: {
    lineHeight: 1.7,
    color: '#444',
    marginBottom: '25px',
  },

  featuresBox: {
    background: '#fafbfc',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '30px',
  },

  featureList: {
    listStyle: 'none',
    padding: 0,
    marginTop: '10px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },

  featureItem: {
    fontSize: '14px',
    color: '#333',
  },

  actions: {
    display: 'flex',
    gap: '15px',
  },

  cartBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #000',
    background: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.2s',
  },

  buyBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: '#000',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.2s',
  },

  footerRow: {
    marginTop: '25px',
  },

  productId: {
    fontSize: '12px',
    color: '#888',
  },

  loader: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
  },
};
