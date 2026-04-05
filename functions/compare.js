export async function onRequestGet(context) {
    const { request, env, next } = context;
    const url = new URL(request.url);

    // If no base and comp parameters exist, just return the static file
    const base = url.searchParams.get('base');
    const comp = url.searchParams.get('comp');

    // Fetch the original static assets (HTML file)
    let response = await next();

    if (!base && !comp) {
        return response;
    }

    // SSR SEO Logic: Fetch Title based on keyword
    let baseName = '어떤 제품';
    let compName = '경쟁 제품';

    if (base) {
         baseName = decodeURIComponent(base).replace(/<[^>]*>?/g, ''); 
    }
    if (comp) {
         compName = decodeURIComponent(comp).replace(/<[^>]*>?/g, '');
    }

    const shortBaseName = baseName.split(' ')[0];
    const shortCompName = compName.split(' ')[0];

    const titleStr = `${shortBaseName} VS ${shortCompName} - 스펙, 최저가 한눈에 비교 | Versus`;
    const descStr = `실시간 데이터를 바탕으로 ${baseName}과 ${compName}의 가격 및 성능을 분석하여 어떤 제품이 가성비가 좋은지 최적의 구매 가이드를 제공합니다.`;

    class SEOHandler {
        element(element) {
            if (element.tagName === 'title') {
                element.setInnerContent(titleStr);
            } else if (element.tagName === 'meta' && element.getAttribute('name') === 'description') {
                element.setAttribute('content', descStr);
            }
        }
    }

    return new HTMLRewriter()
        .on('title', new SEOHandler())
        .on('meta[name="description"]', new SEOHandler())
        .on('head', {
            element(element) {
                // Add Open Graph tags
                element.append(`<meta property="og:title" content="${titleStr}" />`, { html: true });
                element.append(`<meta property="og:description" content="${descStr}" />`, { html: true });
                element.append(`<meta property="og:type" content="article" />`, { html: true });
            }
        })
        .on('#aiSummarySection', {
            element(element) {
                // SSR fallback for robots that do not evaluate JS
                // This gives immediate value to AdSense crawler
                element.setInnerContent(`
                    <article>
                        <h2>${titleStr}</h2>
                        <p>${descStr}</p>
                        <p>웹사이트에 방문하시면 상세 스펙 그래프와 AI가 분석한 객관적인 장점, 단점 비교를 확인하실 수 있습니다.</p>
                    </article>
                `, { html: true });
            }
        })
        .transform(response);
}
