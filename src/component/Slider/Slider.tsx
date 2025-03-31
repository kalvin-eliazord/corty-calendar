import SliderContainer from "./Slider.styles";

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
        onChange={(e:any) => setSliderValue(e.target.value)}
        name={name}
        min={min}
        max={max}
        step="1"
      />
    </SliderContainer>
  );
};

export default Slider;
