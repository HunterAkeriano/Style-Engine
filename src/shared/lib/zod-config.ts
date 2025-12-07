import { z } from "zod";

type Translator = (key: string, params?: Record<string, unknown>) => string;

const defaultErrorMap = ((issue: any, ctx: any) => {
  switch (issue.code) {
    case "too_small": {
      if (issue.type === "string" && issue.minimum !== undefined) {
        return {
          message: ctx.defaultError,
        };
      }
      break;
    }
    case "too_big": {
      if (issue.type === "string" && issue.maximum !== undefined) {
        return {
          message: ctx.defaultError,
        };
      }
      break;
    }
    default:
      break;
  }
  return { message: ctx.defaultError };
}) as z.ZodErrorMap;

export function applyZodErrorMap(t?: Translator) {
  if (!t) {
    z.setErrorMap(defaultErrorMap);
    return;
  }

  const map = ((issue: any, ctx: any) => {
    switch (issue.code) {
      case "invalid_type":
        return {
          message: t("VALIDATION.INVALID_TYPE", {
            expected: (issue as any).expected,
            received: (issue as any).received,
          }),
        };
      case "invalid_enum_value":
        return { message: t("VALIDATION.INVALID_ENUM") };
      case "too_small":
        if (issue.type === "string" && issue.minimum !== undefined) {
          return {
            message: t("VALIDATION.MIN_STRING", { min: issue.minimum }),
          };
        }
        break;
      case "too_big":
        if (issue.type === "string" && issue.maximum !== undefined) {
          return {
            message: t("VALIDATION.MAX_STRING", { max: issue.maximum }),
          };
        }
        break;
      default:
        break;
    }
    return { message: ctx.defaultError };
  }) as z.ZodErrorMap;

  z.setErrorMap(map);
}

applyZodErrorMap();
