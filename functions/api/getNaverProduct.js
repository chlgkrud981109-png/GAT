export async function onRequest(context) {
  // Cloudflare Pages Functions에서 제공하는 파라미터들
  const { request, env } = context;

  // URL에서 keyword 파라미터 추출
  const url = new URL(request.url);
  const keyword = url.searchParams.get("keyword");

  if (!keyword) {
    return new Response(JSON.stringify({ error: "keyword 파라미터가 필요합니다." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // 검색어를 네이버 API URL에 안전하게 삽입
  const NAVER_API_URL = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(keyword)}&display=1&sort=sim`;

  try {
    // 💡 Cloudflare 환경 변수 (대시보드에서 등록) 사용!! 💡
    const clientId = env.NAVER_CLIENT_ID;
    const clientSecret = env.NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return new Response(JSON.stringify({ error: "네이버 API 키가 서버 환경 변수에 설정되어 있지 않습니다." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 서버(Cloudflare)에서 네이버 API로 안전하게 비공개 통신
    const response = await fetch(NAVER_API_URL, {
      method: "GET",
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret
      }
    });

    if (!response.ok) {
      throw new Error(`Naver API 가 에러 코드를 반환했습니다: ${response.status}`);
    }

    const data = await response.json();
    const items = data.items;
    const product = items && items.length > 0 ? items[0] : null;

    if (!product) {
      return new Response(JSON.stringify({ error: "제품을 찾을 수 없습니다." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const priceVal = parseInt(product.lprice, 10);

    // 성공 결과 반환
    return new Response(JSON.stringify({
      success: true,
      priceVal: priceVal,
      priceFormatted: '₩' + priceVal.toLocaleString(),
      productUrl: product.link,
      productName: product.title.replace(/<[^>]*>?/g, ''),
      productImage: product.image
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "서버 처리 중 에러가 발생했습니다.", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
