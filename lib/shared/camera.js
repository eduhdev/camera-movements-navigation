export default class Camera {
    constructor() {
        this.cameraContainer = document.createElement('div')
        this.video = document.createElement('video');
    }
    static async init() {
        if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("Browser API navigator.mediaDevices.getUserMedia is not available")
        }

        const videoConfig = {
            audio: false,
            video: {
                width: globalThis.screen.availWidth,
                height: globalThis.screen.availHeight,
                frameRate: {
                    ideal: 60
                }
            }
        }
        const stream = await navigator.mediaDevices.getUserMedia(videoConfig)
        const camera = new Camera()

        camera.cameraContainer.id = 'camera'

        camera.video.srcObject = stream
        camera.video.width = 240

        camera.cameraContainer.appendChild(camera.video)
        document.body.appendChild(camera.cameraContainer)
        camera.video.style = "transform: scaleX(-1)"

        await new Promise((resolve) => {
            camera.video.onloadeddata = () => {
                resolve(camera.video)
            }
        })

        camera.video.play()
        return camera
    }
}