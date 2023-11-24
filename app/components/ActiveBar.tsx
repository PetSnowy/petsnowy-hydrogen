import React from 'react';
import '~/styles/petsnowy/active-bar.css';

export default function ActiveBar({children}: {children: React.ReactNode}) {
  return <div className="active-bar">{children}</div>;
}
