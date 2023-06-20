import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const domain = request.nextUrl.searchParams.get('domain') || undefined;
    if (!domain) {
        return new Response("Please provide domain as search query parameter", {
            status: 404
        })
    }
  
    const [configResponse, domainResponse] = await Promise.all([
      fetch(
        `https://api.vercel.com/v6/domains/${domain}/config?teamId=${process.env.TEAM_ID_VERCEL}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      ),
      fetch(
        `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      ),
    ])
  
    const configJson = await configResponse.json()
    const domainJson = await domainResponse.json()
    if (domainResponse.status !== 200) {
      return new Response(JSON.stringify(domainJson), { status: domainResponse.status })
    }
  
    /**
     * If domain is not verified, we try to verify now
     */
    let verificationResponse = null
    if (!domainJson.verified) {
      const verificationRes = await fetch(
        `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}/verify?teamId=${process.env.TEAM_ID_VERCEL}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      )
      verificationResponse = await verificationRes.json()
    }
  
    if (verificationResponse && verificationResponse.verified) {
      /**
       * Domain was just verified
       */
      return new Response(JSON.stringify({
        configured: !configJson.misconfigured,
        ...verificationResponse,
      }), { status: 200 })
    }
  
    return new Response(JSON.stringify({
      configured: !configJson.misconfigured,
      ...domainJson,
      ...(verificationResponse ? { verificationResponse } : {}),
    }), { status: 200} )
  }