import type { FC } from "react";

interface LanguageSelectProps {
  id?: string;
}

export const LanguageSelect: FC<LanguageSelectProps> = ({ id }) => {
  // Placeholder component - not converting as per requirements
  return <div id={id} className="hidden" />;
};
