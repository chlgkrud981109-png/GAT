export async function onRequest(context) {
  const { request, env } = context;

  // URL 파라미터 추출
  const url = new URL(request.url);
  const keyword = url.searchParams.get("keyword") || "";
  const category = url.searchParams.get("category");
  const display = url.searchParams.get("display") || "40"; // Fetch more for grouping
  
  // Category debugging: map frontend categories to sensible Naver keywords if no explicit keyword is given
  let queryKeyword = keyword;
  if (!queryKeyword && category && category !== 'all') {
    const categoryQueryMap = {
      'smartphone': '스마트폰',
      'laptop': '노트북',
      'audio': '블루투스 이어폰',
      'kitchen': '주방가전',
      'home': '생활가전',
      'fashion': '스니커즈'
    };
    queryKeyword = categoryQueryMap[category] || category;
  }

  if (!queryKeyword) {
    return new Response(JSON.stringify({ 
      success: false,
      error: "keyword 또는 유효한 category 파라미터 누락",
      details: "요청 URL에 검색어나 카테고리가 전달되지 않았습니다." 
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // 검색어를 네이버 API URL에 삽입 (display 파라미터 동적 적용)
  const NAVER_API_URL = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(queryKeyword)}&display=${display}&sort=sim`;

  try {
    const clientId = env.NAVER_CLIENT_ID;
    const clientSecret = env.NAVER_CLIENT_SECRET;

    if (!clientId) {
      return new Response(JSON.stringify({ 
        success: false,
        error: "Naver Client ID is missing", 
        details: "Cloudflare 환경 변수에 'NAVER_CLIENT_ID' 값을 찾을 수 없습니다. 대시보드의 Environment variables 설정을 확인하세요." 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!clientSecret) {
      return new Response(JSON.stringify({ 
        success: false,
        error: "Naver Client Secret is missing", 
        details: "Cloudflare 환경 변수에 'NAVER_CLIENT_SECRET' 값을 찾을 수 없습니다. 대시보드의 Environment variables 설정을 확인하세요." 
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
    
    // items 배열을 살짝 정제하여 클라이언트로 반환 (상세 정보 포함)
    const cleanItems = (data.items || []).map(item => ({
      id: item.productId,
      name: item.title.replace(/<[^>]*>?/g, ''), // HTML 태그 제거
      brand: item.brand,
      maker: item.maker,
      mallName: item.mallName,
      image: item.image,
      lprice: parseInt(item.lprice, 10),
      hprice: item.hprice ? parseInt(item.hprice, 10) : null,
      priceFormatted: '₩' + parseInt(item.lprice, 10).toLocaleString(),
      link: item.link,
      category: `${item.category1} > ${item.category2} > ${item.category3}`,
      productType: item.productType, // 1: 가격비교(Cluster), 2: 최저가몰, 3: 일반상품 등
      mallName: item.mallName,
      // For Item Winner logic simulation (since basic API might lack these, we generate realistic ones based on grouping)
      reviewCount: Math.floor(Math.random() * 500) + 10,
      rating: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)
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
