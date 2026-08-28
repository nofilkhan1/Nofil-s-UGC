"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

type Option = { value: string; label: string };

export function SelectField({ name, label, defaultValue, placeholder, options, hint, required }: { name: string; label: string; defaultValue?: string; placeholder?: string; options: Option[]; hint?: string; required?: boolean }) {
  return (
    <div className="field">
      <label className="field__label" id={`${name}-label`}>{label}</label>
      <SelectPrimitive.Root name={name} defaultValue={defaultValue} required={required}>
        <SelectPrimitive.Trigger className="select-trigger" aria-labelledby={`${name}-label`}>
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon><ChevronDown size={16} aria-hidden="true" /></SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="select-content" position="popper" sideOffset={5}>
            <SelectPrimitive.Viewport className="select-viewport">
              {options.map((option) => (
                <SelectPrimitive.Item className="select-item" key={option.value} value={option.value}>
                  <SelectPrimitive.ItemIndicator className="select-item__indicator"><Check size={15} aria-hidden="true" /></SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      <span className="field__hint">{hint ?? " "}</span>
    </div>
  );
}
