const sounds = {
  _commonSounds: [
    new Audio(require('../assets/sounds/oneSound.mp3')),
    new Audio(require('../assets/sounds/twoSound.mp3')),
    new Audio(require('../assets/sounds/threeSound.mp3')),
    new Audio(require('../assets/sounds/fourSound.mp3')),
  ],
  _gameOverSound: [ new Audio(require('../assets/sounds/gameOver.mp3'))],

  getSounds(){
    return this._commonSounds
  },
  getGameOverSound(){
    return this._gameOverSound
  },


  pauseMusic(music, playTime){
    setTimeout(() => {
      music.pause()
      music.currentTime = 0
    }, playTime)
  },
  playGameOverSound(){
    this._gameOverSound[0].play()
    this.pauseMusic(this._gameOverSound, 1000)
  },
  playSounds(clearNum, playTime) {
    this._commonSounds[clearNum].play()
    this.pauseMusic(this._commonSounds[clearNum], playTime)
  },
}

export default sounds