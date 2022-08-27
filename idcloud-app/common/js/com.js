export default{
	pageBack(){
		  1 === getCurrentPages().length ? uni.reLaunch({url: "/"}) : uni.navigateBack({})  
		// uni.navigateBack({})
	}
}