import { type FC } from "react"
import { useLocation } from "react-router"
import { Links } from "@/lib/links"
import { QNavLink } from "@/components/ui/q-nav-link"
import { cn } from "@/lib/utils"

export const PageSwitcher: FC = () => {
  const location = useLocation()
  const isFindJob = location.pathname.includes("find-a-job") || location.pathname === "/"
  const isFindTalent = location.pathname.includes("find-a-talent")

  return (
    <nav className="page-switcher">
      <ul className="flex gap-4 list-none p-0 m-0">
        <li>
          <QNavLink
            to={Links.findAJobPage()}
            className={cn(
              "relative pb-2",
              isFindJob && "text-primary"
            )}
          >
            Find Job
            {isFindJob && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded" />
            )}
          </QNavLink>
        </li>
        <li>
          <QNavLink
            to={Links.findATalentPage()}
            className={cn(
              "relative pb-2",
              isFindTalent && "text-primary"
            )}
          >
            Find Talent
            {isFindTalent && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded" />
            )}
          </QNavLink>
        </li>
      </ul>
    </nav>
  )
}
