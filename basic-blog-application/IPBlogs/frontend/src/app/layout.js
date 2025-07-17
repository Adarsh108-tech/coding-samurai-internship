import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'IP Blogs',
  description: 'A Blogging Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
          <Toaster position='top-right'></Toaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
