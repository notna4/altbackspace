var search = require('youtube-search');
const Store = require('electron-store');
const {electron, BrowserWindow} = require('electron');
const {app} = require('electron');
let fs = require("fs");
const { stringify } = require('querystring');
const { read } = require('original-fs');
const store = new Store();
const ipc = require('electron').ipcRenderer;
var obj = {
    table: []
};


var link = "https://www.youtube.com/results?search_query=";
var videoLink = "https://www.youtube.com/watch?v=";
/* var searchLink = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + inp + "&key=AIzaSyCE4oJY8WUSJ77Y6T7gETtfoYr7VEbipVo"; */

document.addEventListener('keyup', closeWin);
var slashes = 0;
var isGoogle = 0;
var isYouTube = 0;
var isAuto = 0;
var canDelete = 0;
var isFirst = 0;
var letters = 0;

function closeWin(e) {
    console.log(e.code);
    let inpVal = document.querySelector("input").value;
    console.log(inpVal);
    var Gsuggestions = "http://suggestqueries.google.com/complete/search?client=chrome&ds=yt&q="; // google suggestions
    //console.log("suggestions: " + suggestions + inpVal);

    if(inpVal == '') {
        console.log("gol " + inpVal);
        slashes = 0;
        isAuto = 0;
        deleteObj();
        canDelete = 0;
        isFirst = 0;
        isYouTube = 0;
        isGoogle = 0;
    }
    else if (inpVal == "/") {
        slashes = 1;
        isFirst = 1;
        isAuto = 1;
    }
    else if (inpVal == "//") {
        slashes = 2;
        isFirst = 1;
    }
    
    if(e.code === "Enter") {
        console.log("INFOS: " + isYouTube + " " + isGoogle);
        let inp = document.querySelector("input").value;
        //console.log(inp);
        //get rid of all slashes in front of the word
        while(inp.charAt(0) === '/')
        {
            inp = inp.substring(1);
        }

        if(isGoogle === 1) {
            require('electron').shell.openExternal("https://www.google.com/search?q=" + inp);
            wait(5000);
            /* 
            window.close(); */
        }
        else if (isYouTube === 1) {
            var YTsearchLink = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + inp + "&key=AIzaSyCE4oJY8WUSJ77Y6T7gETtfoYr7VEbipVo";
            //require('electron').shell.openExternal(searchLink);
            //var data = JSON.parse(searchLink);
            //console.log(searchLink);
            $.getJSON(YTsearchLink, function(data) {
                // JSON result in `data` variable
                //console.log(data.items[0].id.videoId);
                var id = data.items[0].id.videoId;
                var myVideo = videoLink + id;
                require('electron').shell.openExternal(myVideo);
                console.log(myVideo);
                wait(5000);
                /* wait(5000);
                window.close(); */
            });
        }
        else if (inp.toLowerCase() == "yes or no") {
            var title = document.getElementById("titles");
            let random = getRandomArbitrary(0, 101);
            if(Math.ceil(random) > 49) {
                title.textContent = "Yes (" + Math.ceil(random) + "/100)";
            }else {
                title.textContent = "No (" + Math.ceil(random) + "/100)";
            }
        }
        else {
            console.log("mate");
            isYouTube = 0;
            isGoogle = 0;
            var showNr = document.getElementById("titles");
            var input = document.getElementById("inp");
            var res = eval(inp);
            showNr.textContent = inp + " = " + res;
            input.value = res;
        }

    }
    else if (e.code === "Slash") {
       // slashes = slashes + 1;
        //console.log(slashes + " " + isGoogle);
    }
    else if (e.code === "Space") {
        if(isAuto) {
            console.log("space broski");
            let inp = document.querySelector("input").value;
            console.log(inp);
            //get rid of all slashes in front of the word
            while(inp.charAt(0) === '/')
            {
                inp = inp.substring(1);
            }
            if(inp != '') {
                get(inp);
            }
        }
    }

    let inp = document.getElementById("inp");
    var titles = document.getElementById("titles");
    var sign = document.getElementById("sign");

    if(slashes == 1 && isFirst == 1) {
        //inp.style.border = "6px solid #F4B400";
        //titles.textContent = 'Google';
        /* sign.style.backgroundColor = 'rgba(244,160,0, 0.45)'; */
        sign.style.backgroundColor = 'white';
        sign.style.color = "#F4B400";
        sign.textContent = 'G';
        isGoogle = 1;
        isYouTube = 0;
    }
    else if (slashes == 2 && isFirst == 1) {
        //inp.style.border = "6px solid #FF0000";
        //titles.textContent = 'YouTube';
        /* sign.style.backgroundColor = 'rgba(255, 0, 0, 0.45)'; */
        sign.style.backgroundColor = 'white';
        sign.style.color = "#FF0000";
        sign.textContent = 'Y';
        isGoogle = 0;
        isYouTube = 1;
    }
    else {
        //inp.style.border = "6px solid rgba(31, 30, 30, 0.938)";
        //titles.textContent = '';
        //titles.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        sign.style.backgroundColor = '#141414';
        sign.textContent = '';
        sign.style.color = '#141414';
        isGoogle = 0;
        isYoutube = 0;
        slashes = 0;
    }

    console.log(isGoogle + " " + isYouTube + " " + slashes);


}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
}

