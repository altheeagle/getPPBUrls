/* GetPPB URLs Version 1.0 */

function GetPPBUrlsSetup(){
	
	let elSpacer = document.createElement("li");
	elSpacer.innerHTML = "&nbsp;&nbsp;&nbsp;";
	
	let elThanks = document.createElement("li");


	let elUnreadCB = document.createElement("input");
	elUnreadCB.setAttribute("type","checkbox");
	elUnreadCB.setAttribute("id","GetPPBUrls-unread");

	let elUnreadCBlb = document.createElement("label");
	elUnreadCBlb.setAttribute("for","GetPPBUrls-unread");
	elUnreadCBlb.innerText = " Only unread Posts?"


	let elFirstPostCB = document.createElement("input");
	elFirstPostCB.setAttribute("type","checkbox");
	elFirstPostCB.setAttribute("checked","checked");
	elFirstPostCB.setAttribute("id","GetPPBUrls-firstContent");

	let elFirstPostCBlb = document.createElement("label");
	elFirstPostCBlb.setAttribute("for","GetPPBUrls-firstContent");
	elFirstPostCBlb.innerText = " Only first Post in Thread"


	let elThanksCB = document.createElement("input");
	elThanksCB.setAttribute("type","checkbox");
	elThanksCB.setAttribute("id","GetPPBUrls-thanks");

	let elThanksCBlb = document.createElement("label");
	elThanksCBlb.setAttribute("for","GetPPBUrls-thanks");
	elThanksCBlb.innerText = " Thanking each Poster?"


	let elGetPPBUrlsBtn = document.createElement("button");
	elGetPPBUrlsBtn.setAttribute("type","button");
	elGetPPBUrlsBtn.setAttribute("class","button");
	elGetPPBUrlsBtn.innerText = "Get URLs from Posts";


	elThanks.append(elUnreadCB);
	elThanks.append(elUnreadCBlb);
	elThanks.append(elFirstPostCB);
	elThanks.append(elFirstPostCBlb);
	elThanks.append(elThanksCB);
	elThanks.append(elThanksCBlb);

	elThanks.append(elGetPPBUrlsBtn);
	
	
	document.getElementById("nav-breadcrumbs").append(elSpacer);
	document.getElementById("nav-breadcrumbs").append(elThanks);	
	
	if (elGetPPBUrlsBtn.addEventListener) {
		elGetPPBUrlsBtn.addEventListener("click", GetPPBUrlsRun, false);
	} else if (elGetPPBUrlsBtn.attachEvent) {
		elGetPPBUrlsBtn.attachEvent('onclick', GetPPBUrlsRun);
	}
	
};
function toggleDim(){
	
	if (document.getElementById("GetPPBUrls-overlay")) {
		document.getElementById("GetPPBUrls-overlay").remove();
		document.getElementById("loading-indicator").style.display = "none";
	} else {
		document.getElementById("loading-indicator").style.display = "inline";
		let elDimm = document.createElement("div");
		elDimm.setAttribute("id","GetPPBUrls-overlay");
		elDimm.style["background-color"] = "rgba(0,0,0,0.5)";
		elDimm.style.position = "fixed";
		elDimm.style.left = "0";
		elDimm.style.top = "0";
		elDimm.style.width = "100%";
		elDimm.style.height = "100%";
		document.getElementsByTagName("body")[0].append(elDimm);
	}
}

function GetPPBUrlsRun(){
	toggleDim();
	let urls = [];
	let posts;
	if (document.getElementById("GetPPBUrls-unread").checked){
		console.log("unread = true");
		posts = document.querySelectorAll(".unread ");
	} else {
		console.log("unread = false");
		posts = document.querySelectorAll(".topictitle ");
	}

	const thanking = document.getElementById("GetPPBUrls-thanks").checked;
	
	posts.forEach(function(node){
		let href = node.getAttribute("href");
		let url = location.origin + href.slice(1)
		var req = $.ajax( {method: "POST", url:url,async: false});
		req.done(function(data) {
			let topic = $.parseHTML(data);
			let content;
			
			if (document.getElementById("GetPPBUrls-firstContent").checked){
				content = $(".content",topic)[0];
			} else {
				content = $(".content",topic);
			}

			
			$("a",content).each(function(){
				let link = $(this).attr( "href" );
				if (link !== undefined) {
					if (link.indexOf("http") == 0) {
						urls.push(link);	
					}
				}
			});
			if (thanking) {
				let parent = content.parentElement;
				$("a",parent).each(function(){
					let id = $(this).attr( "id" );
					if (id !== undefined) {
						if (id.indexOf("lnk_thanks_") >= 0){
							let href = $(this).attr( "href" );
							let url = location.origin + href.slice(1)
							$.ajax( {method: "POST", url:url,async: false});
						}
					}
				});
			}
		});
	});
	let today = new Date();
	let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	let FileNameTime = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
	let dateTime = date + "_" + time;
	header="##########################################\n# Urls in Posts of Page:\n# " + document.title + "\n# (" + document.baseURI + ")\n# Created at: " + dateTime + "\n# Links found: " + urls.length + "\n##########################################\n";
	toggleDim();
	GetPPBUrlsDownload("urls from " + document.domain + " " + date + FileNameTime + ".txt",header + urls.join("\n"));
};

function GetPPBUrlsPrintLink(link){
	$("#bottom").append(link + "<br>");
}


function GetPPBUrlsDownload(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

GetPPBUrlsSetup();