import { Task } from "../context/TasksContext";
import { CalendarViewSelector } from "./Navbar/Navbar.styles";

type LabelSelectorProps = {
  tasks: Task[];
  labelsSelected: string[];
  handleLabelSelectChange(value: string): void;
};

const LabelSelector: React.FC<LabelSelectorProps> = ({
  tasks,
  labelsSelected,
  handleLabelSelectChange,
}) => {
  return (
    <CalendarViewSelector
      onChange={(e: any) => handleLabelSelectChange(e.target.value)}
    >
      <option value="default"> Select a label </option>

      {[...new Set(tasks.flatMap((task) => task.labels))].map(
        (labelAvailable) =>
          !labelsSelected.includes(labelAvailable.name) && (
            <option key={labelAvailable.id} value={labelAvailable.name}>
              {labelAvailable.name}
            </option>
          )
      )}
    </CalendarViewSelector>
  );
};

export default LabelSelector;
