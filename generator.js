var fs=require("fs"),
svg2ttf=require("svg2ttf"),
md5=require("MD5")
fs.readFile(__dirname+"/static/font.svg","utf8",function(e,d){
	var char1=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","&#32;","&#160;"],
	charRand=[],
	send={}
	shuffle(char1)
	char1.forEach(function(c,i){
		charRand.push("&#"+(200+i)+";")
	})
	var char2=char1.splice(0,32)
	send.seed=md5(rand(25,50))
	fs.exists(__dirname+"/static/gen/font_"+send.seed+"._map_",function(e){
		if(e){
			send.map=JSON.parse(fs.readFileSync(__dirname+"/static/gen/font_"+send.seed+"._map_"))
			process.send(send)
			process.exit(1)
		}
		send.map={}
		char1.forEach(function(c,i){
			send.map[c]=charRand.shift()
			var regex=new RegExp("\""+c+"\"","g")
			d=d.replace(regex,"\""+send.map[c]+"\"")
		})
		var ttf=svg2ttf(d)
		fs.writeFileSync(__dirname+"/static/gen/font_a_"+send.seed+".ttf",new Buffer(ttf.buffer))
		d=fs.readFileSync(__dirname+"/static/font.svg","utf8")
		char2.forEach(function(c,i){
			send.map[c]=charRand.shift()
			var regex=new RegExp("\""+c+"\"","g")
			d=d.replace(regex,"\""+send.map[c]+"\"")
		})
		var ttf=svg2ttf(d)
		fs.writeFileSync(__dirname+"/static/gen/font_b_"+send.seed+".ttf",new Buffer(ttf.buffer))
		fs.writeFileSync(__dirname+"/static/gen/font_"+send.seed+"._map_",JSON.stringify(send.map))
		process.send(send)
	})
})
function rand(l,h){
    return Math.floor(Math.random()*(h-l+1)+l)
}
function shuffle(a){
	var array=a,currentIndex=array.length,temporaryValue,randomIndex
	while (0!==currentIndex){
		randomIndex=Math.floor(Math.random()*currentIndex)
		currentIndex-=1
		temporaryValue=array[currentIndex]
		array[currentIndex]=array[randomIndex]
		array[randomIndex]=temporaryValue
	}
}
