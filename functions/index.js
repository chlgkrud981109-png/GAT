const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true }); // 프론트엔드(브라우저)에서 호출할 수 있도록 CORS 전면 허용

// 네이버 쇼핑 검색 API 엔드포인트
const NAVER_API_URL = "https://openapi.naver.com/v1/search/shop.json";

/**
 * Firebase Cloud Function Endpoint: /getNaverProductInfo
 * 프론트엔드에서 `?keyword=아이폰15프로` 형식으로 호출합니다.
 */
exports.getNaverProductInfo = functions.https.onRequest((req, res) => {
  // CORS 처리 래퍼 적용
  cors(req, res, async () => {
    if (req.method !== "GET") {
      return res.status(405).send({ error: "Method Not Allowed" });
    }

    const keyword = req.query.keyword;
    if (!keyword) {
      return res.status(400).send({ error: "keyword 파라미터가 필요합니다." });
    }

    try {
      // Firebase는 .env 파일을 자동 인식하여 process.env 로 불러옵니다.
      const clientId = process.env.NAVER_CLIENT_ID;
      const clientSecret = process.env.NAVER_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error("네이버 API 키가 서버에 환경변수로 설정되어 있지 않습니다.");
      }

      // 실제 네이버 쇼핑 API 호출
      const response = await axios.get(NAVER_API_URL, {
        params: {
          query: keyword,
          display: 1, // 상위 1개 정보만 
          sort: 'sim' // 정확도순
        },
        headers: {
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": clientSecret
        }
      });

      const items = response.data?.items;
      const product = items && items.length > 0 ? items[0] : null;
      
      if (!product) {
        return res.status(404).send({ error: "제품을 찾을 수 없습니다." });
      }

      const priceVal = parseInt(product.lprice, 10);

      // 프론트엔드가 소비하기 편하도록 정제된 데이터를 반환합니다.
      return res.status(200).send({
        success: true,
        priceVal: priceVal,
        priceFormatted: '₩' + priceVal.toLocaleString(),
        productUrl: product.link, // 상품 바로가기 혹은 네이버 페이 연결
        productName: product.title.replace(/<[^>]*>?/g, ''), // <b> 태그 등 HTML 제거
        productImage: product.image
      });

    } catch (error) {
      console.error("Naver API 통신 실패:", error.message);
      return res.status(500).send({ error: "서버에서 네이버 쇼핑 데이터를 불러오는데 실패했습니다.", details: error.message });
    }
  });
});

