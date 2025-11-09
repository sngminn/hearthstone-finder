"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function LoadingSpinner({ className }) {
  return (
    <div role="status" className={className}>
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">로딩 중...</span>
    </div>
  );
}

function SearchBar({ status, cardList, inputRef, setTextFilter }) {
  return (
    <div className="flex sticky mb-[48px]">
      <input
        placeholder="'/'를 눌러 검색하기"
        className="w-full h-[64px] bg-gray-900 px-[28px] rounded-[12px] focus:outline-0 focus:bg-gray-800"
        onChange={(e) => setTextFilter(e.target.value)}
        ref={inputRef}
      />
      {status === "loading" && cardList && (
        <LoadingSpinner className="absolute right-[24px] top-[50%] translate-y-[-50%]" />
      )}
    </div>
  );
}

function CardItem({ card }) {
  return (
    <li className="flex items-center gap-[12px] pl-[12px] pr-[24px] rounded-[12px] hover:bg-[#ffffff05] cursor-pointer">
      <Image width={100} height={100} alt={"이미지"} src={card.image} />
      <div className="w-full">
        <h3 className="text-[24px] font-semibold text-gray-300">{card.name}</h3>
        <p
          dangerouslySetInnerHTML={{ __html: card.text }}
          className="text-gray-400"
        />
        <hr className="text-gray-800 my-[4px] w-full" />
        <p
          dangerouslySetInnerHTML={{ __html: card.flavorText }}
          className="text-gray-400"
        />
      </div>
    </li>
  );
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function SearchContainer() {
  const [cardList, setCardList] = useState(null);
  const [status, setStatus] = useState("idle");
  const [textFilter, setTextFilter] = useState("");
  const inputRef = useRef(null);
  const debouncedText = useDebounce(textFilter, 200);

  useEffect(() => {
    async function getCards() {
      setStatus("loading");
      try {
        const response = await fetch(
          `/api/cards${debouncedText && "?textFilter=" + debouncedText}`
        );
        if (!response.ok) throw new Error("API 요청 실패");
        const cardList = await response.json();

        setCardList(cardList);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    }
    getCards();
  }, [debouncedText]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative">
      <SearchBar
        status={status}
        cardList={cardList}
        inputRef={inputRef}
        setTextFilter={setTextFilter}
      />
      {status === "loading" && !cardList && (
        <LoadingSpinner className="w-full flex justify-center mt-[32px]" />
      )}
      {status === "error" && <span>데이터를 불러오는데 실패했어요.</span>}
      <ol>
        {cardList &&
          status === "success" &&
          cardList.cards?.map((card) => <CardItem card={card} key={card.id} />)}
      </ol>
    </div>
  );
}
