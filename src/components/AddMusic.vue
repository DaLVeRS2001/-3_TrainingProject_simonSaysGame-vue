<template>
  <div  class="music">
    Включить музыку:
    <label>
      <input @click="onMusic" :checked="checkedMusic" type="checkbox">
    </label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mainSound: [new Audio(require('../assets/sounds/fullSound.mp3'))],
      checkedMusic: false,
    }
  },
  methods: {
    onMusic() {
      this.checkedMusic = !this.checkedMusic
      if (this.checkedMusic) {
        this.mainSound[0].play()
      } else {
        this.mainSound[0].pause()
        this.mainSound[0].currentTime = 0
      }
    },
  }
}
</script>
