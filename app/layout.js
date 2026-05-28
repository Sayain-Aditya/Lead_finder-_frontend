import "./globals.css";

export const metadata = {
  title: "Hospitality Lead Finder",
  description: "Find hotels, restaurants & cafes — pitch them your web & software services.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
