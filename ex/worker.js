module.exports = function worker(self){
	self.addEventListener('message',function(msg){
		console.log(msg.data)
	})
}