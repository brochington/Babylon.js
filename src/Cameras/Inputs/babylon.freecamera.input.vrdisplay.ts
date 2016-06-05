module BABYLON {
    export class FreeCameraVRDisplayInput implements ICameraInput<FreeCamera> {
        camera: VRRoomScaleCamera;

        // private _vrDisplay; // VRDisplay
        // private _vrEnabled; // bool

        constructor() {
          console.log("inside VRRoomScaleCamera constructor");

          // this.onAnimationFrame = this.onAnimationFrame.bind(this); // use () => {}?
        }

        // onAnimationFrame() {
        //   this._vrDisplay.requestAnimationFrame(this.onAnimationFrame);
        //   console.log(this._vrDisplay.getPose());
        // }

        attachControl(element: HTMLElement, noPreventDefault?: boolean) {
          // console.log('attachControl element');
          // console.dir(this._scene);
          //
          // this._HTMLElement = HTMLElement;
          //
          // if (navigator.getVRDisplays) {
          //   navigator.getVRDisplays().then(displays => {
          //     if (displays.length > 0) {
          //       this._vrDisplay = displays[0];
          //       this._vrEnabled = true;
          //     }
          //
          //     if (this._vrEnabled) {
          //       console.log("this is vr Enabled!!");
          //       console.dir(this);
          //
          //       this._vrDisplay.requestPresent([{source: HTMLElement}]).then(() => {
          //         if (this._vrDisplay.isPresenting) {
          //           this._vrDisplay.requestAnimationFrame(this.onAnimationFrame);
          //         }
          //       })
          //     }
          //   });
          // }
          // window.addEventListener("deviceorientation", this._deviceOrientationHandler);
        }

        detachControl(element: HTMLElement) {
          console.log('detachControl', HTMLElement);
          // window.removeEventListener("deviceorientation", this._deviceOrientationHandler);
        }

        getTypeName(): string {
            return "FreeCameraVRDisplayInput";
        }

        getSimpleName() {
            return "VRDisplay";
        }
    }

    CameraInputTypes["FreeCameraVRDisplayInput"] = FreeCameraVRDisplayInput;
}
