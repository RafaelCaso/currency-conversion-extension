"use client";

import { useState } from "react";
import { useGlobalState } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";
import { validCurrencySymbols } from "~~/utils/scaffold-eth/currencySymbols";

const API_KEY = process.env.NEXT_PUBLIC_CURRENCY_API_KEY;

const Currency = () => {
  // List of currency symbols and their conversion rate
  const [conversionRates, setConversionRates] = useState<{ [symbol: string]: number }>({});
  // Unix timestamp representing when new conversionRates are available
  const [nextUpdate, setNextUpdate] = useState<number | null>(null);
  // 3 letter symbol denoting which currency to use (ISO 4217 Currency Codes)
  const [appCurrencySymbol, setAppCurrencySymbol] = useState<string>("USD");
  const [inputValue, setInputValue] = useState(appCurrencySymbol);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [usdPrice, setUsdPrice] = useState<number | undefined>(undefined);

  // Transform nativeCurrency.price global variable to reflect new currency
  const setTransformedCurrencyPrice = (newCurrencyValue: number) => {
    const setNativeCurrencyPrice = useGlobalState.getState().setNativeCurrencyPrice;
    const nativeCurrency = useGlobalState.getState().nativeCurrency;

    // Store the original USD price only once
    if (usdPrice === undefined) {
      setUsdPrice(nativeCurrency.price);
    }

    // Reset nativeCurrency.price to the original USD price for accurate conversion
    const priceToConvert = usdPrice ?? nativeCurrency.price;
    const transformedPrice = priceToConvert * newCurrencyValue;

    setNativeCurrencyPrice(transformedPrice);
  };

  // Handle input change and update suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);
    setAppCurrencySymbol(value);

    // Filter suggestions based on input value
    if (value) {
      const filteredSuggestions = validCurrencySymbols.filter(symbol => symbol.includes(value));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async () => {
    // Clear user input
    setInputValue("");
    setSuggestions([]);

    // Validate input currency symbol before updating
    if (!validCurrencySymbols.includes(appCurrencySymbol)) {
      notification.error("Invalid currency symbol");
      return;
    }

    // Get current Unix timestamp to check if API update required
    const now = Math.floor(Date.now() / 1000);
    // If this is the first time calling API, or if update is available, call API
    if (nextUpdate === null || nextUpdate < now) {
      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);

        if (!response.ok) {
          notification.error("Failed to fetch conversion rates");
          throw new Error("Network did not respond");
        }

        const data = await response.json();
        setNextUpdate(data.time_next_update_unix);
        setConversionRates(data.conversion_rates);
        setTransformedCurrencyPrice(data.conversion_rates[appCurrencySymbol]);
        notification.success(`Currency changed to ${appCurrencySymbol}`);
      } catch (error) {
        notification.error("Something went wrong, please try again");
        throw new Error("Failed to process API response");
      }
    }
    // If no update is available, use cached data
    else {
      setTransformedCurrencyPrice(conversionRates[appCurrencySymbol]);
      notification.success(`Currency changed to ${appCurrencySymbol}`);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="card w-96 bg-primary text-primary-content mt-4">
          <div className="card-title justify-center pt-5">
            <h1>Select Currency Symbol</h1>
          </div>
          <div className="card-body">
            <div>
              <input type="text" value={inputValue} onChange={handleInputChange} />
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map(symbol => (
                    <li
                      key={symbol}
                      onClick={() => {
                        setInputValue(symbol);
                        setAppCurrencySymbol(symbol);
                        setSuggestions([]);
                      }}
                      className="suggestion-item"
                    >
                      {symbol}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button className="btn bg-secondary" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Currency;
