const request = require("request");
request("https://www.worldometers.info/coronavirus/", cb);

function cb(err,res,body)  // res : response 
{
    console.error("error", err); //Prints the error if encountered
    console.log(res);   //Prints the response status code if a response was received
    console.log(body);  //Prints the html of the mentioned link
}


