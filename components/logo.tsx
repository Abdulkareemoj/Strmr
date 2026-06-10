import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="0"
        y="20"
        className="fill-foreground"
        fontSize="20"
        fontWeight="700"
        fontFamily="system-ui"
      >
        Strmr
      </text>
    </svg>
  );
}
