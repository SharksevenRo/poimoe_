module.exports = {

	vue: undefined,

	init: function(v) {
		this.vue = v;

		this.vue.filter('nullRoomNameFilter', function(value) {
			if(value == null || value == undefined || value == ''){
				return '暂无名称';
			}else {
				return value;
			}
		});

		this.vue.filter('numberToZero', function(value) {
			if(value == null || value == undefined) {
				return 0;
			}else {
				return value;
			}
		});
	},

	get: function(filter) {
		return this.vue.filter(filter);
	}

};