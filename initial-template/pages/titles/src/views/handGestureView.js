export default class HandleGestureView {
  loop(fn) {
    requestAnimationFrame(fn);
  }

  scrollPage(top) {
    scroll({ top, behavior: "smooth" });
  }
}
