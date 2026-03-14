// 덧셈 기능 테스트
import { add } from './addition';

describe('add 함수', () => {
  test('양수 두 개를 더한다', () => {
    expect(add(1, 2)).toBe(3);
  });

  test('0과 0을 더하면 0이다', () => {
    expect(add(0, 0)).toBe(0);
  });

  test('음수와 양수를 더하면 0이다', () => {
    expect(add(-1, 1)).toBe(0);
  });

  test('음수 두 개를 더한다', () => {
    expect(add(-3, -2)).toBe(-5);
  });

  test('부동소수점 덧셈은 근사값으로 검증한다', () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });

  test('Number.MAX_SAFE_INTEGER와 0을 더하면 그대로다', () => {
    expect(add(Number.MAX_SAFE_INTEGER, 0)).toBe(Number.MAX_SAFE_INTEGER);
  });
});
