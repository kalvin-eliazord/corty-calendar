import styled from "styled-components";

const SliderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 9px;

  div {
    display: flex;
    gap: 20px;

    label {
      width: 90px;
    }
  }
`;

type SliderProps = {
  name: string;
  min: string;
  max: string;
  sliderValue: string;
  setSliderValue(sliderValue: string): void;
};

const Slider: React.FC<SliderProps> = ({
  name,
  min,
  max,
  sliderValue,
  setSliderValue,
}) => {
  return (
    <SliderContainer>
      <div>
        <label htmlFor={name}> {name} </label>
      </div>
      <label htmlFor={name}> {sliderValue} </label>

      <input
        id={name}
        type="range"
        value={sliderValue}
        onChange={(e) => setSliderValue(e.target.value)}
        name={name}
        min={min}
        max={max}
        step="1"
      />
    </SliderContainer>
  );
};

export default Slider;
