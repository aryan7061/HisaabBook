import { InputNumber, InputNumberProps } from "antd";

import {
  AmountCurrency,
  CURRENCY_SYMBOL,
  formatAmountForInput,
  parseAmountFromInput,
} from "@/utilities/number-format";

type Props = Omit<
  InputNumberProps<number>,
  "formatter" | "parser" | "prefix"
> & {
  currency?: AmountCurrency;
};

export const AmountInput = ({ currency = "INR", style, ...rest }: Props) => {
  return (
    <InputNumber<number>
      prefix={CURRENCY_SYMBOL[currency]}
      min={0}
      placeholder="0.00"
      controls={false}
      formatter={(value) => formatAmountForInput(value, currency)}
      parser={(display) => Number(parseAmountFromInput(display))}
      style={{ width: "100%", ...style }}
      {...rest}
    />
  );
};
