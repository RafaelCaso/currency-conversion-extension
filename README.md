# Currency Conversion Extension for ScaffoldETH2

1) Visit [ExchangeRate-API](https://www.exchangerate-api.com/) to get a free API key.

2) In terminal, use the below snippet to bootstrap a new ScaffoldEth project with the currency-conversion-extension

```
npx create-eth@latest -e rafaelcaso/currency-conversion-extension
```

> You will be prompted for a project name and a choice of Hardhat or Foundry

3) After you've initialized your project
```cd your-project-name```
and install packages using
```yarn install```


4) Open the project in your editor of choice and navigate to 
```
|-- packages
|   |-- nextjs
```
and locate the file called .env.example

> rename this to simply .env

Add your API to the .env file using the exact variable name NEXT_PUBLIC_CURRENCY_API_KEY

```NEXT_PUBLIC_CURRENCY_API_KEY="replaceWithAPIKey" ```


Enter these commands in three different terminals
```
yarn chain
yarn deploy
yarn start
```



That's it! You can now open a web browser and go to localhost:3000 and see the project.
In the header you will find the 'Currency' tab which has a simple input to easily convert between over 150 currencies


---

PLEASE NOTE - ExchangeRate-API provides a free key for once-daily conversion rates. To gain access to more frequent updates, you will need to purchase a pro membership.

The Currency Conversion Extension is designed to only call the API when there are updated rates available and cache results to prevent redundant API calls.
