import YTPlayer from 'yt-player'
const player = new YTPlayer('#player')

player.load('GKSRyLdjsPA')
player.play()
player.setVolume(100)

player.on('playing', () => {
  console.log(player.getDuration()) // => 351.521
})
