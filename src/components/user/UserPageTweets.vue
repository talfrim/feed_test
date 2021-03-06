<template>
    <div class="upt-wrapper">
        <div class="loader-container" v-if="showLoader">
            <Loader />
        </div>
        <TweetPreviewList 
            :hidden="!(currTabName === 'Tweets')" 
            :feedTweetsArr="tweetsResultsArr"
            lsScrollTop="userTweetsScrollTop"
            :restrictHeight="false"
            ref="tpl"
        />
        <TweetPreviewList 
            :hidden="!(currTabName === 'Likes')" 
            :feedTweetsArr="likesResultsArr"
            lsScrollTop="userLikesScrollTop"
            :restrictHeight="false"
            ref="lpl"
        />
    </div>
</template>

<script>
import TweetPreviewList from "../tweets_display/TweetPreviewList.vue"
import Loader from "../Loader.vue";

import {serverGetUserTimeline, serverGetUserLikes} from "../../communicators/serverCommunicator"
import {emptyFromLsByList, addToLsByList, retrieveListFromLs} from "../../assets/globalFunctions"

export default {
    components: {
        TweetPreviewList,
        Loader,
    },
    props:{
        currTabName:{
            type: String,
            required: true
        },
        userName:{
            type: String,
            required: true
        },
        userId:{
            type: String,
            required: true
        }
    },
    data(){
        return{
            showLoader: false,
            tweetsResultsArr: [],
            likesResultsArr: [],
        }
    },
    watch:{
        currTabName(newTabName){
            this.switchTabsAndGetTweets()
        }
    },
    methods:{
        switchTabsAndGetTweets(){
            switch (this.currTabName){
                case "Tweets":
                    this.getTweets();
                    break;
                case "Likes":
                    this.getLikes();
                    break;
                default:
            }
            // Update the scroll position on each list (not relevent since the upgrade to page scroll)
            this.$refs.tpl.updateListScrollPosition();
            this.$refs.lpl.updateListScrollPosition();
        },
        async getTweets(){
            if(this.tweetsResultsArr.length <= 0){ // Don't send request to server if we already have results
                this.showLoader = true;
                const response = await serverGetUserTimeline(this.userId)
                if(response.status == 200){
                    this.tweetsResultsArr.push(...response.data);
                    // Add tweets results to local storage
                    // TODO: Add only the latest 30 or 40 tweets.
                    addToLsByList("tweet", this.tweetsResultsArr, "userTweetsOrder")
                    this.$emit('tweets-arrived')
                }
                // TODO: ELse, show "Try search later"
                this.showLoader = false;
            }
        },
        async getLikes(){
            if(this.likesResultsArr.length <= 0){ // Don't send request to server if we already have results
                this.showLoader = true;
                const response = await serverGetUserLikes(this.userName)
                if(response.status == 200){
                    this.likesResultsArr.push(...response.data);
                    // Add tweets results to local storage
                    // TODO: Add only the latest 30 or 40 tweets.
                    addToLsByList("tweet", this.likesResultsArr, "userLikesOrder")
                    this.$emit('likes-arrived')
                }
                // TODO: ELse, show "Try search later"
                this.showLoader = false;
            }
        },
        resetUserTweets(){
            this.tweetsResultsArr = [];
            this.likesResultsArr = [];
            // Empty the relevant tweets from local storage.
            emptyFromLsByList("tweet", "userTweetsOrder")
            emptyFromLsByList("tweet", "userLikesOrder")
            localStorage.removeItem("userTweetsOrder");
            localStorage.removeItem("userLikesOrder");
            // Reset scroll
            localStorage["userTweetsScrollTop"] = 0
            localStorage["userLikesScrollTop"] = 0
        },
        retreiveUserPageTweetsFromLs(){
            this.tweetsResultsArr = retrieveListFromLs("tweet", "userTweetsOrder")
            this.likesResultsArr = retrieveListFromLs("tweet", "userLikesOrder")
        }
    }
}

</script>

<style lang="scss" scoped>
.upt-wrapper{
    // height: 100%; /* Not mandatory */
    min-height: 101vh; // So that the page won't jump to top when waiting for tweets
    width: 100%;
}

.loader-container{
    height: 8vh;
    display: flex;
    align-items: center;
}
</style>