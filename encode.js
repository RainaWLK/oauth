//for URI encoding
var encoding_code = new Array("20", "22", "23", "24", "25", "26", "27", "2B", "2C", "2F", "3A", "3B", "3C", "3D", "3E", "3F", "40", "5B", "5C", "5D", "5E", "60", "7B", "7C", "7D", "7E");
var encoding_char = new Array(' ', '"', '#', '$', '%', '&', '\'', '+', ',', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '`', '{', '|', '}', '~');

function asciiToHex(ascii)
{
	var hex = "";
	
	if(ascii == null)
		return "";
	
	for(var i = 0; i < ascii.length; i++)
	{
		var dec = ascii.charCodeAt(i);
		var str = "";
	
		str = parseInt(dec/16, 10);
		
		if(str > 9)
		{
			str = String.fromCharCode(str+55);
		}
		
		if((dec%16) > 9)
		{
			str += String.fromCharCode((dec%16)+55);
		}
		else
		{
			str += (dec%16)+"";
		}
		hex += str;
	}
	return hex;
}

function encode_char_text(msg)
{
	var str = "";
	
	if(msg == null)
		return "";
	
	for(var i = 0; i < msg.length; i++)
	{
		var ch = msg.substring(i, i+1);
		var find = false;
	
		for(var j = 0; j < encoding_char.length; j++)
		{
			if(ch == encoding_char[j])
			{
				find = true;
			}
		}
		
		if(find)
		{
			str += "%" + asciiToHex(ch);		
		}
		else
		{
			str += ch;
		}
	}
	
	return str;
}

exports.uriEncode = encode_char_text;