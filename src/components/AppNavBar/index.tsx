import { useNavigate } from "react-router-dom";
import styles from './index.module.scss'

import { NavBar } from "antd-mobile";
import type { ReactNode } from "react";

type AppNavBarProps = {
  title: string;
  right?: ReactNode;
  back?: ReactNode | null;
  onBack?: () => void;
};

const AppNavBar = ({ title, right, back = '', onBack }: AppNavBarProps) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    navigate(-1);
  }

  return (
    <NavBar className={styles["nav-bar"]} right={right} back={back} onBack={handleBack}>
      { title }
    </NavBar>
  )
}

export default AppNavBar;