module BABYLON {
    export class VRRoomScaleCamera extends FreeCamera {
        constructor(name: string, position: Vector3, scene: Scene, compensateDistortion = true) {
          super(name, position, scene);
          let that = this;

          this.setCameraRigMode(Camera.RIG_MODE_VIVE, {});
          this.onAnimationFrame = this.onAnimationFrame.bind(this); // use () => {}?
          this._updatePosition = this._updatePosition.bind(this);
          this.inputs.addVRDisplay();

          this.rotationQuaternion = new Quaternion();

          this.poseMatrix = new Matrix();
          this.viewMatrix = new Matrix();

          console.log('rotationQuaternion', this.rotationQuaternion);
        }

        private _vrDisplay; // VRDisplay
        private _vrEnabled; // bool
        private poseMatrix;
        private viewMatrix;

        // stolen from http://glmatrix.net/docs/mat4.js.html#line1449
        fromRotationTranslation(out, q, v) {
            // Quaternion math
            var x = q[0], y = q[1], z = q[2], w = q[3],
                x2 = x + x,
                y2 = y + y,
                z2 = z + z,
                xx = x * x2,
                xy = x * y2,
                xz = x * z2,
                yy = y * y2,
                yz = y * z2,
                zz = z * z2,
                wx = w * x2,
                wy = w * y2,
                wz = w * z2;
            out[0] = 1 - (yy + zz);
            out[1] = xy + wz;
            out[2] = xz - wy;
            out[3] = 0;
            out[4] = xy - wz;
            out[5] = 1 - (xx + zz);
            out[6] = yz + wx;
            out[7] = 0;
            out[8] = xz + wy;
            out[9] = yz - wx;
            out[10] = 1 - (xx + yy);
            out[11] = 0;
            out[12] = v[0];
            out[13] = v[1];
            out[14] = v[2];
            out[15] = 1;
            return out;
        }

        renderSceneView(eye) {
        }

        _updatePosition() {
          console.log('_updatePosition');
          console.log('_rigCameras');
          console.log(this._rigCameras);
          const oldPosition = this.position;
          const pose = this._vrDisplay.getPose();
          const {position, orientation} = pose;

          this.position.x = position[0]; // need to take into account height
          this.position.y = position[1];
          this.position.z = position[2];

          this.rotationQuaternion.x = orientation[0];
          this.rotationQuaternion.y = orientation[1];
          this.rotationQuaternion.z = orientation[2];
          this.rotationQuaternion.w = orientation[3];

          this.rotationQuaternion.z *= -1;
          this.rotationQuaternion.w *= -1;

          this.fromRotationTranslation(this.poseMatrix, orientation, position);

          this.renderSceneView(this._vrDisplay.getEyeParameters('left'));
          this.renderSceneView(this._vrDisplay.getEyeParameters('right'));

          this._vrDisplay.submitFrame(pose);
        }

        onAnimationFrame() {
          // this._vrDisplay.requestAnimationFrame(this.onAnimationFrame);
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
                console.log("Engine");
                console.dir(this.getEngine());
                const renderingCanvas = this.getEngine().getRenderingCanvas();
                this._vrDisplay.requestPresent([{source: renderingCanvas }]).then(() => {
                  if (this._vrDisplay.isPresenting) {
                    const pose = this._vrDisplay.getPose();
                    console.log('pose', pose);
                    const leftEye = this._vrDisplay.getEyeParameters('left');
                    const rightEye = this._vrDisplay.getEyeParameters('right');

                    // console.log('eyes..', leftEye, rightEye);

                    renderingCanvas.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
                    renderingCanvas.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);

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
