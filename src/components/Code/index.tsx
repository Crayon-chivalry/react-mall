import { useEffect, useState, type CSSProperties } from "react";
import styles from './index.module.scss';

type CodeProps = {
  type?: "button" | "text";
  text?: string;
  countdown?: number;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

const Code = ({
  type = "button",
  text = "发送验证码",
  countdown = 60,
  disabled = false,
  className,
  style,
  onClick,
}: CodeProps) => {
  const [remaining, setRemaining] = useState(countdown);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    if (!isCounting) return;

    if (remaining <= 0) {
      setIsCounting(false);
      setRemaining(countdown);
      return;
    }

    const timer = window.setTimeout(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown, isCounting, remaining]);

  const handleClick = () => {
    if (disabled || isCounting) return;

    setIsCounting(true);
    setRemaining(countdown);
    onClick?.();
  };

  const commonStyle: CSSProperties = {
    cursor: disabled || isCounting ? "not-allowed" : "pointer",
    color: type === "text" ? undefined : "#fff",
    backgroundColor: type === "button" ? undefined : "transparent",
    border: type === "button" ? "none" : "none",
    borderRadius: type === "button" ? 6 : 0,
    padding: type === "button" ? "8px 12px" : 0,
    fontSize: 14,
    lineHeight: 1.4,
    userSelect: "none",
    ...style,
  };

  const classNames = [className, type === "text" ? styles.text : styles.button].filter(Boolean).join(" ");

  if (type === "text") {
    return (
      <span className={classNames} style={commonStyle} onClick={handleClick}>
        {isCounting ? `${remaining}s后重发` : text}
      </span>
    );
  }

  return (
    <button className={classNames} style={commonStyle} onClick={handleClick} disabled={disabled || isCounting}>
      {isCounting ? `${remaining}s后重发` : text}
    </button>
  );
};

export default Code;