import { validateCpf } from "../src/validateCpf";

test.each(["12345678901", "12345678902", "12345678903"])(
  "should validate the cpf %s",
  async (cpf: string) => {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(true);
  }
);

test.each([null, undefined, "1111", "12345678903"])(
  "shouldn't validate the cpf 1",
  async (cpf: any) => {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(true);
  }
);
