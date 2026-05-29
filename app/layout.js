import "./globals.css";

export const metadata = {
  title: "Hospitality Lead Finder",
  description: "Find qualified local hospitality leads and manage outreach.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
