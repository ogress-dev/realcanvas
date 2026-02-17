import * as React from "react"
import Image from "next/image"

interface LogoIconProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
  size?: number
  src?: string
}

const LogoIcon = React.forwardRef<HTMLImageElement, LogoIconProps>(
  ({ size = 35, className, src = "/images/yepppp.svg", ...props }, ref) => {
    const aspectRatio = 5 / 19
    const width = size * aspectRatio

    return (
      <Image
        ref={ref}
        src={src}
        alt="Logo"
        width={width}
        height={size}
        className={className}
        {...props}
      />
    )
  }
)

LogoIcon.displayName = "LogoIcon"

export { LogoIcon }
