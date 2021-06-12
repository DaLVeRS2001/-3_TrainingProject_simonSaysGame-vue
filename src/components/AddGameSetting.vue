<template>
  <div class="menu">
    <div class="round">
      <h3>Round: {{roundNum}}</h3>
      <button @click="nextRound" :disabled="startedGame">Start</button>
    </div>

    <div class="options">
      <h2>Game Options:</h2>
      <div class="option">
        <input
          :disabled="startedRound" value="normal" @change="changeSetting"
          :checked="setting.normal" type="radio" name="options"
        />
        <span>Normal</span>
      </div>
      <div class="option">
        <input
          :disabled="startedRound" value="soundOnly" name="options"
          @change="changeSetting" :checked="setting.soundOnly" type="radio"
        />
        <span>Sound Only</span>
      </div>
      <div class="option">
        <input
          :disabled="startedRound" name="options"
          value="lightOnly" @change="changeSetting" :checked="setting.lightOnly" type="radio"
        />
        <span>Light Only</span>
      </div>
    </div>

  </div>
</template>



<script>
export default {
  props: {
    startedRound: {
      type: Boolean,
      required: true
    },
    startedGame: {
      type: Boolean,
      required: true
    },
    roundNum: {
      type: Number,
      required: true
    },
    nextRound: {
      type: Function,
      required: true
    }
  },
  emits: {
    'add-setting': (val)=> typeof val === 'object'
  },

  data(){
    return {
      setting: {
        normal: true,
        soundOnly: false,
        lightOnly: false
      },
    }
  },

  mounted() {
    this.$emit("add-setting", {normal: this.setting.normal});
  },

  methods: {
    changeSetting(e) {
      for (let key in this.setting) {
        this.setting[key] = false
      }
      this.setting[e.target.value] = true
      this.$emit('add-setting', {[e.target.value]: this.setting[e.target.value]})
    },
  },

}

</script>