import Metadata from "next";
import RouteGuardWrapper from "./components/route-guard-wrapper";
import "./styles/globals.scss";

export const metadata = {
  title: "CodeMarket",
  description: "CodeMarket - это онлайн-платформа",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RouteGuardWrapper>
          {children}
        </RouteGuardWrapper>
      </body>
    </html>
  );
}
