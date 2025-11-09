export async function getBearerToken() {
  const AUTH_URL = "https://oauth.battle.net/token";
  const [clientId, clientSecret] = [
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
  ];

  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = Buffer.from(credentials).toString("base64");
  const body = new URLSearchParams();
  body.append("grant_type", "client_credentials");

  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  });

  if (!response.ok) {
    throw new Error(`Token auth failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function getCardList(token, textFilter: string) {
  const API_URL = process.env.API_URL;
  const requestHeaders = {
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(
    `${API_URL}?locale=ko_KR${textFilter && "&textFilter=" + textFilter}`,
    {
      method: "GET",
      headers: requestHeaders,
    }
  );

  if (!response.ok) {
    throw new Error(`getCardList failed: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const textFilter = searchParams.get("textFilter");
  const accessToken = await getBearerToken();
  const cardList = await getCardList(accessToken, textFilter);
  return Response.json(cardList);
}
