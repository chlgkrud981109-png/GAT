export async function onRequest(context) {
  const { env } = context;

  // Cloudflare 대시보드(또는 로컬 .env)에 등록된 환경 변수를 안전하게 취합
  const firebaseConfig = {
    apiKey: env.FB_API_KEY,
    authDomain: env.FB_AUTH_DOMAIN,
    projectId: env.FB_PROJECT_ID,
    storageBucket: env.FB_STORAGE_BUCKET,
    messagingSenderId: env.FB_MESSAGING_SENDER_ID,
    appId: env.FB_APP_ID,
    measurementId: env.FB_MEASUREMENT_ID
  };

  // 만약 환경 변수가 누락되었다면 에러 반환
  if (!firebaseConfig.apiKey) {
    return new Response(JSON.stringify({ error: "Firebase 환경 변수(FB_API_KEY 등)가 서버에 설정되지 않았습니다." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  // 프론트엔드로 설정값 JSON 반환
  return new Response(JSON.stringify(firebaseConfig), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
