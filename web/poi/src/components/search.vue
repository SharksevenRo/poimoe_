<template>

	<div style="background: rgb(249, 245, 239);">
        <search></search>

        <no-search-result v-show="CGList.length === 0"></no-search-result>

    	<div class="col-md-6 col-md-offset-3" style="padding-top:15px;">

    		<div class="timeline" v-for="item in CGList">
				<div class="col-xs-2" style="padding-right:0px">
					<div class="timeline-author">
						<div style="background-image:url({{item.photo | photoNullToVision}})" class="imgdiv"></div>
					</div>
				</div>
				<div class="col-xs-10" style="padding-bottom:12px;">
					
					<div class="timeline-new content">

						<div class="timeline-content-header">
							<div class="header-left">
								{{item.user_id.username | nullToVisual}}
							</div>
							<div class="header-right">
								{{item.updatedAt}}
							</div>
						</div>

						<div class="timeline-new-section" style="background-image:url({{item.image}})"></div>

						<div class="timeline-content-footer">
							<div class="timeline-content">
								<span>{{item.content}}</span>
								<div class="timeline-tags">
									<span @click="toSearchPage(tag.name)" v-for="tag in item.tag_list">#{{tag.name}}</span>
								</div>
							</div>
							<div class="timeline-real-footer">
								<ul>
									<li @click="viewPeopleWhoLikeThis(item._id)">
										{{item.likeCnt | numberToZero}}个收藏
									</li>
									<li @click="likeThis(item._id)">
										<span class="glyphicon glyphicon-heart-empty"></span>
									</li>
									<li @click="transferThis(item._id)">
										<span class="glyphicon glyphicon-transfer"></span>
									</li>
								</ul>
							</div>
						</div>

					</div>

				</div>
			</div>
    	</div>

    </div>

</template>

<script>

	import util from '../commons/scripts/commons.js';
    import search from './search/search.vue';
    import noSearchResult from './error/nodata.vue';

	export default {
		data() {

			return {
                keywordSearched: '',
                displayNavSearch: false,

                CGList: {}
			}

		},

		components: {
			'search': search,
			'noSearchResult': noSearchResult
		},

		methods: {

			init: function() {

			},

			loadThisSearchNav: function() {
                util.resetNavSearchSize();
                this.displayNavSearch = true;
            },

            hideThisSearchNav: function() {
                this.displayNavSearch = false;
            },

            pipeToSearchInput: function(key) {
                this.keywordSearched = key;
            },

            toSearchPage: function(name) {
				util.pathToSearch(name);
				search.props.keywords.default = name;
            }

		},

		created() {

			var _this = this;

			noSearchResult.props.content.default = "搜索结果为空";

			search.props.keywords.default = router._currentRoute.params.keywords;
			_this.$set('keywordSearched', router._currentRoute.params.keywords);
			var key = _this.$get('keywordSearched');

			if(key != '') {

				var servicesInterval = setInterval(function() {

					if(typeof window.services != 'undefined') {

						clearInterval(servicesInterval);

						window.services.SiteService.search(key, 1, 10).then(function(res) {

							var code = res.data.code;
							var data = res.data.message;

							if(code != 200) {
								util.messageBox(data);
								return false;
							}

							_this.$set('CGList', data);

						}, function(err) {
							util.handleError(err);
						});

					}

				}, 1);

			}
		}
	}

</script>

<style>



</style>