import util from 'jan-util';

util.sysUrl = (function () {
	var sysUrl = 'http://sso.kfjuban.com';
	if (process.env.NODE_ENV == 'production') sysUrl = 'http://sso.juban.com';
	return sysUrl
})();

util.layout = function () {
	var url = this.sysUrl;
	if (process.BROWSER_BUILD) {
		console.log('进来了')
		window.location.href = url + '/logout?redirectURL=' + window.location.href.split('/#')[0]
	}
	
}

export default util;
