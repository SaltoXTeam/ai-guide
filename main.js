const chatForm = document.getElementById('chat-form');
const chatFormSuccess = document.getElementById('chat-form-success');
const chatResList = document.getElementById("chat-res-list");

const guideToProductButton = document.getElementById("guide-to-product-button");
const guideAiSendButton = document.getElementById("chat-form__send-button");

let promptCounter = 0;
let isFormSent = false;
const cookieName = 'guideBot';

if (typeof Cookies.get(cookieName) !== 'undefined') {
    isFormSent = true;
}

const getAiGuideForm = document.getElementById("get-ai-guide-form");
const getAiGuideFormBlock = document.getElementById("get-ai-guide-form-block");
const aiGuideRequestGroup = document.getElementById("ai-guide-request-group");

getAiGuideFormBlock.addEventListener('submit', function(event) {
    isFormSent = true;
    Cookies.set(cookieName, true, { expires: 180 })
    checkGuideAccess();
});

const setCookieIfExcess = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const linkedinFormParam = urlParams.get('linkedin-form');
    const productFormParam = urlParams.get('product-access');
    if(linkedinFormParam){
        isFormSent = true;
        Cookies.set(cookieName, true, { expires: 180 })
    }
    if(productFormParam === 'true'){
        isFormSent = true;
        Cookies.set(cookieName, true, { expires: 180 })
    }
}

setCookieIfExcess();

const incPromptCounter = () => {
    promptCounter++;
}

const checkGuideAccess = () => {
    //setPositionToBlur();

    if (isFormSent){
        aiGuideRequestGroup.style.display = "grid";
        guideToProductButton.style.display = "none";
        guideAiSendButton.style.display = "flex";
        //getAiGuideForm.style.display = "none";
    }else{
        aiGuideRequestGroup.style.display = "grid";
        guideToProductButton.style.display = "flex";
        guideAiSendButton.style.display = "none";
        //getAiGuideForm.style.display = "flex";
    }
}

const setPositionToBlur = () => {
    const elements = document.querySelectorAll('.guide-bot-blur-message');

    elements.forEach(element => {
        if (promptCounter === 0){
            element.style.display = 'none';
        }else{
            if (isFormSent){
                element.style.display = 'none';
            }else{
                element.style.display = 'flex';
            }
        }
    });
}

checkGuideAccess();

const inputElement = document.querySelector('.input-field__guide-search');

const wrapperElement = document.querySelector('.input-field__guide-search-wrapper');

inputElement.addEventListener('focus', function () {
    wrapperElement.style.outline = 'solid 1.5px #7564f2';
    wrapperElement.style.background = '#fff';
});

inputElement.addEventListener('blur', function () {
    wrapperElement.style.outline = 'solid 1px #E1E1E4';
    wrapperElement.style.background = '#F6F6F8';
});

function removePNumber(inputText) {
    const extractedPageNumbers = [];

    const cleanedText = inputText.replace(/\[P(\d+)(?:,\s*P(\d+))*\]/g, (match, ...pageNumbers) => {
        extractedPageNumbers.push(...pageNumbers);
        return '';
    });

    const updatedText = cleanedText.replace(/pages\s+(\d+)\s+and\s+(\d+)(?:\s+respectively)?/gi, (match, pageNumber1, pageNumber2) => {
        extractedPageNumbers.push(pageNumber1, pageNumber2);
        return 'Salto X Guide';
    });

    const finalText = updatedText.replace(/page\s+(\d+)/gi, (match, pageNumber) => {
        extractedPageNumbers.push(pageNumber);
        return '';
    });

    // Replace PDF-related text
    const replacedText = finalText.replace(/(?:of the pdf|in the pdf|of the pdf|in the pdf|pdf)/gi, 'Salto X Guide');

    return {
        text: replacedText.trim(),
        pageNumbers: extractedPageNumbers.length > 0 ? extractedPageNumbers : null
    };
}

function setLink(pageNumber) {

    switch (true) {
        case pageNumber === 2:
            linkText = "Get Ready";
            linkToPage = '/resources/stock-option-ai-guide/design-the-plan';
            linkDisplay = 'flex';
            break;
        case pageNumber >= 3 && pageNumber <= 10:
            linkText = "Design “The Plan”";
            linkToPage = '/resources/stock-option-ai-guide/design-the-plan';
            linkDisplay = 'flex';
            break;
        case pageNumber >= 11 && pageNumber <= 14:
            linkText = "Formalise";
            linkToPage = '/resources/stock-option-ai-guide/formalise';
            linkDisplay = 'flex';
            break;
        case pageNumber >= 11 && pageNumber <= 14:
            linkText = "Launch";
            linkToPage = '/resources/stock-option-ai-guide/launch';
            linkDisplay = 'flex';
            break;
        case pageNumber >= 15 && pageNumber <= 20:
            linkText = "Launch";
            linkToPage = '/resources/stock-option-ai-guide/launch';
            linkDisplay = 'flex';
            break;
        case pageNumber >= 21 && pageNumber <= 22:
            linkText = "Run";
            linkToPage = '/resources/stock-option-ai-guide/run';
            linkDisplay = 'flex';
            break;
        case pageNumber >= 23 && pageNumber <= 25:
            linkText = "Scale";
            linkToPage = '/resources/stock-option-ai-guide/scale';
            linkDisplay = 'flex';
            break;
        case pageNumber >= 26 && pageNumber <= 29:
            linkText = "Trade";
            linkToPage = '/resources/stock-option-ai-guide/trade';
            linkDisplay = 'flex';
            break;
        case pageNumber >= 30 && pageNumber <= 35:
            linkText = "Tax";
            linkToPage = '/resources/stock-option-ai-guide/tax';
            linkDisplay = 'flex';
            break;
        case pageNumber >= 36 && pageNumber <= 40:
            linkText = "Glossary";
            linkToPage = '/resources/stock-option-ai-guide/glossary';
            linkDisplay = 'flex';
            break;
        default:
            linkText = "Unknown";
            linkToPage = '/resources/stock-option-ai-guide';
            linkDisplay = 'none';
            break;
    }

    return linkText;
}

