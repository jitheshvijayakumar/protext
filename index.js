var express=require("express"),
app=new express(),
cp=require("child_process"),
fs=require("fs"),
opt
app.listen(process.env.PORT || 3000,function(){
	app.use(function(req,res,next){
		console.log(JSON.stringify(req.headers))
		if(req.headers.host=="protext.herokuapp.com"){
			next()
		}
		
	}).use("/static",express.static(__dirname+"/static")).use(function(req,res){
		fs.readFile(__dirname+"/index.htm","utf8",function(e,d){
			d=d.replace(/%SEED%/g,opt.seed)
			d=protext(d,"<h1>","</h1>")
			d=protext(d,"<h2>","</h2>")
			res.send(d)
		})
	})
})
var generator=function(){ 
	cp.fork(__dirname+"/generator.js").on("message",function(m){
		opt=m
		setTimeout(generator,5000)
	})
}
var protext=function(d,tag1,tag2){
	var rx=new RegExp(tag1+"(.*?)"+tag2)
	var m=d.match(rx)
	var m=m[1].split("")
	m.forEach(function(c,i){
		if(c==" "){
			c="&#160;"
		}
		if(opt.map[c]){
			m[i]=opt.map[c]
		}
	})
	rx=new RegExp(tag1+".*?"+tag2)
	return d.replace(rx,tag1+m.join("")+tag2)
}
generator()

