import type { ReactNode } from "react";
import {
  MailOutlined,
  PhoneOutlined,
  GithubOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";

const SUPPORT_EMAIL = "aryanguptawork26@gmail.com";
const SUPPORT_PHONE = "+91 7367993351";
const SUPPORT_PHONE_TEL = "+917367993351";
const SUPPORT_GITHUB = "https://github.com/aryan7061";
const SUPPORT_LINKEDIN = "https://www.linkedin.com/in/aryan-gupta-2026bvf";
const SUPPORT_EMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${SUPPORT_EMAIL}`;

type ContactOption = {
  href: string;
  label: string;
  ariaLabel: string;
  icon: ReactNode;
  external?: boolean;
};

const OPTIONS: ContactOption[] = [
  {
    href: SUPPORT_EMAIL_COMPOSE_URL,
    label: SUPPORT_EMAIL,
    ariaLabel: `Email ${SUPPORT_EMAIL} (opens Gmail in a new tab)`,
    icon: <MailOutlined aria-hidden="true" />,
    external: true,
  },
  {
    href: `tel:${SUPPORT_PHONE_TEL}`,
    label: SUPPORT_PHONE,
    ariaLabel: `Call ${SUPPORT_PHONE}`,
    icon: <PhoneOutlined aria-hidden="true" />,
  },
  {
    href: SUPPORT_GITHUB,
    label: "GitHub",
    ariaLabel: "GitHub profile (opens in new tab)",
    icon: <GithubOutlined aria-hidden="true" />,
    external: true,
  },
  {
    href: SUPPORT_LINKEDIN,
    label: "LinkedIn",
    ariaLabel: "LinkedIn profile (opens in new tab)",
    icon: <LinkedinOutlined aria-hidden="true" />,
    external: true,
  },
];

const SupportButton = () => {
  return (
    <div
      className="hb-support-wrap"
      role="group"
      aria-label="Support and contact options"
    >
      <div className="hb-support-trigger" aria-hidden="true">
        Support
      </div>
      <div className="hb-support-popout">
        <div className="hb-support-popout-card">
          {OPTIONS.map((option) => (
            <a
              key={option.label}
              className="hb-support-row"
              href={option.href}
              target={option.external ? "_blank" : undefined}
              rel={option.external ? "noopener noreferrer" : undefined}
              aria-label={option.ariaLabel}
              title={option.label}
            >
              <span className="hb-support-row-icon">{option.icon}</span>
              <span className="hb-support-row-label">{option.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportButton;
