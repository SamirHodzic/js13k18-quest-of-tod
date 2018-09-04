import TinyMusic from './TinyMusic';

export default class Sound {
  constructor() {
    this.ac = typeof AudioContext !== 'undefined' ? new AudioContext : new webkitAudioContext;
    this.key = [
      'E6 e',
      'E4 q'
    ];
    this.scroll = [
      'E5 e',
      'E3 q'
    ];

    this.lead = [
      'D4 q',
      'F4 q',
      'D4 q',
      'F4 q',
      'E4 q',
      'G4 q',
      'E4 q',
      'G4 q',
      'F4 q',
      'E4 q',
      'F4 q',
      'E4 q',
      'D4 q'
    ];
    this.harmony = [
      'D4 q',
      'A4 e',
      'D4 q',
      'D4 e',
      'E4 q',
      'D4 e',
      'E4 q',
      'D4 e',
      'F4 q',
      'E4 e',
      'G4 e',
      'F4 e',
      'G4 e',
      'F4 e',
      'D4 q'
    ];

    this.sequence1 = new TinyMusic.Sequence(this.ac, 100, this.lead);
    this.sequence2 = new TinyMusic.Sequence(this.ac, 100, this.harmony);

    this.keyTake = new TinyMusic.Sequence(this.ac, 100, this.key);
    this.keyTake.loop = false;
    this.keyTake.tempo = 300;
    this.keyTake.staccato = 0.55;

    this.scrollTake = new TinyMusic.Sequence(this.ac, 100, this.scroll);
    this.scrollTake.loop = false;
    this.scrollTake.tempo = 300;
    this.scrollTake.smoothing = 1;

    this.sequence1.staccato = 0.55;
    this.sequence2.staccato = 0.55;

    this.sequence1.gain.gain.value = 0.1;
    this.sequence2.gain.gain.value = 0.05;
    this.keyTake.gain.gain.value = 0.1;
    this.scrollTake.gain.gain.value = 0.1;
  }

  play(tempo) {
    if (!this.muted) {
      this.sequence1.stop();
      this.sequence2.stop();
      this.sequence1.tempo = tempo;
      this.sequence2.tempo = tempo;
      this.sequence1.play(this.ac.currentTime);
      this.sequence2.play(this.ac.currentTime);
    }
  }

  keySound() {
    this.keyTake.play(this.ac.currentTime);
  }

  scrollSound() {
    this.scrollTake.play(this.ac.currentTime);
  }

  mute() {
    if (!this.muted) {
      this.sequence1.gain.gain.value = 0;
      this.sequence2.gain.gain.value = 0;
      this.keyTake.gain.gain.value = 0;
      this.scrollTake.gain.gain.value = 0;
      this.muted = true;
    } else {
      this.sequence1.gain.gain.value = 0.1;
      this.sequence2.gain.gain.value = 0.05
      this.keyTake.gain.gain.value = 0.1;
      this.scrollTake.gain.gain.value = 0.1;
      this.muted = false;
    }
  }
}
