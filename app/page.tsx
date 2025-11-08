import Image from "next/image";

async function getBearerToken(clientId, clientSecret) {
  const AUTH_URL = "https://oauth.battle.net/token";

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

async function getCardList(token) {
  const API_URL = process.env.API_URL;
  const requestHeaders = {
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(API_URL, {
    method: "GET",
    headers: requestHeaders,
  });

  if (!response.ok) {
    throw new Error(`getCardList failed: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export default async function Home() {
  const [clientId, clientSecret] = [
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
  ];
  const accessToken = await getBearerToken(clientId, clientSecret);

  const cardList = await getCardList(accessToken);

  return (
    <div>
      <span>"/"를 눌러 검색하기</span>
      <ol>
        {cardList.cards.map((card, ind) => (
          <li key={ind} className="flex items-center">
            <Image
              width={100}
              height={100}
              alt={"이미지"}
              src={card.image.ko_KR}
            />
            <div>
              <h3 className="text-[24px] font-bold">{card.name.ko_KR}</h3>
              <p dangerouslySetInnerHTML={{ __html: card.text.ko_KR }} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
