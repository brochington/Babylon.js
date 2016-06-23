module BABYLON {
    export class VRRoomScaleCamera extends FreeCamera {
        constructor(name: string, position: Vector3, scene: Scene, compensateDistortion = true) {
          super(name, position, scene);

          this.inputs.addVRDisplay();

          this.onAnimationFrame = this.onAnimationFrame.bind(this); // use () => {}?
          this._updatePosition = this._updatePosition.bind(this);
          this.rotationQuaternion = new Quaternion();

          this.minZ = -1;
          this.maxZ = 1;

          this._myViewMatrix = Matrix.Identity();

          this._consoleTimer = 0;

          this._hmdOrigin = new Vector3(0, 0, 0);
        }

        private _vrDisplay; // VRDisplay
        private _vrEnabled; // bool
        public _myViewMatrix : Matrix;
        private _consoleTimer;
        private _hmdOrigin;

        public myPosX = 0;
        public myPosY = 0;
        public myPosZ = 0;



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

        perspective(out, fovy, aspect, near, far) {
          var f = 1.0 / Math.tan(fovy / 2),
              nf = 1 / (near - far);
          out[0] = f / aspect;
          out[1] = 0;
          out[2] = 0;
          out[3] = 0;
          out[4] = 0;
          out[5] = f;
          out[6] = 0;
          out[7] = 0;
          out[8] = 0;
          out[9] = 0;
          out[10] = (far + near) * nf;
          out[11] = -1;
          out[12] = 0;
          out[13] = 0;
          out[14] = (2 * far * near) * nf;
          out[15] = 0;
          return out;
      }

        renderSceneView(eye) {
        }
        // Very slopy, but also very much a work in progress.
        _updatePosition2() {
          const oldPosition = this.position;
          const pose = this._vrDisplay.getPose();
          const {sittingToStandingTransform, sizeX, sizeZ} = this._vrDisplay.stageParameters;
          var standMatrix = Matrix.FromArray(sittingToStandingTransform);
          const {position, orientation} = pose;
          const [x, y, z] = position;

          if (position === null || orientation === null) {
            console.warn('position or orientation are null...', pose);
            return;
          }

          var workMatrix = Matrix.Identity().toArray();
          // corrent...

          var invertedWorkMatrix = Matrix.Identity();
          workMatrix = this.fromRotationTranslation(workMatrix, orientation, position);
          var workMatrix2 = Matrix.FromArray(Array.prototype.slice.call(workMatrix));
          workMatrix2 = workMatrix2.multiply(standMatrix);
          workMatrix2.invertToRef(invertedWorkMatrix);
          var workMatrix2Arr = workMatrix2.toArray();

          var result = Matrix.Compose(
            new Vector3(1, 1, 1),
            new Quaternion(orientation[0], orientation[1], (orientation[2] * -1), (orientation[3] * -1)),
            new Vector3(x, y, z)
          );
          // result.multiply(standMatrix);
          result.invert();

          this._myViewMatrix = result;
          // var resultArr = result.toArray();

          // this.position.x = resultArr[12];
          // this.position.y = resultArr[13];
          // this.position.z = resultArr[14] * -1;
          // this.position.x = workMatrix2Arr[12] * (sizeX * 0.5);
          // this.position.y = workMatrix2Arr[13];
          // this.position.z = workMatrix2Arr[14] * (sizeZ * 0.5) * -1;
          // this.position.x = this.myPosX;
          // this.position.x = this.myPosX;
          // this.position.y = this.myPosY;
          // this.position.z = this.myPosZ;
          // this.position.y = 1;
          // this.position.z = sizeZ * -1;


          if (this._consoleTimer % 90 === 0) {
            console.log('result', result);
            console.log(pose);
            // console.log(workMatrix2);
            // console.log(invertedWorkMatrix);

            // console.log("HMD location", sizeX, sizeZ, position, this.position);
            // console.log('workMatrix2Arr', workMatrix2Arr[12], workMatrix2Arr[13], workMatrix2Arr[14]);
            // console.log(workMatrix2);
            // console.log(workMatrix2, invertedWorkMatrix);
          }

          // Should I be doing ?
          // this.rotationQuaternion = this.rotationQuaternion.fromRotationMatrix(workMatrix2);

          // Or this?
          // this.rotationQuaternion.x = orientation[0];
          // this.rotationQuaternion.y = orientation[1];
          // this.rotationQuaternion.z = orientation[2];
          // this.rotationQuaternion.w = orientation[3];
          //
          // this.rotationQuaternion.z *= -1;
          // this.rotationQuaternion.w *= -1;

          this._vrDisplay.submitFrame(pose);
        }

        onAnimationFrame() {
          // Should this be moved externally to something like engine.runRenderLoop()?
          this._vrDisplay.requestAnimationFrame(this.onAnimationFrame);
          this._updatePosition2();
          this._consoleTimer += 1;
        }
        //
        // public _checkInputs(): void {
        //   super._checkInputs();
        // }

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
                console.log('this camera');
                console.dir(this);

                const renderingCanvas = this.getEngine().getRenderingCanvas();

                this._vrDisplay.requestPresent([{source: renderingCanvas }]).then(() => {
                  if (this._vrDisplay.isPresenting) {
                    // reset position and pose.
                    // this._vrDisplay.resetPose();
                    // this.position = new Vector3(0, 3, 0);
                    const pose = this._vrDisplay.getPose();
                    console.log('pose', pose);
                    const leftEye = this._vrDisplay.getEyeParameters('left');
                    const rightEye = this._vrDisplay.getEyeParameters('right');
                    console.log(leftEye, rightEye);

                    // setting up camera rig here so that we can get eye parameter
                    // data into the metrics.
                    var metrics = new VRRoomScaleMetrics(leftEye, rightEye);
                    console.log('metrics 2', metrics);
                    this.setCameraRigMode(Camera.RIG_MODE_VIVE, {vrRoomScaleMetrics: metrics});
                    // Will need to update camera rigs with eye parameters

                    renderingCanvas.width = metrics.renderingWidth;
                    renderingCanvas.height = metrics.renderingHeight;

                    // this._hmdOrigin = new Vector3(pose.position[0], pose.position[1], pose.position[2]);

                    console.log("_hmdOrigin", this._hmdOrigin);

                    this._vrDisplay.requestAnimationFrame(this.onAnimationFrame);
                  }
                })
              }
            });
          }
        }

        detachControl(element: HTMLElement) {
          console.log('detachControl', HTMLElement);
          super.detachControl(element);
        }

        public createRigCamera(name: string, cameraIndex: number): Camera {
            var rigCamera = new FreeCamera(name, this.position.clone(), this.getScene());

            if (!this.rotationQuaternion) {
              this.rotationQuaternion = new Quaternion();
            }

            rigCamera.rotationQuaternion = new Quaternion();
            rigCamera._cameraRigParams = {};
            // rigCamera._cameraRigParams.vrActualUp = new Vector3(0, 0, 0);
            // rigCamera._getViewMatrix = rigCamera._getVRViewMatrix;

            return rigCamera;
        }

        public _updateRigCameras() {
          for (var i = 0; i < this._rigCameras.length; i++) {
            this._rigCameras[i].position.copyFrom(this.position);
            // Why is rotationQuaternion not present on the Camera?
            this._rigCameras[i].rotationQuaternion.copyFrom(this.rotationQuaternion);
            // console.log(this._rigCameras[i].rotationQuaternion);
            // console.log(this._rigCameras[i].cameraDirection);
            // Why does minZ and maxZ seem to break things?
              // this._rigCameras[i].minZ = this.minZ;
              // this._rigCameras[i].maxZ = this.maxZ;
              // this._rigCameras[i].fov = this.fov;
          }
        }

        public _getViewMatrix(): Matrix {
          // console.log('getViewMatrix');
          if (this._consoleTimer % 90 === 0) {

            console.log('this._myViewMatrix', this._myViewMatrix);
          }
          // return Matrix.Identity();
          return this._myViewMatrix;
        }

        // rigCamera._getViewMatrix = rigCamera._getVRViewMatrix;

        public getTypeName(): string {
            return "VRRoomScaleCamera";
        }
    }
}
