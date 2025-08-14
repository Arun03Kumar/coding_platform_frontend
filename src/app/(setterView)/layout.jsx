import SideBar from "@/components/SideBar";

const SetterLayout = ({ children }) => {
  return (
    <div className="h-full flex dark:bg-[#1f1f1f]">
      <SideBar />
      <div className="flex-1 h-full overflow-y-auto">{children}</div>
    </div>
  );
};

export default SetterLayout;
