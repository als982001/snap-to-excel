export const EXTRACT_PRODUCTS_PROMPT = `
이 손글씨 이미지에서 상품 목록을 추출해주세요.
각 줄에는 상품코드, 상품명, 개수가 적혀 있습니다.
단위(EA, BOX 등)가 명시되어 있으면 해당 값을 사용하고, 없으면 "EA"로 처리합니다.

반드시 아래 JSON 배열 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.

[
  { "code": "상품코드", "name": "상품명", "quantity": 숫자, "unit": "EA" }
]

인식이 불가능한 필드는 빈 문자열("")로 반환하세요.
quantity가 인식 불가한 경우 0으로 반환하세요.
`;

export const GEMINI_MODEL = "gemini-2.0-flash";
export const GEMINI_3_FLASH_PREVIEW = "gemini-3-flash-preview";
