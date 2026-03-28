import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // 로그인 페이지 (인증 불필요)
  route("/login", "./features/auth/pages/login-page.tsx"),

  // 인증 필요 라우트
  layout("./components/ProtectedLayout.tsx", [
    index("./features/dashboard/pages/dashboard-page.tsx"),
  ]),
] satisfies RouteConfig;
