const cheerio = require("cheerio");

let html = `<ul id="fruits">
  <li class="apple">Apple</li>
  <li class="orange">Orange</li>
  <li class="pear">Pear</li>
</ul>`;

// cheerio stores the data in the form of object
let selecTool = cheerio.load(html);

let fruitName = selecTool(".pear");
console.log(fruitName.text());

let fruitNameArr = selecTool("#fruits");
console.log(fruitNameArr.text());

