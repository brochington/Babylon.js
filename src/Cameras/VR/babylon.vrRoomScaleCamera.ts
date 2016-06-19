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

          this._viewMatrix = Matrix.Identity();

          this._consoleTimer = 0;

          this._hmdOrigin = new Vector3(0, 0, 0);
        }

        private _vrDisplay; // VRDisplay
        private _vrEnabled; // bool
        public _viewMatrix;
        private _consoleTimer;
        private _hmdOrigin;


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

        _updatePosition2() {
          const oldPosition = this.position;
          const pose = this._vrDisplay.getPose();
          const {sittingToStandingTransform, sizeX, sizeZ} = this._vrDisplay.stageParameters;
          var standMatrix = Matrix.FromArray(sittingToStandingTransform);
          const {position, orientation} = pose;
          const [x, y, z] = position;
          // var sst = Matrix.FromArray(sittingToStandingTransform);

          if (position === null || orientation === null) {
            console.warn('position or orientation are null...', pose);
            return;
          }

          var workMatrix = Matrix.Identity().toArray();

          // var positionVector = new Vector(x, y, z);

          workMatrix = this.fromRotationTranslation(workMatrix, orientation, position);
          workMatrix = Matrix.FromArray(workMatrix);
          workMatrix = workMatrix.multiply(standMatrix);
          // const temp = this._hmdOrigin.subtractFromFloats(x, y, z);
          // this.position = temp;
          // this.position.x = x;
          this.position.y = workMatrix.toArray()[13];
          // this.position.z = z;
          // this.position.x = ((temp.x + 1) / (2 / sizeX));
          // this.position.addInPlace(temp);
          // this.position.y = position[1];
          // this.position.z = position[2];
          // this.position.x = ((position[0] + 1) / (2 / sizeX));
          // this.position.y = position[1];
          // this.position.z = ((position[2] + 1) / (2 / sizeZ)); // needs to be -

          if (this._consoleTimer % 20 === 0) {
            console.log("HMD location", position);
            // console.log('temp', temp, this.position, orientation);
            console.log('workMatrix', workMatrix, this.position);
            // console.dir(this.getWorldMatrix());
            // console.log("this.position", this.position, sizeX, sizeZ);
          }

          //
          // var myMatrix = Matrix.Compose(
          //   new Vector3(0, 0, 0),
          //   new Quaternion(orientation[0], orientation[1], (orientation[2]), (orientation[3])),
          //   new Vector3(0, 3, 0)
          // );

          // if (this._consoleTimer % 20 === 0) {
          //   console.log('myMatrix', myMatrix);
          // }

          // Matrix.multiplyToRef(sittingToStandingTransform, myMatrix);
          // myMatrix.multiplyToRef(standMatrix, myMatrix);
          // var orientationMatrix = Matrix.FromArray
          // this._viewMatrix = workMatrix;
          // console.log(myMatrix);

          this.rotationQuaternion.x = orientation[0];
          this.rotationQuaternion.y = orientation[1];
          this.rotationQuaternion.z = orientation[2];
          this.rotationQuaternion.w = orientation[3];
          // this.position.addInPlace(this.cameraDirection);
          this.rotationQuaternion.z *= -1;
          this.rotationQuaternion.w *= -1;
          // console.time('tempPoseMatrix');
          // let tempPoseMatrix = Matrix.Identity();
          // console.timeEnd('tempPoseMatrix');
          // console.log("before", tempPoseMatrix);
          // console.dir(Matrix.FromArray(sittingToStandingTransform));
          // this.fromRotationTranslation(tempPoseMatrix, orientation, position);
          // let newPoseMatrix = new Matrix();
          // console.log('after', tempPoseMatrix.multiply(standMatrix));
          // tempPoseMatrix = tempPoseMatrix.multiply(standMatrix);

          // this.viewMatrix = tempPoseMatrix;
          // this.rotationQuaternion = this.rotationQuaternion.fromRotationMatrix(tempPoseMatrix);
          // console.dir(this.rotationQuaternion.fromRotationMatrix(tempPoseMatrix));
          // this.renderSceneView(this._vrDisplay.getEyeParameters('left'));
          // this.renderSceneView(this._vrDisplay.getEyeParameters('right'));
          // console.log(this.getViewMatrix());
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
                    this._vrDisplay.resetPose();
                    this.position = new Vector3(0, 3, 0);
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
            // console.log('_getVRViewMatrix.....');
            return this._viewMatrix;
            // return Matrix.Identity();
        }
        // rigCamera._getViewMatrix = rigCamera._getVRViewMatrix;

        public getTypeName(): string {
            return "VRRoomScaleCamera";
        }
    }
}
