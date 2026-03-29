export async function onRequest(context) {
  const { env } = context;

  // 널 병합 및 앞뒤 공백/따옴표 제거 로직 (사용자 실수 방지)
  const cleanVar = (val) => {
    if (!val) return null;
    return val.trim().replace(/^['"]|['"]$/g, '');
  };

  // Cloudflare 대시보드(또는 로컬 .env)에 등록된 환경 변수를 안전하게 취합
  const firebaseConfig = {
    apiKey: cleanVar(env.FB_API_KEY),
    authDomain: cleanVar(env.FB_AUTH_DOMAIN),
    projectId: cleanVar(env.FB_PROJECT_ID),
    storageBucket: cleanVar(env.FB_STORAGE_BUCKET),
    messagingSenderId: cleanVar(env.FB_MESSAGING_SENDER_ID),
    appId: cleanVar(env.FB_APP_ID),
    measurementId: cleanVar(env.FB_MEASUREMENT_ID)
  };

  // 만약 API Key가 누락되었다면 가이드와 함께 반환
  if (!firebaseConfig.apiKey) {
    return new Response(JSON.stringify({ 
      error: "FB_API_KEY is missing", 
      details: "Firebase API 키가 Cloudflare 환경 변수(FB_API_KEY)에 등록되지 않았습니다. 대시보드에서 'Secret'으로 등록해 주세요." 
    }), {
      status: 200, 
      headers: { "Content-Type": "application/json" }
    });
  }

  // 프론트엔드로 설정값 JSON 반환
  return new Response(JSON.stringify(firebaseConfig), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
