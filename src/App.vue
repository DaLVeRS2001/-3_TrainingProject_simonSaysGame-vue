<template>
  <div class="simon">
    <h1>Simon Says</h1>
    <div class="wrapper">

      <add-difficulty :started-game="startedGame" @add-difficulty="setDifficulty"/>

      <add-music/>

      <div class="game">
        <div class="backShadow"></div>
        <div class="group">
          <div ref="item1" @mousedown="selectItem" :class="['part', 'one']" id="1"></div>
          <div ref="item2" @mousedown="selectItem" :class="['part', 'two']" id="2"></div>
        </div>
        <span v-if="letsGo" class="letsGo">GO</span>
        <span v-if="data.lost" class="lost">YOU LOST</span>
        <div class="group">
          <div ref="item3" @mousedown.="selectItem" :class="['part', 'three']" id="3"></div>
          <div ref="item4" @mousedown="selectItem" :class="['part', 'four']" id="4"></div>
        </div>
      </div>

      <add-game-setting
        :started-game="startedGame"
        :started-round="data.startedRound"
        :round-num="data.roundNum"
        @add-setting="setSettingMode"
        :next-round="nextRound"
      />

    </div>
  </div>
</template>

<script>
import AddMusic from "@/components/AddMusic";
import AddDifficulty from "@/components/AddDifficulty";
import AddGameSetting from "@/components/AddGameSetting";

import sounds from "@/services/sounds";
import {getItems, updateItems}from "@/services/items";


export default {
  name: "App",
  components: { AddGameSetting, AddDifficulty, AddMusic},
  data(){
    return{
      letsGo: false,
      animationTime: null,
      settingMode: null,
      data: this.getModel(),
      sounds: sounds.getSounds(),
      gameOverSound: sounds.getGameOverSound()
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
      for (let i = 0; i < this.data.roundNum; i++){
        const randomNumber = parseInt(Math.random() * 4 + 1)
        nums.push(randomNumber)
      }
      return nums
    },
    startedGame(){
      return this.data.roundNum > 0
    },
    trueSelections(){
      return this.data.clearSelections.filter(sel=> sel === true)
    },
    matchingSelection(){
      const nums = this.randomNums.join(""),
        selItems = this.data.selectedItems.join("");
      return nums.startsWith(selItems);
    },
  },


    methods: {
      nextRound() {
        this.data.selectedItems = []
        this.data.clearSelections = []
        this.data.roundNum += 1
        this.start()
      },

      finishRound(idx){
        if (idx === this.randomNums.length - 1) {
          this.letsGo = true
          setTimeout(()=> this.letsGo = false,500)
          this.data.startedRound = false
        }
      },
      declareRoundResult(elem){
        if (!this.matchingSelection) {
          elem.style.opacity = 45 + '%'
          updateItems(45)
          this.data.lost = true;
          sounds.playGameOverSound()
          setTimeout(()=> {
            this.data = this.getModel();
          }, 1000)
        }else {
          if (this.trueSelections.length === this.data.roundNum) {
            this.nextRound();
          }
        }
      },

      selectItem(e) {
        !this.data.startedRound && this.data.roundNum > 0 ? this.data.canSelect = true : this.data.canSelect = false
        if (this.data.canSelect) {
          const elem = e.target;
          elem.style.opacity = 100 + "%";
          this.data.selectedItems.push(+elem.id);
          this.data.clearSelections.push(this.matchingSelection);
          this.declareRoundResult(elem)
        }
      },

      //1ый интервал сработал 55 раз\2ой 55 раз
      //8-начала цикла + 4-конец цикла = 660-время всего цикла 840-пауза перед циклом 1500 = общее время анимации
      //easy: ((8 × 55) + (4 × 55)=660)+ 840 = 1500
      //medium:  ((4 × 55) + (2 × 55)=330)+ 670 = 1000
      //hard: ((0,24 × 55) + (0,12 × 55)=20)+ 440 = 470 (до 400 не дотянул, наговнокодил)
      start() {
        const items = getItems()
        this.data.startedRound = true
        this.randomNums.forEach((num, idx) => {
          const clearNum = --num
          const time = this.data.animationDuration += this.animationTime.duration
          setTimeout(() => {
            if (this.settingMode.normal) {
              sounds.playSounds(clearNum, this.animationTime.music)
              this.platAnimation(clearNum, items, idx)
            }
            this.settingMode.soundOnly && sounds.playSounds(clearNum, this.animationTime.music)
            this.settingMode.lightOnly && this.platAnimation(clearNum, items, idx)
            this.finishRound(idx)
          }, time)
        })
      },

      platAnimation(clearNum, items) {
        this.risingOpacity(items, clearNum)
      },
      risingOpacity(items, num) {
        const frame = setInterval(() => {
          this.data.opacity += 1
          items[num].style.opacity = this.data.opacity + '%'
          if (this.data.opacity === 100) {
            clearInterval(frame)
            this.fallingOpacity(items, num)
          }
        }, this.animationTime.startAnim)
      },
      fallingOpacity(items, num) {
        const frame = setInterval(() => {
          this.data.opacity -= 1
          items[num].style.opacity = this.data.opacity + '%'
          if (this.data.opacity === 45) {
            clearInterval(frame)
            this.data.animationDuration = 0
          }
        }, this.animationTime.endAnim)
      },

      setDifficulty(difficulty){
        this.animationTime = difficulty
      },
      setSettingMode(mode){
        this.settingMode = mode
      },

      getModel() {
        return {
          roundNum: 0,
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