var apiKey = 'AIzaSyCE4oJY8WUSJ77Y6T7gETtfoYr7VEbipVo';

function Write(input) {
    fs.writeFile("./file.json", input, 'utf8', function (err, data) {
        if(err) console.log(err);
    });
}

function Read() {
    fs.readFile('./file.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        //console.log(obj.table);
        let len = obj.table.length;

        showClipboard(obj.table, len);
    }});
}

function deleteObj() {
    /* var theP = document.getElementById('myP');
    theP.remove(); */
    var he = document.getElementById('myDiv');
    he.remove();
}

function getYouTubeSuggestions() {
    /* console.log("AM INTRAT");
    var YTsuggestions = "https://clients1.google.com/complete/search?client=youtube&gs_ri=youtube&ds=yt&q=faded&format=5&alt=json";
    //open(YTsuggestions, JSON);
    $.getJSON(YTsuggestions, function(data) {
        // JSON result in `data` variable
        console.log("dataaa " + data);
    }); */
        
}

async function get(input) {
    try {
      const res = await fetch(`http://suggestqueries.google.com/complete/search?client=chrome&ds=yt&q=` + input);
      const json = await res.json();
      //console.log(json[1]);
      if(canDelete == 1) {
          deleteObj();
      }
      var header = document.querySelector("header");
      var theDiv = document.createElement('div');
      theDiv.id = "myDiv";
      theDiv.className = "myDiv";
      header.appendChild(theDiv);
      for(let i = 0; i < 3; i++) {
        var myP = document.createElement("p");
        myP.id = 'myP';
        myP.textContent = json[1][i];
        if(isYouTube) {
            myP.onclick = function(){searchYT(json[1][i])};
        }
        else if(isGoogle) {
            myP.onclick = function(){searchG(json[1][i])};
        }
        if(json[1][i] != undefined) {
            theDiv.appendChild(myP);
        }
        else {
            theDiv.textContent = "Press enter to search.";
            theDiv.style.width = '380px';
        }
      }
      canDelete = 1;
    } catch (err) {
      console.error('err', err);
    }
  
}

function searchYT(inp) {
    var YTsearchLink = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + inp + "&key=AIzaSyCE4oJY8WUSJ77Y6T7gETtfoYr7VEbipVo";
    //require('electron').shell.openExternal(searchLink);
    //var data = JSON.parse(searchLink);
    //console.log(searchLink);
    $.getJSON(YTsearchLink, function(data) {
        // JSON result in `data` variable
        //console.log(data.items[0].id.videoId);
        var id = data.items[0].id.videoId;
        var myVideo = videoLink + id;
        require('electron').shell.openExternal(myVideo);
        console.log(myVideo);
        wait(5000);
        /* wait(5000);
        window.close(); */
    });
}

function searchG(inp) {
    require('electron').shell.openExternal("https://www.google.com/search?q=" + inp);
    wait(5000);
}

$(document).keyup(function(e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
       // <DO YOUR WORK HERE>
       console.log("A FOST APASAT");
       window.close();
   }
});


//from https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
//Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}