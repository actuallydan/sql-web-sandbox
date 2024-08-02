import { DetailedHTMLProps, forwardRef, HTMLAttributes } from "react";

type SidebarResizeHandlerProps = {
  sideBarWidthInPixels: number;
};

const SidebarResizeHandler = forwardRef<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  SidebarResizeHandlerProps
>((props: SidebarResizeHandlerProps, ref) => {
  const { sideBarWidthInPixels } = props;

  return (
    <div
      id="sidebarHandle"
      className={`text-xs text-gray-400 cursor-col-resize`}
      style={{ left: `calc(${sideBarWidthInPixels}px + 0.5rem)` }}
      {...props}
      ref={ref}
    >
      <span>||</span>
    </div>
  );
});

SidebarResizeHandler.displayName = "SidebarResizeHandler";

export default SidebarResizeHandler;
