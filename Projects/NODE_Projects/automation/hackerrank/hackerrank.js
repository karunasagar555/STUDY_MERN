const puppeteer = require("puppeteer");

let {email, password } = require('./secrets');

// console.log("Email", email);

let currTab;
let browserOpenPromise = puppeteer.launch                           //how
({                                                                  //should
    headless : false,                                               //be
    defaultViewport:null,                                           //our
    args: ["--start-maximized"]                                     //browser
});
browserOpenPromise //fulfill
    .then(function (browser){     // got browser (.then is a method which takes function)
    console.log("browser is open");
    //console.log(browser);

    //An array of all open pages inside the Browser.
    let allTabsPromise = browser.pages();  //pages() method will take and come all the tabs 
    return allTabsPromise; // will return all the tabs                                                   // CHAINING
    })                                                                                                      // OF
    .then(function (allTabsArr) {                                                                        //PROMISES
        currTab = allTabsArr[0]; // currTab->(current tab)
        console.log("new Tab");

        //url to navigate page to 
        let visitingLoginPromisePage = currTab.goto("https://www.hackerrank.com/auth/login");
        return visitingLoginPromisePage;
    })
    .then(function () {
        console.log("hackerRank login page opened");

                                                  //selector(where to type),  data(what to type)
        let emailWillBeTypedPromise = currTab.type("input[name = 'username']", email);
        return emailWillBeTypedPromise;
    })
    .then(function () {
        console.log("email is typed");
        let passwordWillBeTypedPromise = currTab.type("input[type = 'password']", password);
        return passwordWillBeTypedPromise
    })
    .then(function () {
        console.log("password has been typed");
        let willBeLoggedInPromise = currTab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
        return willBeLoggedInPromise;
    })
    .then(function () {
        console.log("logged into hackerrank successfully");
        
        //waitAndClick will wait for the selector to load and then click on the node
        let algorithmTabWillBeOpenedPromise = waitAndClick("div[data-automation= 'algorithms']")
        return algorithmTabWillBeOpenedPromise;
    })
    .then(function () {
        console.log("algorithms page is opened");
        let allQuesPromise = currTab.waitForSelector("a[data-analytics = 'ChallengeListChallengeName']");
        return allQuesPromise;

    })
    .then(function(){
        function getAllQuesLinks(){
            let allElemArr = document.querySelectorAll("a[data-analytics = 'ChallengeListChallengeName']");
            let linksArr = [];
            for(let i = 0; i<allElemArr.length; i++){
                linksArr.push(allElemArr[i].getAttribute("href"));
            }
            return linksArr;
        }

        let linksArrPromise = currTab.evaluate(getAllQuesLinks);
        return linksArrPromise;
    })
    .then(function(linksArr){
        console.log("links to all ques recieved");
        console.log(linksArr);
    })
    .catch(function (err) {
        console.log(err);
    });

    function waitAndClick(algoBtn){
        let waitClickPromise = new Promise(function(resolve, reject){
            let waitForSelectorPromise = currTab.waitForSelector(algoBtn);
            waitForSelectorPromise               // if fulfilled
            .then(function(){
                console.log("algo btn is found");
                let clickPromise = currTab.click(algoBtn);
                return clickPromise;
            })
            .then(function(){
                console.log("algo btn is clicked");
                resolve();
            })
            .catch(function(err){
                console.log(err);
            })
        })
        return waitClickPromise;
    }
    