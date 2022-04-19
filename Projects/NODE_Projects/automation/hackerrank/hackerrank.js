const puppeteer = require("puppeteer");

let {email, password } = require('./secrets');

// let email = "";
// let password = "";

let { answer } = require("./codes");

// console.log("Email", email);

let currTab;
let browserOpenPromise = puppeteer.launch                           //how
({                                                                  //should
    headless : false,                                               //be
    defaultViewport:null,                                           //our
    args: ["--start-maximized"]                                     //browser
});

//console.log(browserOpenPromise);

browserOpenPromise //fulfill
    .then(function (browser){     // got browser (.then is a method which takes function)
    console.log("browser is open");
    //console.log(browserOpenPromise);
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
    .then(function (data) {
        //console.log(data);
        console.log("hackerRank login page opened");

                                                  //selector(where to type),  data(what to type)
        let emailWillBeTypedPromise = currTab.type("input[name = 'username']", email,
        {
            //delay : 100
        });
        return emailWillBeTypedPromise;
    })
    .then(function () {
        console.log("email is typed");
        let passwordWillBeTypedPromise = currTab.type("input[type = 'password']", password, 
        {
            //delay : 100
        });
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
        console.log("linksArr printed", linksArr);
        
                                                         //link to the question to be solved, index of the linksArr
        let questionWillBeSolvedPromise = questionSolver(linksArr[0], 0) ; // qsns solve karta hai
        for(let i = 1; i<linksArr.length; i++){
            questionWillBeSolvedPromise = questionWillBeSolvedPromise.then(function (){
                return questionSolver(linksArr[i], i);
            })
            // a = 10;
            // a = a + 1;
        }
        return questionWillBeSolvedPromise;
    })
    .then(function (){
        console.log("question is solved");
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
                reject(err);
            })
        });
        return waitClickPromise;
    }
    

    function questionSolver(url,idx){
        return new Promise(function(resolve,reject){
                let fullLink = `https://www.hackerrank.com${url}`;
                let goToQuesPagePromise = currTab.goto(fullLink);
                goToQuesPagePromise
                .then(function(){
                console.log("question opened");
                // check the custom input box mark
                let waitForCheckBoxAndClickPromise = waitAndClick(".checkbox-input");
                return waitForCheckBoxAndClickPromise;
            })
            .then(function (){
                // Select the box where code will be typed
                let waitForTextboxToAppearPromise = currTab.waitForSelector(".custominput");
                return waitForTextboxToAppearPromise;
            })
            .then(function (){
                let codeWillBeTypedPromise = currTab.type(".custominput", answer[idx],
                {
                    //delay : 200
                });
                return codeWillBeTypedPromise;
            })
            .then(function (){
                //control key is pressed promise
                let controlPressedPromise = currTab.keyboard.down("Control");
                return controlPressedPromise;
            })
            .then(function (){
                let aKeyPressedPromise = currTab.keyboard.press("a");
                return aKeyPressedPromise;
            })
            .then(function (){
                let xKeyPressedPromise = currTab.keyboard.press("x");
                return xKeyPressedPromise;
            })
            .then(function (){
                let ctrlIsReleasedPromise = currTab.keyboard.up("Control");
                return ctrlIsReleasedPromise;
            })
            .then(function (){
                //select the editor promise
                let cursorOnEditorPromise = currTab.click(".monaco-editor.no-user-select.vs");
                return cursorOnEditorPromise;
            })
            .then(function (){
                // control key is pressed promise
                let controlPressedPromise = currTab.keyboard.down("Control");
                return controlPressedPromise;
            })
            .then(function (){
                let aKeyPressedPromise = currTab.keyboard.press("A");
                return aKeyPressedPromise;
            })
            .then(function (){
                let vKeyPressedPromise = currTab.keyboard.press("V");
                return vKeyPressedPromise;
            })
            .then(function (){
                let controlDownPromise = currTab.keyboard.up("Control");
                return controlDownPromise;
            })
            .then(function (){
                let submitButtonClickedPromise = currTab.click(".hr-monaco-submit");
                return submitButtonClickedPromise;
            })
            .then(function (){
                console.log("code submitted successfully");
                resolve();
            })
            .catch(function(err){
                reject(err);
            });
        });
        
    }