const { GET_DOCUMENT, WORD_INFO, API_KEY} = require("./config");
const { httpGet } = require("./http");

//stop words from nltk
const stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now','','said', 'pierre'];

const getWordFrequency = text => {
    const wordCount = {}
    //text cleanup
    let modifiedText = text.replace(/[0-9]/g, '');;
    modifiedText = modifiedText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
    modifiedText = modifiedText.replace(/\r?\n|\r/g, " ");
    modifiedText = modifiedText.replace(/\t/g, '');
    modifiedText = modifiedText.replace(/\"/g, '');

    const words = modifiedText.toLowerCase().split(" ");
    for (let word of words) {
        word = word.trim();
        if (!stopwords.includes(word)) {
            if (word in wordCount) {
                wordCount[word] = ++wordCount[word];
            } else {
                wordCount[word] = 1;
            }
        }
    }
    return wordCount;
}

const getTopTenWords = wordObj => {
    const arr = [];
    for (const key in wordObj) {
        arr.push({ key: key, val: wordObj[key] });
    }

    arr.sort(function (a, b) {
        return b.val - a.val;
    });
    //return top 10 words
    return arr.slice(0, 10);
}

const getWordsInfo = async words => {
    const wordInfo = {};
    for (word of words) {
        const api = `${WORD_INFO}&key=${API_KEY}&text=${word.key}`;
        const resp = await httpGet(api);
        
        const synonyms = resp.def[0].tr.map(x => x.text);
        wordInfo[word.key] = {
            count: word.val,
            synonyms,
            pos: resp.def[0].pos
        }
    }
    return wordInfo;
}

httpGet(GET_DOCUMENT)
    .then(async (result) => {
        const wordFrequency = getWordFrequency(result);

        const topTenWords = getTopTenWords(wordFrequency);

        const wordInfo = await getWordsInfo(topTenWords);
        console.log(wordInfo)
    })