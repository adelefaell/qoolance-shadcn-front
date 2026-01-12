import { type FC } from "react"
import { CurveColors } from "@/lib/static-data"

interface MenuCurveProps {
  color?: CurveColors
  height?: number
}

export const MenuCurve: FC<MenuCurveProps> = ({ color = CurveColors.LightBlue, height = 200 }) => {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-[1]"
      style={{
        height: `${height}px`,
        backgroundColor: color,
        clipPath: "ellipse(100% 60% at 50% 0%)",
      }}
    />
  )
}
