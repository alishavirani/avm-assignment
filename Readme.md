# Assignment

## Installing / Getting started
Enter your API key in config.js

```
npm install
```
```
node test.js
```

## About
Fetches a document from http://norvig.com/big.txt, does cleanup by removing punctuations, numbers, backslashes and stop words. Then it counts the frequency of every word and retains the top 10 highest frequency words. Using https://dictionary.yandex.net/api/v1/dicservice.json/lookup?lang=en-en, it gets the part of speech, synonmys of top 10 words and returns it along with its frequency in a JSON object.