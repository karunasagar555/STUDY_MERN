const puppeteer = require("puppeteer");

let { email, password } = require("./secrets");

// let email = "";
// let password = "";

let codes = require("./codes");

// console.log("Email", email);

let currTab;
let browserOpenPromise = puppeteer.launch(
  //how
  {
    //should
    headless: false, //be
    defaultViewport: null, //our
    args: ["--start-maximized"], //browser
  }
);

//console.log(browserOpenPromise);

browserOpenPromise //fulfill
  .then(function (browser) {
    // got browser (.then is a method which takes function)
    console.log("browser is open");
    //console.log(browserOpenPromise);
    //console.log(browser);

    //An array of all open pages inside the Browser.
    let allTabsPromise = browser.pages(); //pages() method will take and come all the tabs
    return allTabsPromise; // will return all the tabs                                                   // CHAINING
  }) // OF
  .then(function (allTabsArr) {
    //PROMISES
    currTab = allTabsArr[0]; // currTab->(current tab)
    console.log("new Tab");

    //url to navigate page to
    let visitingLoginPromisePage = currTab.goto(
      "https://www.hackerrank.com/auth/login"
    );
    return visitingLoginPromisePage;
  })
  .then(function (data) {
    //console.log(data);
    console.log("hackerRank login page opened");

    //selector(where to type),  data(what to type)
    let emailWillBeTypedPromise = currTab.type(
      "input[name = 'username']",
      email,
      {
        //delay : 100
      }
    );
    return emailWillBeTypedPromise;
  })
  .then(function () {
    console.log("email is typed");
    let passwordWillBeTypedPromise = currTab.type(
      "input[type = 'password']",
      password,
      {
        //delay : 100
      }
    );
    return passwordWillBeTypedPromise;
  })
  .then(function () {
    console.log("password has been typed");
    let willBeLoggedInPromise = currTab.click(
      ".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled"
    );
    return willBeLoggedInPromise;
  })
  .then(function () {
    console.log("logged into hackerrank successfully");

    //waitAndClick will wait for the selector to load and then click on the node
    let algorithmTabWillBeOpenedPromise = waitAndClick(
      "div[data-automation= 'algorithms']"
    );
    return algorithmTabWillBeOpenedPromise;
  })
  .then(function () {
    console.log("algorithms page is opened");
    let allQuesPromise = currTab.waitForSelector(
      "a[data-analytics = 'ChallengeListChallengeName']"
    );
    return allQuesPromise;
  })
  .then(function () {
    function getAllQuesLinks() {
      let qEle = document.querySelectorAll("a[data-analytics='ChallengeListChallengeName'] .challengecard-title");

      let allElemArr = document.querySelectorAll(
        "a[data-analytics = 'ChallengeListChallengeName']"
      );
      let linksArr = [];
      for (let i = 0; i < allElemArr.length; i++) {
        let name = qEle[i].innerText.split("\n")[0];
        linksArr.push({
          question: name,
          link: allElemArr[i].getAttribute("href"),
        });
      }
      return linksArr;
    }

    let linksArrPromise = currTab.evaluate(getAllQuesLinks);
    return linksArrPromise;
  })
  .then(async function (linksArr) {
    console.log("links to all ques recieved");
    console.log("linksArr printed", linksArr);

    //link to the question to be solved, index of the linksArr
    let questionWillBeSolvedPromise;
    for (let i = 0; i < linksArr.length; i++) {
        if(codes[linksArr[i].question]) {
            questionWillBeSolvedPromise = await questionSolver(linksArr[i]); // qsns solve karta hai
        } 
    }
    return questionWillBeSolvedPromise;
    //return new Promise.resolve("done");
  })
  .then(function () {
    console.log("question is solved");
  })
  .catch(function (err) {
    console.log(err);
  });

function waitAndClick(algoBtn) {
  let waitClickPromise = new Promise(function (resolve, reject) {
    let waitForSelectorPromise = currTab.waitForSelector(algoBtn);
    waitForSelectorPromise // if fulfilled
      .then(function () {
        let clickPromise = currTab.click(algoBtn);
        return clickPromise;
      })
      .then(function () {
        resolve();
      })
      .catch(function (err) {
        reject(err);
      });
  });
  return waitClickPromise;
}

function questionSolver(q) {
  return new Promise(function (resolve, reject) {
    let fullLink = `https://www.hackerrank.com${q.link}`;
    let goToQuesPagePromise = currTab.goto(fullLink);
    goToQuesPagePromise
      .then(function () {
        
        // check the custom input box mark
        let waitForCheckBoxAndClickPromise = waitAndClick(".checkbox-input");
        return waitForCheckBoxAndClickPromise;
      })
      .then(function () {
        // Select the box where code will be typed
        let waitForTextboxToAppearPromise =
          currTab.waitForSelector(".custominput");
        return waitForTextboxToAppearPromise;
      })
      .then(function () {
          let codeWillBeTypedPromise = currTab.type(".custominput",codes[q.question]);
          return codeWillBeTypedPromise;
      })
      .then(function () {
        //control key is pressed promise
        let controlPressedPromise = currTab.keyboard.down("Control");
        return controlPressedPromise;
      })
      .then(function () {
        let aKeyPressedPromise = currTab.keyboard.press("a");
        return aKeyPressedPromise;
      })
      .then(function () {
        let xKeyPressedPromise = currTab.keyboard.press("x");
        return xKeyPressedPromise;
      })
      .then(function () {
        let ctrlIsReleasedPromise = currTab.keyboard.up("Control");
        return ctrlIsReleasedPromise;
      })
      .then(function () {
        //select the editor promise
        let cursorOnEditorPromise = currTab.click(
          ".monaco-editor.no-user-select.vs"
        );
        return cursorOnEditorPromise;
      })
      .then(function () {
        // control key is pressed promise
        let controlPressedPromise = currTab.keyboard.down("Control");
        return controlPressedPromise;
      })
      .then(function () {
        let aKeyPressedPromise = currTab.keyboard.press("a");
        return aKeyPressedPromise;
      })
      .then(function () {
        let vKeyPressedPromise = currTab.keyboard.press("v");
        return vKeyPressedPromise;
      })
      .then(function () {
        let controlDownPromise = currTab.keyboard.up("Control");
        return controlDownPromise;
      })
      .then(function () {
        let submitButtonClickedPromise = currTab.click(".hr-monaco-submit");
        return submitButtonClickedPromise;
      })
      .then(function() {
          return currTab.waitFor(5000);
      })
      .then(function () {
        console.log(q.question,"code submitted successfully");
        resolve();
      })
      .catch(function (err) {
        reject(err);
      });
  });
}
