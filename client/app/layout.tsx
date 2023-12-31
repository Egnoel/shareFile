import './globals.css';

export const metadata = {
  title: 'ShareFiles',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="grid h-screen text-white bg-gray-900 font-seif place-items-center">
        {children}
      </body>
    </html>
  );
}
