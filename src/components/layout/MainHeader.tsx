import { type FC, useCallback } from "react";
import { Link, NavLink } from "react-router";
import { Links } from "@/lib/links";
import { MenuCurve } from "./MenuCurve";
import {
  CurveColors,
  staticUser,
  staticProfile,
  staticRole,
  staticMessagesCount,
  staticPostedJobs,
  staticPackages,
} from "@/lib/static-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/dropdown";
import { Avatar } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { Container } from "@/components/ui/container";
import { QIcon } from "@/components/ui/q-icon";
import { cn } from "@/lib/utils";

// Logo from public folder
const logo = "/qoolance-shadcn-front/vite.svg";

// Static text content
const headerText = {
  browse_jobs: "Browse Jobs",
  browse_talents: "Browse Talents",
  dashboard: "Dashboard",
  my_jobs: "My Jobs",
  about_us: "About Us",
  post_a_job: "Post a Job",
  my_profile: "My Profile",
  settings: "Settings",
  payment_settings: "Payment Settings",
  upgrade_package: "Upgrade Package",
  log_out: "Log Out",
  "sign-up": "Sign Up",
  log_in: "Log In",
};

interface MainHeaderProps {
  height?: number;
  curveColor?: CurveColors;
  hideContent?: boolean;
}

