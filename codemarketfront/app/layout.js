import Metadata from "next";

export const metadata = {
  title: "CodeMarket",
  description: "CodeMarket - это онлайн-платформа",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
