const puppeteer = require("puppeteer");
let email = "";
let password = "";
let cTab;
let browserOpenPromise = puppeteer.launch 
({
    headless : false,
    defaultViewport:null,
    args: ["--start-maximized"]
});
browserOpenPromise //fulfill
    .then(function (browser){
    console.log("browser is open");
    //console.log(browser);
    let allTabsPromise = browser.pages(); //An array of all open pages inside the Browser.
    return allTabsPromise;                                                                    // CHAINING
    })                                                                                       // OF
    .then(function (allTabsArr) {                                                           //PROMISES
        cTab = allTabsArr[0]; // cTab->(current tab)
        console.log("new Tab");
        //url to navigate page to 
        let visitingLoginPromisePage = cTab.goto("https://www.hackerrank.com/auth/login");
        return visitingLoginPromisePage;
    })
    .then(function () {
        console.log("hackerRank login page opened");
        let emailWillBeTypedPromise = cTab.type("input[name = 'username']", email);
        return emailWillBeTypedPromise;
    })
    .then(function () {
        console.log("email is typed");
        let passwordWillBeTypedPromise = cTab.type("input[type = 'password']", password);
        return passwordWillBeTypedPromise
    })
    .then(function () {
        console.log("password has been typed");
        let willBeLoggedInPromise = cTab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
        return willBeLoggedInPromise;
    })
    .then(function () {
        console.log("logged into hackerrank successfully");
    })
    .catch(function (err) {
        console.log("error");
    });