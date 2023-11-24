import React from 'react';
import '~/styles/petsnowy/active-bar.css';

export default function ActiveBar({children}: {children: React.ReactNode}) {
  return (
    <div className="active-bar" data-times="2023-11-28 00:00:00">
      {children}
    </div>
  );
}
