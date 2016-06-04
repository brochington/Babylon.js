module BABYLON {
    export class FreeCameraVRDisplayInput implements ICameraInput<FreeCamera> {
        camera: VRRoomScaleCamera;

        constructor() {
          console.log("inside a constructor");
        }

        attachControl(element: HTMLElement, noPreventDefault?: boolean) {
          console.log('attachControl element', HTMLElement);
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
