import React, { ReactNode } from "react";

import { Header } from "../Header/index";
import { Footer } from "../Footer/index"

import style from "./DefaultLayout.module.css";

interface DefaultLayoutProps {
  children: ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <div className={style.headerBlockContainer}>
      <Header/>
      <div className={style.mainBlock}>{children}</div>
      <Footer/>
    </div>
  );
};
