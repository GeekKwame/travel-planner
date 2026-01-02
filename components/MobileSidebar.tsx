import { useRef, forwardRef } from "react";
import { Link } from "react-router-dom";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import type { SidebarModel } from '@syncfusion/ej2-navigations';
import NavItems from "./NavItems";

interface CustomSidebarProps extends SidebarModel {
  children?: React.ReactNode;
}

const CustomSidebar = forwardRef<SidebarComponent, CustomSidebarProps>((props, ref) => {
  return <SidebarComponent {...props} ref={ref} />;
});

const MobileSidebar = () => {
  const sidebar = useRef<SidebarComponent>(null);
  const toggleSidebar = () => {
    sidebar.current?.toggle()
  }
  return (
    <div className="mobile-sidebar wrapper">
      <header>
        <Link to="/">
          <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />

          <h1>Tourvisto</h1>
        </Link>
        <button onClick={toggleSidebar}>
            <img 
                src="/assets/icons/menu.svg" alt="menu" 
                className="size-7" />
        </button>
      </header>

      <CustomSidebar 
      ref={sidebar} 
      width="270px" enableGestures={false}
        created={()=> sidebar.current?.hide()}
        closeOnDocumentClick={true}
        showBackdrop={true}
        type="Over"

        >
        <NavItems onLinkClick={toggleSidebar} />
      </CustomSidebar>
    </div>
  );
};

export default MobileSidebar;
