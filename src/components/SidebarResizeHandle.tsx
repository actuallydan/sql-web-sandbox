import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  LegacyRef,
} from "react";

type SidebarResizeHandlerProps = {
  sideBarWidthInPixels: number;
} & HTMLAttributes<HTMLDivElement>;

const SidebarResizeHandler = forwardRef<
  HTMLDivElement,
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
