// 곱셈 기능 테스트
import { multiply } from './multiplication';

describe('multiply 함수', () => {
  test('양수 두 개를 곱한다', () => {
    expect(multiply(2, 3)).toBe(6);
  });

  test('0과 양수를 곱하면 0이다', () => {
    expect(multiply(0, 5)).toBe(0);
  });

  test('0과 0을 곱하면 0이다', () => {
    expect(multiply(0, 0)).toBe(0);
  });

  test('음수와 양수를 곱하면 음수다', () => {
    expect(multiply(-2, 3)).toBe(-6);
  });

  test('음수 두 개를 곱하면 양수다', () => {
    expect(multiply(-2, -3)).toBe(6);
  });

  test('1을 곱하면 원래 값이 그대로다 (항등원)', () => {
    expect(multiply(7, 1)).toBe(7);
  });

  test('부동소수점 곱셈은 근사값으로 검증한다', () => {
    expect(multiply(0.1, 0.2)).toBeCloseTo(0.02);
  });

  test('Number.MAX_SAFE_INTEGER와 1을 곱하면 그대로다', () => {
    expect(multiply(Number.MAX_SAFE_INTEGER, 1)).toBe(Number.MAX_SAFE_INTEGER);
  });
});
