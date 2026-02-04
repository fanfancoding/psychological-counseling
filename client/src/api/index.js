import request from "../utils/request";

// 验证Token
export function validateToken(token) {
  return request({
    url: "/validate-token",
    method: "get",
    params: { token },
  });
}

// 提交答案
export function submitAnswer(token, answers) {
  return request({
    url: "/submit-answer",
    method: "post",
    data: { token, answers },
  });
}
