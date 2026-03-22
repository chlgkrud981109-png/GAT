export async function onRequest(context) {
  const { request, env } = context;

  // URL 파라미터 추출
  const url = new URL(request.url);
  const keyword = url.searchParams.get("keyword");
  const display = url.searchParams.get("display") || "10"; // 기본 10개 반환

  if (!keyword) {
    return new Response(JSON.stringify({ error: "keyword 파라미터가 필요합니다." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // 검색어를 네이버 API URL에 삽입 (display 파라미터 동적 적용)
  const NAVER_API_URL = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(keyword)}&display=${display}&sort=sim`;

  try {
    const clientId = env.NAVER_CLIENT_ID;
    const clientSecret = env.NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return new Response(JSON.stringify({ 
        success: false,
        error: "네이버 API 키 누락", 
        details: "Cloudflare 환경 변수 설정에 NAVER_CLIENT_ID 혹은 NAVER_CLIENT_SECRET 값이 비어있습니다." 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const response = await fetch(NAVER_API_URL, {
      method: "GET",
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({
        success: false,
        error: `Naver API HTTP 에러: ${response.status}`,
        details: errorText,
        urlLoaded: NAVER_API_URL
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await response.json();
    
    // items 배열을 살짝 정제하여 클라이언트로 반환
    const cleanItems = (data.items || []).map(item => ({
      id: item.productId,
      name: item.title.replace(/<[^>]*>?/g, ''), // HTML 태그 제거
      brand: item.mallName,
      image: item.image,
      lprice: parseInt(item.lprice, 10),
      priceFormatted: '₩' + parseInt(item.lprice, 10).toLocaleString(),
      link: item.link
    }));

    return new Response(JSON.stringify({
      success: true,
      items: cleanItems
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false,
      error: "Cloudflare 워커 내부 처리 불가", 
      details: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
