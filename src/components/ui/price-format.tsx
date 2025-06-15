"use client";

import { cn } from "~/lib/utils";
import { NumericFormat } from "react-number-format";

interface PriceFormatProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  prefix?: string;
  thousandSeparator?: string;
  decimalSeparator?: string;
  decimalScale?: number;
}

const PriceFormat: React.FC<PriceFormatProps> = ({
  className,
  decimalScale = 2,
  decimalSeparator = ",",
  prefix = "$",
  thousandSeparator = ".",
  value,
}) => {
  return (
    <NumericFormat
      value={value}
      thousandSeparator={thousandSeparator}
      decimalSeparator={decimalSeparator}
      decimalScale={decimalScale}
      prefix={prefix}
      displayType="text"
      className={cn("text-lg font-medium", className)}
    />
  );
};

export default PriceFormat;