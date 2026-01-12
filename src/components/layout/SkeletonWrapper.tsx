import { type FC, type PropsWithChildren } from "react";
import { PageSwitcher } from "./PageSwitcher";
import { LanguageSelect } from "./LanguageSelect";
import { MobileNav } from "./MobileNav";
import { Footer } from "./Footer";
import { MainHeader } from "./MainHeader";
import { Container } from "@/components/ui/container";
import { CurveColors, staticRole } from "@/lib/static-data";
import { Role } from "@/lib/static-data";

export type SkeletonWrapperProps = PropsWithChildren<{
  title: string;
  description: string;
  curveHeight?: number;
  curveColor?: CurveColors;
  withoutContainer?: boolean;
  hideContent?: boolean;
  staticRole?: Role;
}>;

export const SkeletonWrapper: FC<SkeletonWrapperProps> = (props) => {
  const {
    children,
    curveColor,
    curveHeight,
    hideContent,
    staticRole: propRole,
    withoutContainer,
  } = props;

  const role = propRole || staticRole.role;

  return (
    <div
      className="skeleton-wrapper"
      data-testid="skeleton-wrapper"
      data-user-role={role}
    >
      <Container className="far-top-level-container">
        {hideContent ? <>&nbsp;</> : <PageSwitcher />}
        <LanguageSelect id="top-nav" />
      </Container>

      <MainHeader
        curveColor={curveColor}
        height={curveHeight}
        hideContent={hideContent}
      />

      {hideContent ? null : <MobileNav />}

      {withoutContainer ? (
        <main>{children}</main>
      ) : (
        <Container>
          <main>{children}</main>
        </Container>
      )}

      <Footer />
    </div>
  );
};