export const MainHeader: FC<MainHeaderProps> = (props) => {
  const { height, hideContent } = props;
  const { loggedIn } = staticUser;
  const profile = staticProfile;
  const { isRequestor } = staticRole;
  const messagesCount = staticMessagesCount;
  const packagesForRole = staticPackages;

  const PostedNum =
    staticPostedJobs.filter(
      (job) => !job.archived && ["open", "draft"].includes(job.status)
    )?.length || 0;

  const handleLogout = useCallback(() => {
    // Static logout - just navigate
    window.location.href = Links.homePage();
  }, []);

  const badgeColor: "default" | "secondary" = isRequestor
    ? "default"
    : "secondary";

  return (
    <header className="main-nav relative mb-8">
      <MenuCurve
        color={
          props.curveColor
            ? props.curveColor
            : isRequestor
            ? CurveColors.LightGreen
            : CurveColors.LightBlue
        }
        height={height}
      />
      <Container>
        <nav className="content flex items-center justify-between py-4 relative z-[4]">
          {hideContent ? null : (
            <button
              className="hamburger_stripes nav-open md:hidden"
              type="button"
            >
              <span className="stripes block w-6 h-0.5 bg-gray-700 mb-1" />
              <span className="stripes block w-6 h-0.5 bg-gray-700 mb-1" />
              <span className="stripes block w-6 h-0.5 bg-gray-700" />
            </button>
          )}

          <div className="logo_nav flex flex-1 pl-2 gap-1 md:flex-none md:pl-0">
            <Link
              title="Qoolance"
              to={hideContent ? "#" : Links.homePage()}
              className="flex items-center"
            >
              <img
                alt="Qoolance logo"
                className="logo h-6 md:h-12"
                loading="lazy"
                src={logo}
              />
            </Link>

            {hideContent ? null : (
              <ul className="main-navbar hidden md:flex items-center list-none p-0 m-0 flex-nowrap whitespace-nowrap">
                <li className="mx-2">
                  <NavLink
                    className={({ isActive }) =>
                      cn(
                        "no-underline text-gray-700 font-medium capitalize transition-colors",
                        isActive && "text-primary"
                      )
                    }
                    to={Links.jobsBrowse()}
                  >
                    {headerText.browse_jobs}
                  </NavLink>
                </li>
                <li className="mx-2">
                  <NavLink
                    className={({ isActive }) =>
                      cn(
                        "no-underline text-gray-700 font-medium capitalize transition-colors",
                        isActive && "text-primary"
                      )
                    }
                    to={Links.browseTalentsPage()}
                  >
                    {headerText.browse_talents}
                  </NavLink>
                </li>

                {loggedIn && (
                  <li className="mx-2">
                    <NavLink
                      className={({ isActive }) =>
                        cn(
                          "no-underline text-gray-700 font-medium capitalize transition-colors",
                          isActive && "text-primary"
                        )
                      }
                      to={Links.dashboardOverviewPage()}
                    >
                      {headerText.dashboard}
                    </NavLink>
                  </li>
                )}

                {loggedIn && (
                  <li className="mx-2">
                    <NavLink
                      className={({ isActive }) =>
                        cn(
                          "no-underline text-gray-700 font-medium capitalize transition-colors",
                          isActive && "text-primary"
                        )
                      }
                      to={isRequestor ? Links.myJobsPosted() : Links.myBids()}
                    >
                      {headerText.my_jobs}
                    </NavLink>
                  </li>
                )}
                {!loggedIn && (
                  <li className="mx-2">
                    <NavLink
                      className={({ isActive }) =>
                        cn(
                          "no-underline text-gray-700 font-medium capitalize transition-colors",
                          isActive && "text-primary"
                        )
                      }
                      to={Links.aboutUsPage()}
                    >
                      {headerText.about_us}
                    </NavLink>
                  </li>
                )}
              </ul>
            )}
          </div>

          {!hideContent && loggedIn && (
            <div className="end flex items-center flex-wrap justify-end gap-7">
              {isRequestor && profile && (
                <Button
                  className="btn-postJob-desk hidden lg:flex"
                  to={Links.jobCreatePage()}
                >
                  {headerText.post_a_job}
                </Button>
              )}
              {profile ? (
                <>
                  <div className="message-icon relative cursor-pointer">
                    <IconButton
                      icon="fa6-solid:envelope"
                      to={Links.inboxPage()}
                    />
                    {messagesCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute top-0 -right-[18px] text-[0.7rem]"
                      >
                        {messagesCount}
                      </Badge>
                    )}
                  </div>

                  <Dropdown className="dropdown-caretless desktop-view hidden md:inline-block">
                    <Dropdown.Toggle className="user-menu cursor-pointer border-2 border-primary rounded-[2rem] flex gap-2.5 items-center px-3.5 py-1.5 bg-gray-50 transition-all min-h-6">
                      <Avatar
                        name={profile.name}
                        size="xs"
                        src={profile.avatar}
                      />
                      <div className="name text-gray-700 font-medium text-sm whitespace-nowrap leading-tight">
                        {profile.name}
                      </div>
                      <QIcon
                        icon="fa6-solid:ellipsis-vertical"
                        className="text-gray-700 w-4 h-4 shrink-0"
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                      <Dropdown.Item
                        href={
                          isRequestor ? Links.myJobsPosted() : Links.myBids()
                        }
                      >
                        {headerText.my_jobs}
                        {PostedNum > 0 && (
                          <Badge className="ms-2" variant={badgeColor}>
                            {PostedNum}
                          </Badge>
                        )}
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item href={Links.userProfile()}>
                        {headerText.my_profile}
                      </Dropdown.Item>
                      <Dropdown.Item href={Links.settingsPage()}>
                        {headerText.settings}
                      </Dropdown.Item>
                      <Dropdown.Item href={Links.paymentSettingsPage()}>
                        {headerText.payment_settings}
                      </Dropdown.Item>
                      <Dropdown.Item href={Links.userPackages()}>
                        {headerText.upgrade_package}
                        {packagesForRole &&
                          packagesForRole[0]?.package?.name && (
                            <Badge className="ms-2" variant={badgeColor}>
                              {packagesForRole[0].package.name}
                            </Badge>
                          )}
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>
                        {headerText.log_out}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Link
                    className="mobile-view border-2 border-primary rounded-full flex items-center p-1.5 md:hidden"
                    title="view profile"
                    to={Links.userProfile()}
                  >
                    <Avatar
                      name={profile.name}
                      size="xs"
                      src={profile.avatar}
                    />
                  </Link>
                </>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          )}

          {!hideContent && !loggedIn && (
            <div className="login_register_desktop flex gap-3 flex-wrap">
              <Button
                data-cy="register-btn"
                variant="outline"
                to={Links.signUpPage()}
                className="hidden md:block capitalize"
              >
                {headerText["sign-up"]}
              </Button>
              <Button
                data-cy="login-btn"
                to={Links.signIn()}
                className="capitalize"
              >
                {headerText.log_in}
              </Button>
            </div>
          )}
        </nav>
      </Container>
    </header>
  );
};
