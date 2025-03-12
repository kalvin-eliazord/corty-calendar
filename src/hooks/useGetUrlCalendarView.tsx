import { useLocation } from "react-router-dom";

const useGetUrlCalendarView = () => {
  const location = useLocation();
  const splittedUrl = location.pathname.split("/");
  return splittedUrl[2];
};

export default useGetUrlCalendarView;