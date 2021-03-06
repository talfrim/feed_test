<template>
  <div
    class="expandable-image"
    :class="{ expanded }"
    @click="clickedImgDiv()"
    v-lazyload
  >
    <i
      v-if="expanded"
      class="close-button"
    >
      <svg
        style="width: 10vmin; height:10vmin; margin: 1vmin"
        viewBox="0 0 24 24"
      >
        <path
          fill="#666666"
          d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
        />
      </svg>
    </i>
    <img v-bind="$attrs" 
        crossorigin="anonymous" 
        ref="image"
        class="photos"
        @load="imageLoaded()"
        @error="imageLoadError()"
    />
  </div>
</template>

<script>
import ColorThief from 'colorthief';
var colorThief = new ColorThief();

export default {
    props:{   
      blurPhoto:{
        type: Boolean,
        required: false,
        default: false
      }  
    },
    data () {
        return {
          isImageLoaded: false,
          expanded: false,
          closeButtonRef: null,
          backgroundColor: "rgba(171, 166, 166, 0.95)", //defauld background
          isDestroyed: false // Is the component destroyed
        }
    },
    beforeDestroy(){
      this.isDestroyed = true;
      if(this.expanded){
        /* Close the expanded window before detroy */
        this.cloned.style.opacity = 0
        this.closeButtonRef.removeEventListener('click', this.closeImage)
        this.cloned.removeEventListener('touchstart', this.onExpandedImageClick)
        // Remove the cloned element and the references
        this.cloned.remove()
        // Tell root exp. media is closed
        this.$root.setExpandableMediaMode(false)
      }
      window.removeEventListener('popstate', this.windowPopstate)
    },
    created(){
      window.addEventListener('popstate', this.windowPopstate)
    },
    methods: {
      windowPopstate(){
        // Called when the user tries to navigate back (or forward) in browser.
        // Close the exp. img if it is opened
        this.expanded = false
      },
        clickedImgDiv(){
            this.$emit("clicked-photo")
            if(this.isImageLoaded){
              this.expanded = true;
            }
        },
        closeImage (event) {
            this.expanded = false
            event.stopPropagation()
        },
        freezeVp (e) {
            e.preventDefault()
        },
        //Clicking on the background closes the image
        onExpandedImageClick (e) {
            e.stopPropagation()
            const image = this.cloned.querySelector('img')

            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;
            //If the click is between the image boundries and the wrapper,
            //close the expander.
            //const a = image.height;
            //const b = image.width;
            var ratio = image.naturalWidth/image.naturalHeight
            let width = image.height*ratio
            let height = image.height
            if (width > image.width) {
                width = image.width
                height = image.width/ratio
            }
            const a = height;
            const b = width;
            const c = this.cloned.offsetHeight;
            const d = this.cloned.offsetWidth;
            if (
                (x > b + ((d - b) / 2) ) ||
                (y > a + ((c - a) / 2) ) ||
                (x < ((d - b) / 2) ) ||
                (y < ((c - a) / 2) )
            ) {
                this.expanded = false
            }
        },
        imageLoaded(){
          if(this.isDestroyed){
            return;
          }
          /*Get the img main color and make the image visible */
          this.$refs.image.classList.add("photo-display");
          if(this.blurPhoto){
            this.$refs.image.classList.add("blur");
          }
          this.$emit('image-loaded');
          this.isImageLoaded = true;
          const dominentColor = colorThief.getColor(this.$refs.image);
          this.backgroundColor = "rgba("+dominentColor[0]+","+dominentColor[1]+","+dominentColor[2]+",0.95)";
        },
        imageLoadError(){
          if(this.isDestroyed){
            return;
          }
          this.$refs.image.classList.add("photo-display");
          this.$emit('image-load-error');
        }
    },
    watch: {
        expanded (expanded) {
          // Set exp. mode in root
          this.$root.setExpandableMediaMode(expanded)
          this.$nextTick(() => {
          // Run this if when we're expanding the image
          if (expanded) {
            // Clone the entire expandable-image element
            this.cloned = this.$el.cloneNode(true)
            // Store a reference for the close button
            this.closeButtonRef = this.cloned.querySelector('.close-button')
            // Call closeImage when the close button is clicked
            this.closeButtonRef.addEventListener('click', this.closeImage)
            //Clicking on the background closes the image
            this.cloned.addEventListener('touchstart', this.onExpandedImageClick)
            // Add the cloned element into <body>
            document.body.appendChild(this.cloned)
            //Change the background to the dominent color of the image
            this.cloned.style.background = this.backgroundColor;
            // Prevent the page from scrolling
            //document.body.style.overflow = 'hidden'
            setTimeout(() => {
            // Show the cloned element
            this.cloned.style.opacity = 1
            }, 0)
          } else {
            // This section will run when the image is closing
            // Unblur
            if(this.blurPhoto){
              this.$refs.image.classList.remove("blur");
            }
            // Hide the expanded image
            this.cloned.style.opacity = 0
            setTimeout(() => {
            // Then, remove the click event listener from the close button
            this.closeButtonRef.removeEventListener('click', this.closeImage)
            this.cloned.removeEventListener('touchstart', this.onExpandedImageClick)
            // Remove the cloned element and the references
            this.cloned.remove()
            this.cloned = null
            this.closeButtonRef = null
            // Re-enable the scrolling
            //document.body.style.overflow = 'auto'
            }, 250)
          }
          })
        }
    }    
}
</script>

<style scoped>
.expandable-image {
  position: relative;
  transition: 0.5s opacity;
  /* Takes the width and the height of the parent */
    width: 100%;
    height: 100%;
    border-radius: inherit;
  /*cursor: zoom-in;*/
}

.blur{
  filter: blur(11px);
}

.photos{
    object-fit: cover;
    object-position: 22% 22%;

    /* Takes the width and the height of the parent */
    width: 100%;
    height: 100%;
    border-radius: inherit;
    /*border-radius: 15%;*/
    /*border: 0.1rem solid silver;*/
    visibility: hidden; 
    opacity: 0;
    transition: opacity .5s;
}
.photo-display{
    opacity: 1;
    visibility: visible;
}

body > .expandable-image.expanded {
  position: fixed;
  z-index: 999999;
  top: 0;
  left: 0;
  /*width: 100%;
  height: 100%;*/
  /*background: rgba(171, 166, 166, 0.95);*/
  display: flex;
  align-items: center;
  opacity: 0;
  padding-bottom: 0 !important;
  /*cursor: default;*/
}
body > .expandable-image.expanded > img {
  width: 100vmin;
  /*max-width: 1200px;*/
  max-height: 81vh;
  object-fit: contain;
  object-position: unset;
  margin: 0 auto;
  /*background: rgb(255,255,255,0.8);*/
  border: none !important; 
  border-radius: 0 !important;
  filter: none !important;
}
body > .expandable-image.expanded > .close-button {
  display: block;
}
.close-button {
  position: fixed;
  top: 10px;
  right: 10px;
  display: none;
  cursor: pointer;  
}
svg {
  filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.5));
}
svg path {
  fill: #FFF;
}
.expandable-image img {
  width: 100%;
}   
</style>