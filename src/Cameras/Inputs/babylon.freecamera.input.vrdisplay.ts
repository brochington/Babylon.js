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

        // this is called by FreeCamera _checkInputs.
        public checkInputs() {
          // console.log('calling this, yo');
            // Quaternion.RotationYawPitchRollToRef(BABYLON.Tools.ToRadians(this._alpha), BABYLON.Tools.ToRadians(this._beta), -BABYLON.Tools.ToRadians(this._gamma), this.camera.rotationQuaternion)
            // this._camera.rotationQuaternion.multiplyInPlace(this._screenQuaternion);
            // this._camera.rotationQuaternion.multiplyInPlace(this._constantTranform);
            //Mirror on XY Plane
            // this._camera.rotationQuaternion.z *= -1;
            // this._camera.rotationQuaternion.w *= -1;
        }

        detachControl(element: HTMLElement) {
          console.log('detachControl', HTMLElement);
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
