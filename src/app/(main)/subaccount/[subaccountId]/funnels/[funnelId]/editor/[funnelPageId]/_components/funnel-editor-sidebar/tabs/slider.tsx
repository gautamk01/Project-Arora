import { Slider } from "@/components/ui/slider";
import React, { useState, useEffect } from "react";

const PercentageSlider = ({ defaultValue, onValueChange }: any) => {
  // Parse the initial value from the defaultValue prop
  const getInitialValue = () => {
    if (typeof defaultValue === "string" && defaultValue.includes("%")) {
      return parseInt(defaultValue.replace("%", ""), 10);
    }
    return 100;
  };

  // State to hold the current value of the slider
  const [value, setValue] = useState(getInitialValue());

  // Effect to handle changes in defaultValue prop
  useEffect(() => {
    setValue(getInitialValue());
  }, [defaultValue]);

  // Handler for slider change
  // Handler for slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(e.target.value, 10);
    setValue(newValue);
    // Log the event structure for debugging
    console.log("Slider change event:", {
      id: "opacity",
      value: `${newValue}%`,
    });
    if (onValueChange) {
      onValueChange({
        target: {
          id: "opacity",
          value: `${newValue}%`,
        },
      });
    }
  };
  return (
    <div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        className="slider-thumb  h-2 w-full  outline-none slider-thumb focus:outline-none focus:ring-2 "
        onChange={handleSliderChange}
      />
    </div>
  );
};

export default PercentageSlider;
