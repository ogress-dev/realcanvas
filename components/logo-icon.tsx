import * as React from "react"

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

const LogoIcon = React.forwardRef<SVGSVGElement, LogoIconProps>(
  ({ size = 35, className, ...props }, ref) => {
    const aspectRatio = 28 / 35
    const width = size * aspectRatio

    return (
      <svg
        ref={ref}
        width={width}
        height={size}
        viewBox="0 0 28 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        <path
          d="M27.45 5.40798C27.45 2.42262 25.0274 0 22.0421 0H5.40798C2.42262 0 0 2.42262 0 5.40798V29.2718C0 32.2571 2.42262 34.6798 5.40798 34.6798H12.261C11.7698 34.489 11.2976 34.241 10.8493 33.9358C9.6428 33.1203 8.68901 31.9853 7.99275 30.5403C7.29648 29.0906 6.94835 27.4691 6.94835 25.676C6.86728 23.5872 7.23449 21.6224 8.05475 19.7863C8.87024 17.9503 10.01 16.4815 11.4741 15.3846C12.9334 14.2878 14.5357 13.7346 16.2812 13.7346C17.0585 13.7346 17.7834 13.8347 18.451 14.035C19.1187 14.2353 19.753 14.531 20.3395 14.9173C20.6114 15.0937 20.8784 15.3035 21.1455 15.5277V6.93404L26.2912 6.12809V28.566L26.8062 31.8327C27.2164 31.0697 27.45 30.197 27.45 29.2718V5.40798Z"
          className="fill-primary"
        />
      </svg>
    )
  }
)

LogoIcon.displayName = "LogoIcon"

export { LogoIcon }
