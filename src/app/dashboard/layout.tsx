import React, { ReactNode } from 'react'; // Import ReactNode
import '../../styles/globals.css'; 

export const metadata = {
  title: 'Your Site Title',
  description: 'Your Site Description',
};

interface LayoutProps {
  children: ReactNode; 
}

const Layout: React.FC<LayoutProps> = ({ children }) => { 
  // Specify the type of the component
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children} {}
      </body>
    </html>
  );
};

export default Layout;
