<template>
    <div class="search-box-container">
        <input
            class="search-box" 
            v-model="query" 
            placeholder="Search tweets or people"
            v-on:keyup.enter="searchClicked"
        />

    </div>
</template>

<script>

    export default {
        data(){
            return {
                query:"",
            }
        },
        methods: {
            searchClicked() {
                this.$emit('searched', this.query)
            }
        },
        props: {
            text: String
        },
        created() {
            if (this.text) {
                this.query = this.text
            }
        },
    }

</script>

<style>
.search-box-container {
    height: 10vmin;
    margin: 1.8rem 1.5rem;
} 

.search-box {
    border-radius: 25px;
    border: 2px solid lightgray;
    background-color: inherit;
    /*  padding: 0;*/
    width: 98%;
    height: 100%;  
    font-size: 2rem;
    text-align: center;
}
    
   

</style>