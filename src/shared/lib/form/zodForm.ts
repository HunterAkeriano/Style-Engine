import { computed, inject, isRef, provide, reactive, type ComputedRef } from "vue";
import type { ZodTypeAny } from "zod";

const FormContextKey = Symbol("zod-form-context");

type FormSchema = ZodTypeAny | ComputedRef<ZodTypeAny>;

export interface FormContext {
  registerField: (name: string) => {
    name: string;
    value: any;
    error: any;
    touched: any;
    setValue: (val: unknown) => void;
    validate: () => boolean;
  };
  setValue: (name: string, value: unknown) => void;
  validateAll: () => any | null;
  validateField: (name: string) => boolean;
  values: Record<string, any>;
  errors: Record<string, string>;
}

function resolveSchema(schema: FormSchema) {
  return isRef(schema) ? schema.value : schema;
}

export function useZodForm(schema: FormSchema, initial: Record<string, unknown> = {}): FormContext {
  const values = reactive<Record<string, any>>({ ...initial });
  const errors = reactive<Record<string, string>>({});
  const touched = reactive<Record<string, boolean>>({});

  function setValue(name: string, value: unknown) {
    values[name] = value;
    if (touched[name]) validateField(name);
  }

  function validateField(name: string) {
    const currentSchema = resolveSchema(schema);
    const parsed = currentSchema.safeParse(values);
    errors[name] = "";
    if (!parsed.success) {
      const issue = parsed.error.issues.find((i) => i.path[0] === name);
      if (issue) errors[name] = issue.message;
      return false;
    }
    return true;
  }

  function validateAll() {
    Object.keys(errors).forEach((k) => (errors[k] = ""));
    const currentSchema = resolveSchema(schema);
    const parsed = currentSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        errors[key] = errors[key] || issue.message;
      });
      return null;
    }
    Object.assign(values, parsed.data);
    return parsed.data;
  }

  function registerField(name: string) {
    if (!(name in values)) values[name] = "";
    const value = computed({
      get: () => values[name],
      set: (val) => {
        touched[name] = true;
        setValue(name, val);
      },
    });
    const error = computed(() => errors[name] || "");
    const isTouched = computed(() => Boolean(touched[name]));
    return {
      name,
      value,
      error,
      touched: isTouched,
      setValue: (val: unknown) => {
        touched[name] = true;
        setValue(name, val);
      },
      validate: () => {
        touched[name] = true;
        return validateField(name);
      },
    };
  }

  const context: FormContext = {
    registerField,
    setValue,
    validateAll,
    validateField,
    values,
    errors,
  };

  provide(FormContextKey, context);
  return context;
}

export function useFormContext() {
  return inject<FormContext | null>(FormContextKey, null);
}
