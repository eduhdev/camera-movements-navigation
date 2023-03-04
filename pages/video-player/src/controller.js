export default class Controller {
  #view;
  #worker;
  #camera;
  #blinkCounter = 0;

  constructor({ view, worker, camera, videoUrl }) {
    this.#view = view;
    this.#worker = this.#configureWorker(worker);
    this.#camera = camera;

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this));
    this.#view.setVideoSrc(videoUrl);
  }

  static async initialize(deps) {
    const controller = new Controller(deps);
    controller.log("not yet detected eye blink! click in the button to start");
    return controller.init();
  }

  #configureWorker(worker) {
    let ready = false;
    worker.onmessage = ({ data }) => {
      if ("READY" === data) {
        this.#view.enableButton();
        ready = true;
        return;
      }
      const blinked = data.blinked;
      this.#blinkCounter += blinked;
      this.#view.toggleplayVideo()
      console.log("blinked", blinked);
    };

    return {
      send(msg) {
        if (!ready) return;
        worker.postMessage(msg);
      },
    };
  }

  async init() {
    console.log("init");
  }

  loop() {
    const video = this.#camera.video;
    const img = this.#view.getVideoFrame(video);
    this.#worker.send(img);
    this.log("detecting eye blink");

    setTimeout(() => this.loop(), 100);
  }

  log(text) {
    const times = `   - blinked times: ${this.#blinkCounter}`;
    this.#view.log(`status: ${text}`.concat(this.#blinkCounter ? times : ""));
  }

  onBtnStart() {
    this.log("initializing detection...");
    this.#blinkCounter = 0;
    this.loop();
  }
}
