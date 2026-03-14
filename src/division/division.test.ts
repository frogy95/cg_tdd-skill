// 나눗셈 기능 테스트
import { divide } from './division';

describe('divide 함수', () => {
  describe('기본 나눗셈', () => {
    test('6을 3으로 나누면 2를 반환한다', () => {
      expect(divide(6, 3)).toBe(2);
    });

    test('7을 2로 나누면 3.5를 반환한다', () => {
      expect(divide(7, 2)).toBe(3.5);
    });

    test('0을 5로 나누면 0을 반환한다', () => {
      expect(divide(0, 5)).toBe(0);
    });
  });

  describe('0으로 나누기 예외 처리', () => {
    test('5를 0으로 나누면 Error를 throw한다', () => {
      expect(() => divide(5, 0)).toThrow(Error);
    });

    test('0을 0으로 나누면 Error를 throw한다', () => {
      expect(() => divide(0, 0)).toThrow(Error);
    });
  });

  describe('음수 나눗셈', () => {
    test('-6을 3으로 나누면 -2를 반환한다', () => {
      expect(divide(-6, 3)).toBe(-2);
    });

    test('-6을 -3으로 나누면 2를 반환한다', () => {
      expect(divide(-6, -3)).toBe(2);
    });

    test('6을 -3으로 나누면 -2를 반환한다', () => {
      expect(divide(6, -3)).toBe(-2);
    });
  });

  describe('특수 케이스', () => {
    test('7을 1로 나누면 7을 반환한다 (항등원)', () => {
      expect(divide(7, 1)).toBe(7);
    });

    test('5를 5로 나누면 1을 반환한다 (자기 자신으로 나누기)', () => {
      expect(divide(5, 5)).toBe(1);
    });

    test('1을 3으로 나누면 부동소수점 오차 범위 내에서 0.3333...에 근사한다', () => {
      expect(divide(1, 3)).toBeCloseTo(0.3333333333333333);
    });

    test('Number.MAX_SAFE_INTEGER를 1로 나누면 Number.MAX_SAFE_INTEGER를 반환한다', () => {
      expect(divide(Number.MAX_SAFE_INTEGER, 1)).toBe(Number.MAX_SAFE_INTEGER);
    });
  });
});
