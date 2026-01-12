import { type FC, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router"
import { Links } from "@/lib/links"
import { Button } from "@/components/ui/button"
import { Collapse } from "@/components/ui/collapse"
import { Container } from "@/components/ui/container"
import { staticUser, staticRole, DisplayRole } from "@/lib/static-data"
import { cn } from "@/lib/utils"

// Static text content (replacing translations)
const footerText = {
  talent: "Talent",
  employer: "Employer",
  account: "Account",
  company: "Company",
  browse_jobs: "Browse Jobs",
  job_categories: "Job Categories",
  post_a_job: "Post a Job",
  find_talent: "Find Talent",
  my_profile: "My Profile",
  dashboard: "Dashboard",
  my_jobs: "My Jobs",
  settings: "Settings",
  upgrade_package: "Upgrade Package",
  log_in: "Log In",
  "sign-up": "Sign Up",
  about_us: "About Us",
  faq: "FAQ",
  contact_us: "Contact Us",
  download_q_tracker_windows: "Download Q Tracker (Windows)",
  download_q_tracker_macos: "Download Q Tracker (macOS)",
  download_q_tracker_linux: "Download Q Tracker (Linux)",
  copyright: "Qoolance",
  privacy_policy: "Privacy Policy",
}

export const Footer: FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { loggedIn, userId } = staticUser
  const { isRequestor, isSatisfier } = staticRole

  const [openSections, setOpenSections] = useState({
    talent: false,
    employer: false,
    account: false,
    company: false,
  })

  const handleToggle = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const jobCategoriesTo = loggedIn
    ? isRequestor
      ? Links.findATalentPage()
      : Links.findAJobPage() + "#categories"
    : Links.signIn()

  const postAJobMsg = loggedIn
    ? isSatisfier
      ? `You have to be an ${DisplayRole.EMPLOYER} to Post a Job.`
      : "login or sign up to post a job"
    : "login or sign up to post a job"

  const FindAJobLinks = (
    <ul className="list-none p-0 m-0 space-y-2">
      <li>
        <Link to={Links.browseJobsPage()} className="text-gray-700 hover:text-primary transition-colors">
          {footerText.browse_jobs}
        </Link>
      </li>
      <li>
        <a
          href={
            pathname !== Links.findAJobPage()
              ? Links.findAJobPage()
              : jobCategoriesTo
          }
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-primary transition-colors"
        >
          {footerText.job_categories}
        </a>
      </li>
    </ul>
  )

  const FindATalentLinks = (
    <ul className="list-none p-0 m-0 space-y-2">
      <li>
        <button
          type="button"
          onClick={() => {
            if (loggedIn) {
              navigate(
                isSatisfier
                  ? Links.profileSettingPage()
                  : Links.jobCreatePage(),
                {
                  state: {
                    msg: postAJobMsg,
                    type: "error",
                  },
                }
              )
            } else {
              navigate(Links.signIn())
            }
          }}
          className="text-gray-700 hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          {footerText.post_a_job}
        </button>
      </li>
      <li>
        <Link to={Links.browseTalentsPage()} className="text-gray-700 hover:text-primary transition-colors">
          {footerText.find_talent}
        </Link>
      </li>
    </ul>
  )

  const AccountLinks = (
    <ul className="list-none p-0 m-0 space-y-2">
      {loggedIn && userId ? (
        <>
          <li>
            <Link to={Links.userProfile()} className="text-gray-700 hover:text-primary transition-colors">
              <span>{footerText.my_profile}</span>
            </Link>
          </li>
          <li>
            <Link to={Links.dashboardOverviewPage()} className="text-gray-700 hover:text-primary transition-colors">
              <span>{footerText.dashboard}</span>
            </Link>
          </li>
          <li>
            <Link to={Links.myJobsPosted()} className="text-gray-700 hover:text-primary transition-colors">
              <span>{footerText.my_jobs}</span>
            </Link>
          </li>
          <li>
            <Link to={Links.settingsPage()} className="text-gray-700 hover:text-primary transition-colors">
              <span>{footerText.settings}</span>
            </Link>
          </li>
          <li>
            <Link to={Links.choosePackagesPage()} className="text-gray-700 hover:text-primary transition-colors">
              {footerText.upgrade_package}
            </Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link to={Links.signIn()} className="text-gray-700 hover:text-primary transition-colors">
              {footerText.log_in}
            </Link>
          </li>
          <li>
            <Link to={Links.signUpPage()} className="text-gray-700 hover:text-primary transition-colors">
              {footerText["sign-up"]}
            </Link>
          </li>
        </>
      )}
    </ul>
  )

  const CompanyLinks = (
    <ul className="list-none p-0 m-0 space-y-2">
      <li>
        <Link to={Links.aboutUsPage()} className="text-gray-700 hover:text-primary transition-colors">
          <span>{footerText.about_us}</span>
        </Link>
      </li>
      <li>
        <Link to={Links.faqPage()} className="text-gray-700 hover:text-primary transition-colors">
          <span>{footerText.faq}</span>
        </Link>
      </li>
      <li>
        <Link to={Links.contactUsPage()} className="text-gray-700 hover:text-primary transition-colors">
          <span>{footerText.contact_us}</span>
        </Link>
      </li>
      <li>
        <a href="#" className="text-gray-700 hover:text-primary transition-colors">
          <span>{footerText.download_q_tracker_windows}</span>
        </a>
      </li>
      <li>
        <a href="#" className="text-gray-700 hover:text-primary transition-colors">
          <span>{footerText.download_q_tracker_macos}</span>
        </a>
      </li>
      <li>
        <a href="#" className="text-gray-700 hover:text-primary transition-colors">
          <span>{footerText.download_q_tracker_linux}</span>
        </a>
      </li>
    </ul>
  )

  return (
    <div className="global-footer">
      <hr className="border-t border-gray-200 my-0" />

      <nav className="mx-5 md:hidden">
        <div className="footer-collapse-wrapper" id="footerCollapse">
          <div className="footer-collapse-item border-b border-gray-200">
            <h2 className="footer-collapse-header m-0">
              <button
                aria-controls="footerTalent"
                aria-expanded={openSections.talent}
                className={cn(
                  "collapse-toggle-btn w-full text-left py-4 px-0 bg-transparent border-none cursor-pointer flex items-center justify-between text-base font-medium",
                  !openSections.talent && "collapsed"
                )}
                type="button"
                onClick={() => handleToggle("talent")}
              >
                {footerText.talent}
              </button>
            </h2>
            <Collapse id="footerTalent" open={openSections.talent}>
              <div className="footer-collapse-body py-2">{FindAJobLinks}</div>
            </Collapse>
          </div>

          <div className="footer-collapse-item border-b border-gray-200">
            <h2 className="footer-collapse-header m-0">
              <button
                aria-controls="footerEmployer"
                aria-expanded={openSections.employer}
                className={cn(
                  "collapse-toggle-btn w-full text-left py-4 px-0 bg-transparent border-none cursor-pointer flex items-center justify-between text-base font-medium",
                  !openSections.employer && "collapsed"
                )}
                type="button"
                onClick={() => handleToggle("employer")}
              >
                {footerText.employer}
              </button>
            </h2>
            <Collapse id="footerEmployer" open={openSections.employer}>
              <div className="footer-collapse-body py-2">{FindATalentLinks}</div>
            </Collapse>
          </div>

          <div className="footer-collapse-item border-b border-gray-200">
            <h2 className="footer-collapse-header m-0">
              <button
                aria-controls="footerAccount"
                aria-expanded={openSections.account}
                className={cn(
                  "collapse-toggle-btn w-full text-left py-4 px-0 bg-transparent border-none cursor-pointer flex items-center justify-between text-base font-medium",
                  !openSections.account && "collapsed"
                )}
                type="button"
                onClick={() => handleToggle("account")}
              >
                {footerText.account}
              </button>
            </h2>
            <Collapse id="footerAccount" open={openSections.account}>
              <div className="footer-collapse-body py-2">{AccountLinks}</div>
            </Collapse>
          </div>

          <div className="footer-collapse-item border-b border-gray-200">
            <h2 className="footer-collapse-header m-0">
              <button
                aria-controls="footerCompany"
                aria-expanded={openSections.company}
                className={cn(
                  "collapse-toggle-btn w-full text-left py-4 px-0 bg-transparent border-none cursor-pointer flex items-center justify-between text-base font-medium",
                  !openSections.company && "collapsed"
                )}
                type="button"
                onClick={() => handleToggle("company")}
              >
                {footerText.company}
              </button>
            </h2>
            <Collapse id="footerCompany" open={openSections.company}>
              <div className="footer-collapse-body py-2">{CompanyLinks}</div>
            </Collapse>
          </div>
        </div>
      </nav>

      <Container>
        <nav className="desktop_footer hidden md:grid md:grid-cols-4 gap-8 py-8">
          <div>
            <h4 className="text-base font-semibold mb-4">{footerText.talent}</h4>
            {FindAJobLinks}
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">{footerText.employer}</h4>
            {FindATalentLinks}
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">{footerText.account}</h4>
            {AccountLinks}
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">{footerText.company}</h4>
            {CompanyLinks}
          </div>
        </nav>

        <div className="socials_wrap py-4">
          {/* Socials component placeholder */}
        </div>
        <div className="copyright flex items-center justify-between py-4">
          <p className="m-0">
            &copy; {new Date().getFullYear()}{" "}
            <b>{footerText.copyright}</b>
          </p>

          <div className="privacy_policy">
            <Button
              variant="link"
              to={Links.privacyPolicyPage()}
            >
              {footerText.privacy_policy}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
