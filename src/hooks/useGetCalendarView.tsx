import { useLocation } from "react-router-dom";

const useGetCalendarView = () => {
  const location = useLocation();
  const splittedUrl = location.pathname.split("/");
  console.log("called ?")
  return splittedUrl[2];
};

export default useGetCalendarView;