module BABYLON {
    export class VRRoomScaleCamera extends FreeCamera {
        private _vrDisplay;

        constructor(name: string, position: Vector3, scene: Scene, compensateDistortion = true) {
          super(name, position, scene);
          let that = this;

          this.inputs.addVRDisplay();

          let vrDisplays = navigator.getVRDisplays().then(displays => {
            // console.log('got this far...', displays[0]);
            console.log(scene);
            if (displays.length > 0) {
                this._vrDisplay = displays[0];
                let leftEye = this._vrDisplay.getEyeParameters('left');
                let rightEye = this._vrDisplay.getEyeParameters('right');

                let webglCanvas = scene.getEngine().getRenderingCanvas();

                // console.log(leftEye, rightEye);
                console.log(webglCanvas);
                this._vrDisplay.requestPresent([{source: webglCanvas}]).then(b => {
                  console.log('inside....',this._vrDisplay.isPresenting, b);
                    console.log(this._vrDisplay);
                    console.log(this._vrDisplay.getLayers());
                    console.log(this._vrDisplay.getPose());
                    // this._vrDisplay.requestAnimationFrame(onAnimationFrame);
                });
            }

            function onAnimationFrame (t) {
              that._vrDisplay.requestAnimationFrame(onAnimationFrame);
              // console.log(that._vrDisplay.getPose().orientation[0]);
              // let leftEye = that._vrDisplay.getEyeParameters('left');
              // let rightEye = that._vrDisplay.getEyeParameters('right');
              // console.log(leftEye.fieldOfView.downDegrees);
            }
          })
          // console.log('vrDisplay', navigator.getVRDisplays().then(result => console.log(result)));
        }

        public getTypeName(): string {
            return "VRRoomScaleCamera";
        }
    }
}
