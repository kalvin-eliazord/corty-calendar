import { useState, useEffect } from "react";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  position:relative;
  top:20px;
  gap: 20px;
  h4 {
  font-size:15px;
    padding-left: 90px;
    width: 135px;
  }

  label,
  input {
    position: relative;
    top: 20px;
  }
`;

type RadioType = {
  id: string;
  value: string;
  isChecked: boolean;
};

type RadioProps = {
  name: string;
  radioChecked: number | null;
  setRadio: (radio: string) => void;
};

const initRadioValues = (values: string[]): RadioType[] =>
  Array.from({ length: values.length }, (_, i) => ({
    id: crypto.randomUUID(),
    value: values[i],
    isChecked: i === 0,
  }));

const Radio: React.FC<RadioProps> = ({ name, radioChecked, setRadio }) => {
  const [radioValues, setRadioValues] = useState<RadioType[]>(
    initRadioValues(["1", "2", "3"])
  );

  useEffect(() => {
    if (!radioChecked) return;
    setRadioValues(
      radioValues.map((radio) => ({
        ...radio,
        isChecked: Number(radio.value) === radioChecked,
      }))
    );
  }, [radioChecked]);

  const toggleIsChecked = (radioId: string, radioValue: string) => {
    setRadioValues(
      radioValues.map((radio) => ({
        ...radio,
        isChecked: radio.id === radioId,
      }))
    );

    setRadio(radioValue);
  };

  return (
    <Form>
      <h4>{name}</h4>
      {radioValues.map((radio) => (
        <div
          key={radio.id}
          onClick={() => toggleIsChecked(radio.id, radio.value)}
        >
          <label htmlFor={`${radio.id}`}> {radio.value} </label>
          <input
            id={radio.id}
            type="radio"
            name={name}
            value={radio.value}
            checked={radio.isChecked}
            readOnly
          />
        </div>
      ))}
    </Form>
  );
};

export default Radio;
