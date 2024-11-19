import React from 'react';

// SectionTitle component
export function SectionTitle({ title, subtitle }: { title: string; subtitle: string; }) {
  return (
    <div style={{ paddingBottom: '40px' }}>
      <h2 style={{
          fontSize: '14px',
          fontWeight: 500,
          padding: 0,
          lineHeight: '1px',
          margin: '0 0 5px 0',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#aaaaaa',
          fontFamily: 'Poppins, sans-serif',
          position: 'relative',
          display: 'inline-block'
        }}>
        {title}
        <span style={{
          content: "''",
          width: '120px',
          height: '1px',
          display: 'inline-block',
          background: 'rgba(255, 255, 255, 0.2)',
          margin: '4px 10px'
        }} />
      </h2>
      <p style={{
        margin: 0,
        fontSize: '36px',
        fontWeight: 700,
        fontFamily: 'Playfair Display, serif',
        color: '#7777ed'
      }}>
        {subtitle}
      </p>
    </div>
  );
}

// WhyUsCard component
export default function WhyUsCard({ item }: { item: { id: number; title: string; content: string } }) {
  return (
    <div className="col-lg-4 at-4 at-lg-0">
      <div className='box' data-aos="zoom-in" data-aos-delay="200">
        <span>0{item.id}</span>
        <h4>{item.title}</h4>
        <p>{item.content}</p>
      </div>
    </div>
  );
}