let loadingIndicator = false;

const startLoading = () => {
    sendButtonLoader.style.display = 'flex';
    sendButton.style.display = 'none';
    loadingIndicator = true;
}

const stopLoading = () => {
    sendButtonLoader.style.display = 'none';
    sendButton.style.display = 'flex';
    loadingIndicator = false;
}

const sendButtonLoader = document.getElementById("chat-form__send-button-loader")
const sendButton = document.getElementById("chat-form__send-button")

let linkText = '';
let linkToPage = '';
let linkDisplay = 'none';

function chatRequest(event) {
    const chatInputValue = document.getElementById("bot-input").value;
    const apiUrl = "https://api.chatpdf.com/v1/chats/message";
    const sourceId = "cha_yVg7eAVO2HABSq0SihMsP";

    if (!chatInputValue.trim()) {
        return;
    }

    startLoading()

    const message = {
        role: "user",
        content: chatInputValue,
    };

    const config = {
        headers: {
            "x-api-key": "sec_gwH7BUyTzfkZeFBVyyWnEUFoPfUyQVVs",
            "Content-Type": "application/json",
        },
    };

    const data = {
        referenceSources: true,
        sourceId: sourceId,
        messages: [message],
    };

    axios
        .post(apiUrl, data, config)
        .then((response) => {
            incPromptCounter();
            const responseContent = response.data.content;
            let page = removePNumber(responseContent).pageNumbers;
            const updatedText = removePNumber(responseContent).text;
            if (response.data.references.length === 0){
                if (!page){
                    linkText = "Unknown";
                    linkToPage = '/resources/guide';
                    linkDisplay = 'none';
                }else{
                    setLink(page[0])
                }
            }else{
                setLink(response.data.references[0].pageNumber)
            }

            stopLoading();

            // Create and insert the user input message element
            const userInputElement = document.createElement("div");
            userInputElement.className = "guide-bot_message";
            userInputElement.innerHTML = `
          <img src="https://assets.website-files.com/6489d73ffc842475c9236ff4/64e5c0142e84a3a9bd29d78b_person-avatar.svg"
            loading="lazy" alt="person" class="icon__24x24">
          <div class="group flex _1-col">
            <div class="text is--body is--bold is--color-neutral-900">You</div>
            <div class="text is--body-default is--regular is--color-neutral-900">${chatInputValue}</div>
          </div>
        `;

            // Create and insert the bot response message element
            const botResponseElement = document.createElement("div");
            botResponseElement.className = "guide-bot-message-container";
            botResponseElement.innerHTML = `
    			<div class = "guide-bot-blur-message"></div>
          <img src="https://assets.website-files.com/6489d73ffc842475c9236ff4/64e5c0132e8d1b07d19909e9_bot.svg"
            loading="lazy" alt="bot" class="icon__24x24">
          <div class="group flex _1-col gap-24">
            <div class="group flex _1-col">
              <div class="text is--body is--bold is--color-neutral-900">AI Bot</div>
              <div class="text is--body-default is--regular is--color-neutral-900">${updatedText}</div>
            </div>
            <a style = "display: ${linkDisplay};" href="${linkToPage}" class="link is--body-default is--regular is--color-purple-500">Guide: ${linkText}</a>
          </div>
        `;
            chatResList.insertBefore(botResponseElement, chatResList.firstChild);
            chatResList.insertBefore(userInputElement, chatResList.firstChild);
            document.getElementById("bot-input").value = "";
            document.getElementById('chat-res-list').scrollTop = 0;
            checkGuideAccess();
        })
        .catch((error) => {
            console.log("Error:", error.message);
            stopLoading();
        });
}

chatForm.addEventListener('submit', chatRequest);

chatForm.addEventListener("keypress", function(event) {
    if (event.key === "Enter" && loadingIndicator) {
        event.preventDefault();
    }
});

chatForm.addEventListener("keypress", function(event) {
    if (event.key === "Enter" && !isFormSent) {
        event.preventDefault();
    }
});
