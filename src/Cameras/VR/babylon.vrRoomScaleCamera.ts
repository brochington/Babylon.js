module BABYLON {
    export class VRRoomScaleCamera extends FreeCamera {
        constructor(name: string, position: Vector3, scene: Scene, compensateDistortion = true) {
          super(name, position, scene);
          let that = this;
          this.onAnimationFrame = this.onAnimationFrame.bind(this); // use () => {}?
          this._updatePosition = this._updatePosition.bind(this);
          this.inputs.addVRDisplay();

          this.rotationQuaternion = new Quaternion();

          console.log('rotationQuaternion', this.rotationQuaternion);

          // let vrDisplays = navigator.getVRDisplays().then(displays => {
          //   // console.log('got this far...', displays[0]);
          //   console.log(scene);
          //   if (displays.length > 0) {
          //       this._vrDisplay = displays[0];
          //       let leftEye = this._vrDisplay.getEyeParameters('left');
          //       let rightEye = this._vrDisplay.getEyeParameters('right');
          //
          //       let webglCanvas = scene.getEngine().getRenderingCanvas();
          //
          //       // console.log(leftEye, rightEye);
          //       console.log(webglCanvas);
          //       this._vrDisplay.requestPresent([{source: webglCanvas}]).then(b => {
          //         console.log('inside....',this._vrDisplay.isPresenting, b);
          //           console.log(this._vrDisplay);
          //           console.log(this._vrDisplay.getLayers());
          //           console.log(this._vrDisplay.getPose());
          //           // this._vrDisplay.requestAnimationFrame(onAnimationFrame);
          //       });
          //   }
          //
          //   function onAnimationFrame (t) {
          //     that._vrDisplay.requestAnimationFrame(onAnimationFrame);
          //     // console.log(that._vrDisplay.getPose().orientation[0]);
          //     // let leftEye = that._vrDisplay.getEyeParameters('left');
          //     // let rightEye = that._vrDisplay.getEyeParameters('right');
          //     // console.log(leftEye.fieldOfView.downDegrees);
          //   }
          // })
          // console.log('vrDisplay', navigator.getVRDisplays().then(result => console.log(result)));
        }

        private _vrDisplay; // VRDisplay
        private _vrEnabled; // bool

        // var updatePosition = (newPos) => {
        //     this._newPosition.copyFrom(newPos);
        //
        //     this._newPosition.subtractToRef(this._oldPosition, this._diffPosition);
        //
        //     var oldPosition = this.position.clone();
        //     if (this._diffPosition.length() > Engine.CollisionsEpsilon) {
        //         this.position.addInPlace(this._diffPosition);
        //         if (this.onCollide && collidedMesh) {
        //             this.onCollide(collidedMesh);
        //         }
        //     }
        // }

        _updatePosition() {
          const oldPosition = this.position;
          const pose = this._vrDisplay.getPose();
          const {position, orientation} = pose;

          this.position.x = position[0];
          this.position.y = position[1];
          this.position.z = position[2];

          this.rotationQuaternion.x = orientation[0];
          this.rotationQuaternion.y = orientation[1];
          this.rotationQuaternion.z = orientation[2];
          this.rotationQuaternion.w = orientation[3];

          this.rotationQuaternion.z *= -1;
          this.rotationQuaternion.w *= -1;

          this._vrDisplay.submitFrame(pose);
        }

        onAnimationFrame() {
          this._vrDisplay.requestAnimationFrame(this.onAnimationFrame);
          this._updatePosition();
        }

        attachControl(element: HTMLElement, noPreventDefault?: boolean) {
          if (navigator.getVRDisplays) {
            navigator.getVRDisplays().then(displays => {
              if (displays.length > 0) {
                this._vrDisplay = displays[0];
                this._vrEnabled = true;
              }

              if (this._vrEnabled) {
                console.log("this is vr Enabled!!");
                console.dir(this);
                const renderingCanvas = this.getEngine().getRenderingCanvas();
                this._vrDisplay.requestPresent([{source: renderingCanvas }]).then(() => {
                  if (this._vrDisplay.isPresenting) {
                    const pose = this._vrDisplay.getPose();
                    console.log('pose', pose);
                    this._vrDisplay.requestAnimationFrame(this.onAnimationFrame);
                  }
                })
              }
            });
          }
          // window.addEventListener("deviceorientation", this._deviceOrientationHandler);
        }

        detachControl(element: HTMLElement) {
          console.log('detachControl', HTMLElement);
          // window.removeEventListener("deviceorientation", this._deviceOrientationHandler);
        }

        public getTypeName(): string {
            return "VRRoomScaleCamera";
        }
    }
}
