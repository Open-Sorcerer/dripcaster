"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Dialog from "../form/dialog";
import { DripCard } from "..";

type SearchProps = {
  onClick: () => void;
  selectedCards: any[];
};

interface Card {
  name: string;
  image: string;
  address: string;
}

function Search({ onClick, selectedCards }: SearchProps): React.JSX.Element {
  return (
    <search>
      <button
        className="flex w-full items-center gap-3 rounded-lg p-4 md:p-2 md:py-3 md:pl-4 text-sm text-[#909090] shadow-md border border-neutral-400/80 hover:bg-neutral-800/30"
        type="button"
        onClick={onClick}
      >
        <svg
          fill="none"
          height="16"
          viewBox="0 0 16 16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.5">
            <path
              d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
              stroke="#FAFAFA"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M14 14.0001L11.1 11.1001"
              stroke="#FAFAFA"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </g>
        </svg>
        <div className="flex w-full items-center justify-between overflow-clip">
          {selectedCards.length > 0 ? (
            <div className="flex flex-row gap-1.5">
              {selectedCards.slice(0, 5).map((card) => (
                <span
                  key={card.name}
                  className="py-1 px-2 min-w-5 max-w-20 truncate text-neutral-800 bg-teal-300/80 rounded"
                >
                  {card.name}
                </span>
              ))}
              {selectedCards.length > 5 && (
                <span className="py-1 px-2 min-w-5 max-w-20 truncate text-neutral-800 bg-teal-300/80 rounded">
                  {`+${selectedCards.length - 5} more`}
                </span>
              )}
            </div>
          ) : (
            <span>Type a drip collection name...</span>
          )}
        </div>
      </button>
      <div className="text-sm mt-1 text-neutral-400">
        Select criteria of discounts for Drip holders
      </div>
    </search>
  );
}

interface SearchDialogProps {
  isEnabled: boolean;
  setOutsideClick: Dispatch<SetStateAction<boolean>>;
  collection: any;
  selectedCards?: Card[];
  onCardSelect: (card: any) => void;
}

function SearchDialog({
  isEnabled,
  setOutsideClick,
  collection,
  selectedCards,
  onCardSelect,
}: SearchDialogProps): React.JSX.Element {
  const [searchInput, setSearchInput] = useState<string>("");

  const filteredCollection = searchInput
    ? [
        ...(selectedCards ?? []).filter((card) =>
          card.name.toLowerCase().includes(searchInput.toLowerCase()),
        ),
        ...collection.filter(
          (drip: any) =>
            drip.name.toLowerCase().includes(searchInput.toLowerCase()) &&
            !selectedCards?.some((selectedCard) => selectedCard.name === drip.name),
        ),
      ]
    : [
        ...(selectedCards ?? []),
        ...collection.filter(
          (drip: any) => !selectedCards?.some((selectedCard) => selectedCard.name === drip.name),
        ),
      ];
  return (
    <Dialog isEnabled={isEnabled} setOutsideClick={setOutsideClick}>
      <div className="w-[90vw] md:w-[70vw] h-[70vh] md:h-full overflow-y-scroll rounded-lg bg-[#1c1c1c] text-left shadow-xl">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              fill="none"
              height="16"
              viewBox="0 0 16 16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.5">
                <path
                  d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                  stroke="#FAFAFA"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M14 14.0001L11.1 11.1001"
                  stroke="#FAFAFA"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </g>
            </svg>
          </div>
          <input
            autoCorrect="off"
            className="block w-full rounded-t-lg border-b border-b-neutral-700 bg-[#1c1c1c] p-3 pl-10 pr-10 text-sm text-[#F1F5F9] focus:outline-none"
            id="voice-search"
            placeholder="Type a Drip Collection Name or search..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            required
            tabIndex={0}
            type="text"
          />
        </div>
        <div className="p-2 sm:p-4">
          <div className="grid grid-flow-row grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredCollection.length === 0 ? (
              <p className="text-sky-400 text-lg">No collection found.</p>
            ) : (
              filteredCollection.map((item: any) => (
                <DripCard
                  key={item.name}
                  name={item.name}
                  image={item.image}
                  address={item.address}
                  isSelected={
                    selectedCards?.some((selectedCard) => selectedCard.name === item.name) || false
                  }
                  onSelect={() => onCardSelect(item)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

Search.Dialog = SearchDialog;

export default Search;
