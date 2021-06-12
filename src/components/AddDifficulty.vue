<template>
  <div class="difficultyLevel">
    <h3>Select Level: </h3>
    <select :disabled="startedGame" @change="selectDifficulty">
      <option value="easy" class="level">Easy</option>
      <option  value="medium" class="level">Medium</option>
      <option  value="hard" class="level">Hard</option>
    </select>
  </div>
</template>

<script>
export default {
  props:{
    startedGame: {
      type: Boolean,
      required: true
    }
  },
  emits: {
    "add-difficulty": (val)=> typeof val === 'object'
  },
  data() {
    return {
      difficulty: {
        easy: { duration:840, startAnim:8 , endAnim:4, music: 600},
        medium: { duration:670 , startAnim:4, endAnim:2, music: 400},
        hard: { duration:440, startAnim:0.24, endAnim:0.12, music: 200},
      },
    }
  },

  mounted() {
    this.$emit('add-difficulty', this.difficulty.easy)
  },


  methods: {
    selectDifficulty(e){
      const elem = e.target.options
      const selectedDifficulty = elem[elem.selectedIndex].value
      this.$emit('add-difficulty', this.difficulty[selectedDifficulty])
    },
  }
}
</script>
