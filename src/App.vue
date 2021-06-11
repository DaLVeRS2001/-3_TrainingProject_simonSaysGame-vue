<template>
  <div class="simon">
    <h1>Simon Says</h1>
    <div class="wrapper">

      <div class="difficultyLevel">
        <h3>Select Level: </h3>
        <select>
          <option @change="selectDifficulty" :disabled="startedGame" value="Easy" class="level">Easy</option>
          <option @change="selectDifficulty" :disabled="startedGame" value="Medium" class="level">Medium</option>
          <option @change="selectDifficulty" :disabled="startedGame" value="Hard" class="level">Hard</option>
        </select>
      </div>

      <div  class="music">
        Включить музыку:
        <input @click="onMusic" :checked="checkedMusic" type="checkbox">
      </div>


      <div class="game">
        <div class="backShadow"></div>
        <div class="group">
          <div  ref="item1" @mousedown="selectItem" :class="['part', 'one']" id="1"></div>
          <div ref="item2" @mousedown="selectItem" :class="['part', 'two']" id="2"></div>
        </div>
        <div class="group">
          <div ref="item3" @mousedown.="selectItem" :class="['part', 'three']" id="3"></div>
          <div ref="item4" @mousedown="selectItem" :class="['part', 'four']" id="4"></div>
        </div>
      </div>

<!--      data.opacity: 100%;-->


      <div class="menu">
        <div class="round">
          <h3>Round: {{roundNum}}</h3>
          <button @click="nextRound" :disabled="startedGame">Start</button>
        </div>
        <div class="options">
          <h2>Game Options:</h2>
          <div class="option">
            <input :disabled="data.startedRound" value="normal" @change="changeSetting" :checked="setting.normal" type="radio"
                   name="options" />
            <span>Normal</span>
          </div>
          <div class="option">
            <input :disabled="data.startedRound" value="soundOnly" @change="changeSetting" :checked="setting.soundOnly"  type="radio"
                    name="options" />
            <span>Sound Only</span>
          </div>
          <div class="option">
            <input :disabled="data.startedRound" value="lightOnly" @change="changeSetting" :checked="setting.lightOnly" type="radio"
                    name="options" />
            <span>Light Only</span>
          </div>
        </div>
      </div>




    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data(){
    return{
      roundNum: 0,
      checkedMusic: false,
      animationStarted:false,
      data: this.getModel(),
      difficulty: {
        easy: {is: true, duration:620, startAnim:11 , endAnim:5  , allAmount:1500},
        medium: {is: false, duration:560 , startAnim:5.5 , endAnim:2.5  , allAmount:1000},
        hard: {is: false, duration:450, startAnim:0.075 , endAnim:0.037  , allAmount:450},
      },

      setting: {
        normal: true,
        soundOnly: false,
        lightOnly: false
      },
      sounds: [
        new Audio(require('./assets/sounds/oneSound.mp3')),
        new Audio(require('./assets/sounds/twoSound.mp3')),
        new Audio(require('./assets/sounds/threeSound.mp3')),
        new Audio(require('./assets/sounds/fourSound.mp3')),
      ],
      mainSound: [ new Audio(require('./assets/sounds/fullSound.mp3'))]
    };
  },

  mounted() {

    window.addEventListener('mouseup', (e)=> {
     if(this.data.canSelect){
       const elem = e.target
       if(elem.id){
         elem.style.opacity = this.data.opacity+'%'
       }
     }
    })
},

  computed:{
    randomNums(){
      let nums = []
      for (let i = 0; i < this.roundNum; i++){
        const randomNumber = parseInt(Math.random() * 4 + 1)
        nums.push(randomNumber)
      }
      return nums
    },
    startedGame(){
      return this.roundNum > 0
    },
    trueSelections(){
      return this.data.clearSelections.filter(sel=> sel === true)
    },
    matchingSelection(){
      const nums = this.randomNums.join(""),
        selItems = this.data.selectedItems.join("");
      return nums.startsWith(selItems);
    }

  },


    methods: {
      nextRound() {
        this.data.selectedItems = []
        this.data.clearSelections = []
        this.roundNum += 1
        this.start()
      },
      selectDifficulty(e){
        console.log(e);
      },
      onMusic() {
        this.checkedMusic = !this.checkedMusic
        if (this.checkedMusic) {
          this.mainSound[0].play()
        } else {
          this.mainSound[0].pause()
          this.mainSound[0].currentTime = 0
        }
      },
      changeSetting(e) {
        for (let key in this.setting) {
          this.setting[key] = false
        }
        this.setting[e.target.value] = true
        console.log(this.setting);
      },
      selectItem(e) {
        !this.data.startedRound && this.roundNum > 0 ? this.data.canSelect = true : this.data.canSelect = false
        if (this.data.canSelect) {

            const elem = e.target;
            elem.style.opacity = 100 + "%";
            this.data.selectedItems.push(+elem.id);
            this.data.clearSelections.push(this.matchingSelection);
            if (!this.matchingSelection) {
              elem.style.opacity = 45 + "%";
              this.data.lost = true;
              this.roundNum = 0;
              this.data = this.getModel();
            } else {
              if (this.trueSelections.length === this.roundNum) {
                this.nextRound();
              }
            }

        }
      },
      playSounds(clearNum) {
        this.sounds[clearNum].play()
        setTimeout(() => {
          this.sounds[clearNum].pause()
          this.sounds[clearNum].currentTime = 0
        }, 440)
      },
      platAnimation(clearNum, items) {
        this.risingOpacity(items, clearNum)
      },
      //1ый интервал сработал 55 раз\2ой 55 раз
      //easy: ((11 × 55) + (5 × 55)) + 620 = 1500
      //medium:  ((5,5 × 55) + (2,5 × 55)) + 560 = 1000
      //hard: ((0,075 × 55) + (0,037 × 55)) + 450 = 450
      start() {
        const items = [this.$refs.item1, this.$refs.item2, this.$refs.item3, this.$refs.item4]
        this.data.startedRound = true
        this.randomNums.forEach((num, idx) => {
          const clearNum = --num
          console.log(clearNum);
          const time = this.data.animationDuration += 1000
          setTimeout(() => {
            if (this.setting.normal) {
              this.playSounds(clearNum, idx)
              this.platAnimation(clearNum, items, idx)
              console.log('fsadf');
            }
            this.setting.soundOnly && this.playSounds(clearNum, idx)
            this.setting.lightOnly && this.platAnimation(clearNum, items, idx)
            if (idx === this.randomNums.length - 1) {
              this.data.startedRound = false
            }
          }, time)
        })
      },
      risingOpacity(items, num) {
        const frame = setInterval(() => {
          this.data.opacity += 1
          items[num].style.opacity = this.data.opacity + '%'
          console.log('100');
          if (this.data.opacity === 100) {
            clearInterval(frame)
            this.fallingOpacity(items, num)
          }
        }, 5.5)
      },
      fallingOpacity(items, num) {
        const frame = setInterval(() => {
          this.data.opacity -= 1
          items[num].style.opacity = this.data.opacity + '%'
          console.log('45');
          if (this.data.opacity === 45) {
            clearInterval(frame)
            this.data.animationDuration = 0

          }
        }, 2.5)
      },
      getModel() {
        return {
          selectedItems: [],
          animationDuration: 0,
          startedRound: false,
          opacity: 45,
          canSelect: false,
          lost: false,
          clearSelections: [],
        }
      },
    }
}
</script>

<style lang="sass">
@import "assets/styles/main"
</style>
