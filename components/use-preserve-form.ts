"use client";

import { useEffect, useRef } from "react";

type FormSnapshot = Record<string, string[]>;

export function usePreserveFormOnError<T extends HTMLFormElement>(hasError: boolean) {
  const formRef = useRef<T>(null);
  const snapshotRef = useRef<FormSnapshot | null>(null);
  const onSubmit = (event: React.FormEvent<T>) => {
    const snapshot: FormSnapshot = {};
    new FormData(event.currentTarget).forEach((value, key) => { (snapshot[key] ??= []).push(String(value)); });
    snapshotRef.current = snapshot;
  };
  useEffect(() => {
    if (!hasError || !snapshotRef.current || !formRef.current) return;
    const snapshot = snapshotRef.current;
    formRef.current.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input[name], textarea[name], select[name]").forEach((field) => {
      const values = snapshot[field.name] ?? [];
      if (field instanceof HTMLInputElement && field.type === "checkbox") field.checked = values.includes(field.value);
      else if (field instanceof HTMLInputElement && field.type === "radio") field.checked = values.includes(field.value);
      else field.value = values[0] ?? "";
    });
  }, [hasError]);
  return { formRef, onSubmit };
}
