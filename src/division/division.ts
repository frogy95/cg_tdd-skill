// 나눗셈 기능 구현

/** 0으로 나누기를 시도할 때 사용하는 에러 메시지 */
const DIVISION_BY_ZERO_ERROR = '0으로 나눌 수 없습니다';

/**
 * 두 숫자를 나눈 결과를 반환한다.
 *
 * @param a - 피제수 (나뉘는 수)
 * @param b - 제수 (나누는 수)
 * @returns a를 b로 나눈 값
 * @throws {Error} b가 0일 경우 에러를 던진다
 */
export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error(DIVISION_BY_ZERO_ERROR);
  }
  return a / b;
}
