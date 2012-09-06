function vcardToJSON(vcf){
	var cards = split("END:VCARD", vcf);
	var contacts = new Array();
	var numC = 0;
	
	// append new contacts
	if(g.contacts.length>0){
		numC = g.contacts.length;
		contacts = g.contacts;
	}
	
	for(i in cards){
		var card = cards[i];
		if(card.length>4){
			contacts[numC] = new Object();
			tokens = split("\r\n", card);
			for(j in tokens){
				token = tokens[j];
				bits = split(":", token);
				switch(bits[0]){
					case "FN":
						contacts[numC].name = bits[1];
						break;
					case "TEL;CELL": case "TEL;TYPE=CELL": // Google Contacts vcf export format uses "TEL;TYPE=CELL"
						contacts[numC].cel = bits[1].split("-").join("").split(" ").join("").split(".").join(""); // strips out spaces dashes dots
						if (substr(contacts[numC].cel, 0, 1)=="+"){   // cell number is in the format +cc-areacode-number
							contacts[numC].cc = substr(contacts[numC].cel, 1, 2);  // assumes 2-digit cc, which may not always be the case
							contacts[numC].cel = substr(contacts[numC].cel, 3);
						}else{
							contacts[numC].cc = g.wa.cc;  // assume same country as WhatsApp subscriber
							if (substr(contacts[numC].cel, 0, 1)=="0"){  // cell number is in format 0-areacode-cellnumber
								contacts[numC].cel = substr(contacts[numC].cel, 1);  // drop the leading zero
							}
						}
						break;
					case "PHOTO;ENCODING=BASE64;JPEG":
						contacts[numC].photo = "data:image/jpg;base64," + bits[1];
						break;
					default:
						if(substr(bits[0], 0, 1)==" ")contacts[numC].photo += bits[0];
						break;
				}
			}
			if(contacts[numC].name&&contacts[numC].cel){
				if(contacts[numC].photo=="undefined")contacts[numC].photo="img/dummy.png";
				numC++;
			}
		}
	}
	contacts.sort(compare);
	b = contacts;
	return contacts;
}

function compare(a,b) {
	var res = 0;
	if (a.name < b.name)res = -1;
	if (a.name > b.name)res = 1;
	return res;
}
