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

  // --- 로컬 개발 전용 Mock 데이터 (API 호출 없이 즉시 반환) ---
  // 로컬 여부 판단: IS_LOCAL 플래그, CF_PAGES 부재, 또는 네이버 키가 플레이스홀더인 경우
  const clientId = env.NAVER_CLIENT_ID || "";
  const isLocal = env.IS_LOCAL === 'true' || 
                  env.IS_LOCAL === true || 
                  !env.CF_PAGES || 
                  clientId.includes('YOUR_NAVER') || 
                  clientId.includes('실제');
  
  if (isLocal) {
    console.log(`[LOCAL DEV] Mock 데이터를 반환합니다. (검색어: ${queryKeyword})`);
    
    const MOCK_ITEMS = [
      {
        id: "mock_16_pro",
        name: `Apple 아이폰 16 Pro 256GB [실제 데이터 아님]`,
        brand: "Apple",
        maker: "Apple",
        mallName: "애플 공식 홈페이지",
        image: "https://shop-phinf.pstatic.net/20240913_243/1726202410123_S6SjK_PNG/Apple_iPhone_16_Pro_Natural_Titanium.png",
        lprice: 1550000,
        hprice: null,
        priceFormatted: "₩1,550,000",
        link: "https://www.apple.com/kr/iphone-16-pro/",
        category: "디지털/가전 > 휴대폰 > 스마트폰",
        productType: "1",
        reviewCount: 482,
        rating: "4.9"
      },
      {
        id: "mock_s24_ultra",
        name: `Samsung 갤럭시 S24 Ultra 512GB [실제 데이터 아님]`,
        brand: "삼성전자",
        maker: "삼성전자",
        mallName: "삼성닷컴",
        image: "https://shop-phinf.pstatic.net/20240118_143/1705500123456_ABCDE_PNG/Samsung_Galaxy_S24_Ultra.png",
        lprice: 1690000,
        hprice: null,
        priceFormatted: "₩1,690,000",
        link: "https://www.samsung.com/sec/smartphones/galaxy-s24-ultra/",
        category: "디지털/가전 > 휴대폰 > 스마트폰",
        productType: "1",
        reviewCount: 924,
        rating: "4.8"
      },
      {
        id: "mock_macbook_m3",
        name: `Apple 2024 맥북 에어 13 M3 8G 256G [실제 데이터 아님]`,
        brand: "Apple",
        maker: "Apple",
        mallName: "네이버 스토어",
        image: "https://shop-phinf.pstatic.net/20240305_243/1709600123456_FGHIJ_PNG/MacBook_Air_M3.png",
        lprice: 1390000,
        hprice: null,
        priceFormatted: "₩1,390,000",
        link: "https://search.shopping.naver.com/catalog/46369062618",
        category: "디지털/가전 > 노트북 > 애플",
        productType: "1",
        reviewCount: 215,
        rating: "4.7"
      },
      {
        id: "mock_airpods_pro2",
        name: `Apple 에어팟 프로 2세대 (USB-C) [실제 데이터 아님]`,
        brand: "Apple",
        maker: "Apple",
        mallName: "쿠팡",
        image: "https://shop-phinf.pstatic.net/20230913_143/1694500123456_KLMNO_PNG/AirPods_Pro_2nd_Gen.png",
        lprice: 2980000,
        hprice: null,
        priceFormatted: "₩298,000",
        link: "https://search.shopping.naver.com/catalog/42557551618",
        category: "디지털/가전 > 음향기기 > 이어폰",
        productType: "1",
        reviewCount: 3500,
        rating: "5.0"
      }
    ];

    return new Response(JSON.stringify({
      success: true,
      items: MOCK_ITEMS
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  // 검색어를 네이버 API URL에 삽입 (display 파라미터 동적 적용)
  const NAVER_API_URL = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(queryKeyword)}&display=${display}&sort=sim`;

  try {
    const clientId = env.NAVER_CLIENT_ID;
    const clientSecret = env.NAVER_CLIENT_SECRET;

    // Cloudflare Pages 환경 변수 로드 확인 로그 (내부 로그용)
    console.log(`[AUTH CHECK] clientId: ${clientId ? 'LOADED' : 'MISSING'}, clientSecret: ${clientSecret ? 'LOADED' : 'MISSING'}`);

    if (!clientId || !clientSecret) {
      const missingVar = !clientId ? 'NAVER_CLIENT_ID' : 'NAVER_CLIENT_SECRET';
      return new Response(JSON.stringify({ 
        success: false,
        error: "환경 변수 로드 실패", 
        details: `Cloudflare Dashbaord에 '${missingVar}'가 등록되지 않았거나 값이 없습니다. 
        [Settings] -> [Environment variables]에서 변수 대소문자를 다시 확인하고 'Secret'으로 등록하신 후 반드시 'Redeploy' 해주세요.` 
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
      // For Item Winner logic simulation (since basic API might lack these, we generate realistic ones based on grouping)
      reviewCount: Math.floor(Math.random() * 500) + 10,
      rating: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)
    }));

    function groupProducts(items, globalAvg) {
        if (!items || items.length === 0) return []; // Early Return: 데이터가 없을 경우 빈 배열 반환
        
        const groups = {};
        items.forEach(item => {
            // grouping logic
        });
    }

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
