import { FC } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Dish Vibes",
  description: "Restaurant application admin area",
};

type Props = Readonly<LayoutProps<"/">>;

const AdminLayout: FC<Props> = ({ children }) => {
  return (
    <>{children}</>
  );
}

export default AdminLayout;
